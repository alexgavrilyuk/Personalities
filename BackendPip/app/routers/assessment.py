from fastapi import APIRouter, HTTPException
from typing import List
import random
import json
import os
from app.models.assessment import (
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

router = APIRouter()
scoring_service = ScoringService()
interpretation_service = InterpretationService()

@router.post("/start-assessment", response_model=AssessmentStartResponse)
async def start_assessment():
    """
    Returns shuffled questions for the assessment.
    Questions are shuffled within each layer but maintain layer order.
    """
    try:
        # Load questions
        questions_path = os.path.join(os.path.dirname(__file__), '../../questions/questions.json')
        with open(questions_path, 'r') as f:
            data = json.load(f)
        
        all_questions = data['questions']
        
        # Separate by layer
        primary = [q for q in all_questions if q['assessment_layer'] == 'primary']
        secondary = [q for q in all_questions if q['assessment_layer'] == 'secondary']
        tertiary = [q for q in all_questions if q['assessment_layer'] == 'tertiary']
        
        # Shuffle within each layer
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

@router.post("/submit-assessment", response_model=AssessmentResults)
async def submit_assessment(submission: AssessmentSubmission):
    """
    Process all responses and return complete results.
    """
    try:
        responses = submission.responses
        
        # Validate minimum responses (80% = 160 questions)
        if len(responses) < 160:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient responses. Received {len(responses)}, minimum required is 160."
            )
        
        # Separate response types
        likert_responses = [r for r in responses if r.response_value is not None]
        forced_choice = [r for r in responses if r.selected_option is not None]
        
        # Calculate Big Five scores
        raw_scores = scoring_service.calculate_raw_scores(likert_responses)
        irt_scores = scoring_service.calculate_irt_scores(likert_responses)
        
        # Standardize scores
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