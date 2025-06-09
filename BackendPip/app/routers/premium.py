from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
from pydantic import BaseModel
from datetime import datetime
import json
import os
from app.models.assessment import QuestionResponse, AssessmentSubmission
from app.services.advanced_scoring import AdvancedScoringService
from app.services.report_generator import ContextAwareReportGenerator

router = APIRouter()

# In-memory storage for demo
premium_users = set()
assessment_results = {}

class PremiumStatus(BaseModel):
    is_premium: bool
    purchased_at: Optional[str] = None
    features: List[str] = []

class AssessmentTypeInfo(BaseModel):
    id: str
    name: str
    tier: str
    question_count: int
    description: str
    is_premium: bool
    is_available: bool
    prerequisite: Optional[str] = None

def check_premium_access(user_id: str) -> bool:
    """Check if user has premium access"""
    return user_id in premium_users

def get_current_user():
    """Mock user authentication"""
    return {"id": "demo-user-123", "email": "demo@example.com"}

@router.get("/assessment-types")
async def get_assessment_types(user = Depends(get_current_user)) -> List[AssessmentTypeInfo]:
    """Get all available assessment types"""
    user_is_premium = check_premium_access(user['id'])
    
    assessment_types = [
        AssessmentTypeInfo(
            id="discovery",
            name="Discovery Assessment",
            tier="discovery",
            question_count=60,
            description="Quick personality snapshot to understand your core traits",
            is_premium=False,
            is_available=True
        ),
        AssessmentTypeInfo(
            id="core",
            name="Core Personality Assessment",
            tier="core",
            question_count=200,
            description="Comprehensive personality analysis with detailed insights",
            is_premium=False,
            is_available=True
        ),
        AssessmentTypeInfo(
            id="relationships",
            name="Relationship Dynamics",
            tier="premium",
            question_count=50,
            description="Understand your attachment style and relationship patterns",
            is_premium=True,
            is_available=user_is_premium
        ),
        AssessmentTypeInfo(
            id="career",
            name="Career Alignment Profile",
            tier="premium",
            question_count=80,
            description="Discover careers that match your personality and values",
            is_premium=True,
            is_available=user_is_premium
        ),
        AssessmentTypeInfo(
            id="emotional_intelligence",
            name="Emotional Intelligence",
            tier="premium",
            question_count=60,
            description="Map your EQ to your personality profile",
            is_premium=True,
            is_available=user_is_premium
        ),
        AssessmentTypeInfo(
            id="leadership",
            name="Leadership Potential",
            tier="premium",
            question_count=70,
            description="Uncover your leadership style and potential",
            is_premium=True,
            is_available=user_is_premium
        ),
        AssessmentTypeInfo(
            id="creativity",
            name="Creative Expression",
            tier="premium",
            question_count=40,
            description="Explore how your personality influences creativity",
            is_premium=True,
            is_available=user_is_premium
        )
    ]
    
    return assessment_types

@router.get("/premium-status")
async def get_premium_status(user = Depends(get_current_user)) -> PremiumStatus:
    """Get user's premium status"""
    is_premium = check_premium_access(user['id'])
    
    if is_premium:
        return PremiumStatus(
            is_premium=True,
            purchased_at=datetime.now().isoformat(),  # Mock date
            features=[
                "Relationship Dynamics Assessment",
                "Career Alignment Profile", 
                "Emotional Intelligence Mapping",
                "Leadership Potential Analysis",
                "Creative Expression Profile",
                "Unlimited Team Comparisons",
                "Advanced Personality Reports"
            ]
        )
    else:
        return PremiumStatus(
            is_premium=False,
            features=[]
        )

@router.post("/start-assessment/{assessment_type}")
async def start_premium_assessment(
    assessment_type: str,
    user_seed: Optional[int] = None,
    user = Depends(get_current_user)
):
    """Start a premium assessment"""
    # Check if assessment type exists and user has access
    valid_premium_types = ["relationships", "career", "emotional_intelligence", "leadership", "creativity"]
    
    if assessment_type == "discovery":
        # Load discovery questions
        scoring_service = AdvancedScoringService()
        questions = list(scoring_service.discovery_questions.values())
    elif assessment_type == "core":
        # Load core questions
        scoring_service = AdvancedScoringService()
        questions = list(scoring_service.questions.values())
    elif assessment_type in valid_premium_types:
        if not check_premium_access(user['id']):
            raise HTTPException(status_code=403, detail="Premium access required")
        
        # For demo, return placeholder questions
        # In production, load actual premium questions
        questions = _generate_placeholder_questions(assessment_type)
    else:
        raise HTTPException(status_code=404, detail="Assessment type not found")
    
    # Apply shuffling if needed
    if user_seed:
        import random
        random.seed(user_seed)
        random.shuffle(questions)
    
    return {
        "assessment_type": assessment_type,
        "questions": questions,
        "total_questions": len(questions)
    }

@router.post("/submit-assessment/{assessment_type}")
async def submit_premium_assessment(
    assessment_type: str,
    submission: AssessmentSubmission,
    user = Depends(get_current_user)
):
    """Submit and score a premium assessment"""
    # Validate assessment type
    valid_types = ["discovery", "core", "relationships", "career", 
                   "emotional_intelligence", "leadership", "creativity"]
    
    if assessment_type not in valid_types:
        raise HTTPException(status_code=404, detail="Invalid assessment type")
    
    # Check premium access for premium assessments
    premium_types = ["relationships", "career", "emotional_intelligence", "leadership", "creativity"]
    if assessment_type in premium_types and not check_premium_access(user['id']):
        raise HTTPException(status_code=403, detail="Premium access required")
    
    # Score based on assessment type
    scoring_service = AdvancedScoringService()
    
    if assessment_type == "discovery":
        # Score discovery assessment
        big_five_scores = scoring_service.calculate_discovery_scores(submission.responses)
        
        # Simple MBTI classification for discovery
        mbti_result = scoring_service.classify_mbti_type(
            big_five_scores['scores'],
            []  # No forced choice in discovery
        )
        
        profile = {
            'assessment_type': 'discovery',
            'big_five': big_five_scores,
            'mbti': mbti_result,
            'completed_at': datetime.now().isoformat()
        }
        
        # Generate discovery report
        report_generator = ContextAwareReportGenerator()
        report = report_generator.generate_discovery_report(profile)
        
        result = {
            'profile': profile,
            'report': report
        }
        
    elif assessment_type == "core":
        # Full core assessment scoring (existing logic)
        # ... (use existing scoring logic)
        result = _score_core_assessment(submission.responses, scoring_service)
        
    elif assessment_type == "relationships":
        # Score relationship assessment
        result = _score_relationship_assessment(submission.responses, scoring_service, user['id'])
        
    elif assessment_type == "career":
        # Score career assessment
        # Need user's big five scores from core assessment
        core_profile = assessment_results.get(f"{user['id']}_core")
        if not core_profile:
            raise HTTPException(
                status_code=400, 
                detail="Complete Core Assessment first to unlock Career insights"
            )
        
        result = _score_career_assessment(
            submission.responses, 
            core_profile['big_five']['scores'],
            scoring_service
        )
    
    else:
        # Other premium assessments
        result = {
            'assessment_type': assessment_type,
            'status': 'completed',
            'message': 'Premium assessment completed',
            'placeholder': True
        }
    
    # Store result
    assessment_results[f"{user['id']}_{assessment_type}"] = result
    
    return result

@router.post("/unlock-premium")
async def unlock_premium(user = Depends(get_current_user)):
    """Placeholder endpoint for premium unlock"""
    # This is where Stripe integration would go
    # For now, just add user to premium set
    premium_users.add(user['id'])
    
    return {
        'success': True,
        'message': 'Premium features unlocked! (Demo mode)',
        'user_id': user['id'],
        'features': [
            "Relationship Dynamics Assessment",
            "Career Alignment Profile",
            "Emotional Intelligence Mapping",
            "Leadership Potential Analysis",
            "Creative Expression Profile",
            "Unlimited Team Comparisons"
        ]
    }

def _generate_placeholder_questions(assessment_type: str) -> List[Dict]:
    """Generate placeholder questions for demo"""
    # In production, load real questions from database
    
    if assessment_type == "relationships":
        return [
            {
                "id": f"REL_{i:03d}",
                "text": f"Relationship question {i}",
                "dimension": "attachment_anxiety" if i % 2 == 0 else "attachment_avoidance",
                "response_type": "likert_7",
                "reverse_scored": i % 3 == 0
            }
            for i in range(1, 51)
        ]
    
    elif assessment_type == "career":
        return [
            {
                "id": f"CAR_{i:03d}",
                "text": f"Career preference question {i}",
                "riasec_type": ["Realistic", "Investigative", "Artistic", 
                               "Social", "Enterprising", "Conventional"][i % 6],
                "response_type": "likert_7",
                "reverse_scored": False
            }
            for i in range(1, 81)
        ]
    
    # Generic placeholder for other types
    return [
        {
            "id": f"{assessment_type.upper()}_{i:03d}",
            "text": f"{assessment_type.title()} question {i}",
            "dimension": assessment_type,
            "response_type": "likert_7",
            "reverse_scored": i % 4 == 0
        }
        for i in range(1, 41)
    ]

def _score_core_assessment(responses: List[QuestionResponse], scoring_service: AdvancedScoringService) -> Dict:
    """Score core assessment (existing logic)"""
    # Separate responses by type
    likert_responses = [r for r in responses if r.response_value is not None]
    forced_choice_responses = [r for r in responses if r.selected_option is not None]
    
    # Calculate all scores
    raw_scores = scoring_service.calculate_raw_scores(likert_responses)
    irt_scores = scoring_service.calculate_irt_scores(likert_responses)
    standardized = scoring_service.standardize_scores(raw_scores, irt_scores)
    
    # Big Five results
    big_five_results = {
        'scores': standardized['scores'],
        'percentiles': standardized['percentiles'],
        'standard_errors': standardized['standard_errors'],
        'confidence_intervals': scoring_service.calculate_confidence_intervals(
            standardized['scores'],
            standardized['standard_errors']
        ),
        'facet_scores': scoring_service.calculate_facet_scores(likert_responses)
    }
    
    # MBTI classification
    mbti_result = scoring_service.classify_mbti_type(
        standardized['scores'],
        forced_choice_responses
    )
    
    # Cognitive functions
    cognitive_functions = scoring_service.determine_function_stack(
        mbti_result['primary_type'],
        standardized['scores'],
        []  # No depth responses in basic version
    )
    
    # Personality cluster
    big_five_list = [
        standardized['scores']['Extraversion'],
        standardized['scores']['Agreeableness'],
        standardized['scores']['Conscientiousness'],
        standardized['scores']['Neuroticism'],
        standardized['scores']['Openness']
    ]
    cluster = scoring_service.classify_to_cluster(big_five_list)
    
    # Trait interactions
    trait_interactions = scoring_service.analyze_trait_interactions(standardized['scores'])
    
    # Statistical uniqueness
    profile = {
        'big_five': big_five_results,
        'mbti': mbti_result
    }
    uniqueness = scoring_service.calculate_statistical_unusualness(profile)
    
    # Generate full report
    report_generator = ContextAwareReportGenerator()
    profile['cognitive_functions'] = cognitive_functions
    profile['personality_cluster'] = cluster
    profile['trait_interactions'] = trait_interactions
    profile['uniqueness'] = uniqueness
    
    report = report_generator.generate_core_report(profile)
    
    return {
        'profile': profile,
        'report': report,
        'completed_at': datetime.now().isoformat()
    }

def _score_relationship_assessment(
    responses: List[QuestionResponse], 
    scoring_service: AdvancedScoringService,
    user_id: str
) -> Dict:
    """Score relationship assessment"""
    result = scoring_service.score_relationship_assessment(responses)
    
    # Add personalized insights based on core personality if available
    core_profile = assessment_results.get(f"{user_id}_core")
    if core_profile:
        # Enhance with personality-based relationship insights
        result['personality_relationship_insights'] = _generate_personality_relationship_insights(
            core_profile['profile'],
            result
        )
    
    return {
        'assessment_type': 'relationships',
        'results': result,
        'completed_at': datetime.now().isoformat()
    }

def _score_career_assessment(
    responses: List[QuestionResponse],
    big_five_scores: Dict[str, float],
    scoring_service: AdvancedScoringService
) -> Dict:
    """Score career assessment with personality integration"""
    result = scoring_service.score_career_assessment(responses, big_five_scores)
    
    return {
        'assessment_type': 'career',
        'results': result,
        'completed_at': datetime.now().isoformat()
    }

def _generate_personality_relationship_insights(personality: Dict, relationship: Dict) -> Dict:
    """Generate insights combining personality and relationship assessment"""
    insights = {
        'compatibility_factors': [],
        'growth_areas': [],
        'strengths': []
    }
    
    # Example insights based on personality + attachment
    big_five = personality['big_five']['scores']
    attachment = relationship['attachment']['style']
    
    if big_five['Neuroticism'] > 60 and attachment == 'anxious':
        insights['growth_areas'].append({
            'area': 'Emotional Regulation',
            'description': 'Your high neuroticism combined with anxious attachment may create relationship anxiety',
            'suggestion': 'Practice self-soothing and communicate needs clearly'
        })
    
    if big_five['Agreeableness'] > 70 and attachment == 'secure':
        insights['strengths'].append({
            'strength': 'Natural Relationship Builder',
            'description': 'Your high agreeableness and secure attachment create ideal conditions for healthy relationships'
        })
    
    return insights