from fastapi import APIRouter, HTTPException
from typing import List
import random
import json
import os
from app.models.assessment import (
    AssessmentStartRequest,
    AssessmentStartResponse, 
    AssessmentSubmission,
    AssessmentResults,
    Question,
    QuestionResponse,
    BigFiveScores,
    MBTIResult,
    CognitiveFunctionStack,
    PersonalityCluster,
    JungianDepth
)
from app.services.scoring import ScoringService
from app.services.interpretation import InterpretationService
from app.services.report_generator import ContextAwareReportGenerator
from app.services.advanced_scoring import AdvancedScoringService

router = APIRouter()
scoring_service = ScoringService()
advanced_scoring_service = AdvancedScoringService()
interpretation_service = InterpretationService()
report_generator = ContextAwareReportGenerator()

@router.post("/start-assessment", response_model=AssessmentStartResponse)
async def start_assessment(request: AssessmentStartRequest = AssessmentStartRequest()):
    """
    Returns shuffled questions for the assessment.
    Questions are shuffled within each layer but maintain layer order.
    If user_seed is provided, uses deterministic shuffling for consistent order.
    """
    try:
        # Load questions
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Check if discovery assessment is requested
        if request.assessment_type == 'discovery':
            questions_path = os.path.join(current_dir, '../../questions/discovery_questions.json')
        else:
            questions_path = os.path.join(current_dir, '../../questions/questions.json')
        
        # Ensure path exists
        if not os.path.exists(questions_path):
            # If discovery questions don't exist, create them from main questions
            if request.assessment_type == 'discovery':
                # Load main questions and select top 60
                main_questions_path = os.path.join(current_dir, '../../questions/questions.json')
                with open(main_questions_path, 'r') as f:
                    data = json.load(f)
                all_questions = data['questions']
                # Select 60 most discriminating questions
                primary = [q for q in all_questions if q['assessment_layer'] == 'primary']
                secondary = [q for q in all_questions if q['assessment_layer'] == 'secondary']
                # Take 48 primary and 12 secondary for discovery
                all_questions = primary[:48] + secondary[:12]
            else:
                raise FileNotFoundError(f"Questions file not found at: {questions_path}")
        else:
            with open(questions_path, 'r') as f:
                data = json.load(f)
            all_questions = data['questions']
        
        # Separate by layer
        primary = [q for q in all_questions if q['assessment_layer'] == 'primary']
        secondary = [q for q in all_questions if q['assessment_layer'] == 'secondary']
        tertiary = [q for q in all_questions if q['assessment_layer'] == 'tertiary']
        
        # Create a random instance with seed if provided
        if request.user_seed:
            # Use a seeded random for deterministic shuffling
            rng = random.Random(request.user_seed)
            rng.shuffle(primary)
            rng.shuffle(secondary)
            rng.shuffle(tertiary)
        else:
            # Use regular random shuffle for anonymous users
            random.shuffle(primary)
            random.shuffle(secondary)
            random.shuffle(tertiary)
        
        # Combine in order
        shuffled_questions = primary + secondary + tertiary
        
        # Convert to Question models
        questions = [Question(**q) for q in shuffled_questions]
        
        return AssessmentStartResponse(
            questions=questions,
            total_questions=len(questions)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting assessment: {str(e)}")

@router.post("/submit-assessment")
async def submit_assessment(submission: AssessmentSubmission):
    """
    Process all responses and return complete results.
    """
    try:
        responses = submission.responses
        
        # Check assessment type for minimum requirements
        assessment_types = submission.assessment_types
        is_discovery = 'discovery' in assessment_types
        
        # Validate minimum responses (80% = 48 for discovery, 160 for core)
        min_required = 48 if is_discovery else 160
        if len(responses) < min_required:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient responses. Received {len(responses)}, minimum required is {min_required}."
            )
        
        # Separate response types
        likert_responses = [r for r in responses if r.response_value is not None]
        forced_choice = [r for r in responses if r.selected_option is not None]
        
        # Calculate Big Five scores
        if is_discovery:
            # Use advanced scoring for discovery assessment
            standardized = advanced_scoring_service.calculate_discovery_scores(responses)
        else:
            raw_scores = scoring_service.calculate_raw_scores(likert_responses)
            irt_scores = scoring_service.calculate_irt_scores(likert_responses)
            standardized = scoring_service.standardize_scores(raw_scores, irt_scores)
        
        # Calculate confidence intervals
        confidence_intervals = scoring_service.calculate_confidence_intervals(
            standardized['scores'],
            standardized['standard_errors']
        )
        
        # Calculate facet scores
        facet_scores = scoring_service.calculate_facet_scores(likert_responses)
        
        # Determine MBTI type
        mbti_result = scoring_service.classify_mbti_type(
            standardized['scores'],
            forced_choice
        )
        
        # Determine cognitive functions
        depth_responses = [r for r in responses if 'JD_' in r.question_id]
        function_stack = scoring_service.determine_function_stack(
            mbti_result['primary_type'],
            standardized['scores'],
            depth_responses
        )
        
        # Cluster classification
        big_five_list = [
            standardized['scores']['Extraversion'],
            standardized['scores']['Agreeableness'],
            standardized['scores']['Conscientiousness'],
            standardized['scores']['Neuroticism'],
            standardized['scores']['Openness']
        ]
        cluster_result = scoring_service.classify_to_cluster(big_five_list)
        
        # Analyze depth responses
        depth_analysis = scoring_service.analyze_depth_responses(responses)
        
        # Prepare structured results for interpretation
        results_dict = {
            'big_five': {
                'scores': standardized['scores'],
                'percentiles': standardized['percentiles'],
                'confidence_intervals': confidence_intervals,
                'facet_scores': facet_scores
            },
            'mbti': mbti_result,
            'cognitive_functions': function_stack,
            'personality_cluster': cluster_result,
            'jungian_depth': depth_analysis
        }
        
        # Generate interpretation
        interpretation = interpretation_service.generate_integrated_interpretation(results_dict)
        
        # Generate development suggestions
        development_suggestions = interpretation_service.generate_development_suggestions(results_dict)
        
        # Create response models
        big_five_response = BigFiveScores(
            scores=standardized['scores'],
            percentiles=standardized['percentiles'],
            confidence_intervals=confidence_intervals,
            facet_scores=facet_scores
        )
        
        mbti_response = MBTIResult(**mbti_result)
        
        cognitive_response = CognitiveFunctionStack(**function_stack)
        
        cluster_response = PersonalityCluster(
            primary_cluster=cluster_result['primary_cluster'],
            cluster_probabilities=cluster_result['cluster_probabilities'],
            cluster_description=cluster_result.get('cluster_description')
        )
        
        depth_response = JungianDepth(
            shadow_integration=depth_analysis['shadow_integration'],
            archetype_profile=depth_analysis.get('archetype_profile'),
            individuation_stage=depth_analysis.get('individuation_stage')
        )
        
        # For discovery assessment, return a different format with report
        if is_discovery:
            # Generate discovery report
            profile = {
                'big_five': {
                    'scores': standardized['scores'],
                    'percentiles': standardized['percentiles'],
                    'confidence_intervals': confidence_intervals,
                    'facet_scores': facet_scores,
                    'confidence_warning': standardized.get('confidence_warning'),
                    'high_uncertainty_traits': standardized.get('high_uncertainty_traits', [])
                },
                'mbti': mbti_result,
                'cognitive_functions': function_stack,
                'personality_cluster': cluster_result,
                'jungian_depth': depth_analysis
            }
            
            report = report_generator.generate_discovery_report(profile)
            
            # Return in the format expected by DiscoveryResults component
            return {
                'profile': profile,
                'report': report
            }
        
        # Standard format for core assessment
        return AssessmentResults(
            big_five=big_five_response,
            mbti=mbti_response,
            cognitive_functions=cognitive_response,
            personality_cluster=cluster_response,
            jungian_depth=depth_response,
            interpretation=interpretation,
            development_suggestions=development_suggestions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing assessment: {str(e)}")