from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union
from enum import Enum

class ResponseType(str, Enum):
    LIKERT_7 = "likert_7"
    LIKERT_5 = "likert_5"
    FORCED_CHOICE = "forced_choice"

class AssessmentLayer(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    TERTIARY = "tertiary"

class BigFiveDimension(str, Enum):
    EXTRAVERSION = "Extraversion"
    AGREEABLENESS = "Agreeableness"
    CONSCIENTIOUSNESS = "Conscientiousness"
    NEUROTICISM = "Neuroticism"
    OPENNESS = "Openness"

class ForcedChoiceOption(BaseModel):
    text: str
    scores: Dict[str, float]

class Question(BaseModel):
    id: str
    text: str
    dimension: Optional[str] = None
    facet: Optional[str] = None
    reverse_scored: bool = False
    assessment_layer: AssessmentLayer
    response_type: ResponseType
    factor_loadings: Optional[Dict[str, float]] = None
    option_a: Optional[ForcedChoiceOption] = None
    option_b: Optional[ForcedChoiceOption] = None

class QuestionResponse(BaseModel):
    question_id: str
    response_value: Optional[int] = None  # For Likert scales
    selected_option: Optional[str] = None  # For forced choice ('a' or 'b')

class AssessmentStartResponse(BaseModel):
    questions: List[Question]
    total_questions: int

class BigFiveScores(BaseModel):
    scores: Dict[str, float]
    percentiles: Dict[str, float]
    confidence_intervals: Dict[str, Dict[str, float]]
    facet_scores: Optional[Dict[str, Dict[str, float]]] = None

class MBTIResult(BaseModel):
    primary_type: str
    probability: float
    secondary_type: Optional[str] = None
    dimension_probabilities: Dict[str, float]

class CognitiveFunction(BaseModel):
    function: str
    development_level: float
    description: Optional[str] = None

class CognitiveFunctionStack(BaseModel):
    primary_stack: List[str]
    development_levels: Dict[str, float]
    shadow_functions: Optional[List[str]] = None

class PersonalityCluster(BaseModel):
    primary_cluster: int
    cluster_probabilities: List[float]
    cluster_description: Optional[str] = None

class JungianDepth(BaseModel):
    shadow_integration: float
    archetype_profile: Optional[Dict[str, float]] = None
    individuation_stage: Optional[str] = None

class AssessmentResults(BaseModel):
    big_five: BigFiveScores
    mbti: MBTIResult
    cognitive_functions: CognitiveFunctionStack
    personality_cluster: PersonalityCluster
    jungian_depth: JungianDepth
    interpretation: str
    development_suggestions: List[str]

class AssessmentSubmission(BaseModel):
    responses: List[QuestionResponse]