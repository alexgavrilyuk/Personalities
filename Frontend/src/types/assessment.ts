export interface Question {
  id: string;
  text: string;
  dimension?: string;
  facet?: string;
  reverse_scored: boolean;
  assessment_layer: 'primary' | 'secondary' | 'tertiary';
  response_type: 'likert_7' | 'likert_5' | 'forced_choice';
  factor_loadings?: Record<string, number>;
  option_a?: {
    text: string;
    scores: Record<string, number>;
  };
  option_b?: {
    text: string;
    scores: Record<string, number>;
  };
}

export interface QuestionResponse {
  question_id: string;
  response_value?: number;
  selected_option?: 'a' | 'b';
}

export interface AssessmentStartResponse {
  questions: Question[];
  total_questions: number;
}

export interface BigFiveScores {
  scores: Record<string, number>;
  percentiles: Record<string, number>;
  confidence_intervals: Record<string, {
    point_estimate: number;
    lower_bound: number;
    upper_bound: number;
    confidence_level: number;
  }>;
  facet_scores?: Record<string, Record<string, number>>;
}

export interface MBTIResult {
  primary_type: string;
  probability: number;
  secondary_type?: string;
  dimension_probabilities: Record<string, number>;
}

export interface CognitiveFunctionStack {
  primary_stack: string[];
  development_levels: Record<string, number>;
  shadow_functions?: string[];
}

export interface PersonalityCluster {
  primary_cluster: number;
  cluster_probabilities: number[];
  cluster_description?: string;
}

export interface JungianDepth {
  shadow_integration: number;
  archetype_profile?: Record<string, number>;
  individuation_stage?: string;
}

export interface AssessmentResults {
  big_five: BigFiveScores;
  mbti: MBTIResult;
  cognitive_functions: CognitiveFunctionStack;
  personality_cluster: PersonalityCluster;
  jungian_depth: JungianDepth;
  interpretation: string;
  development_suggestions: string[];
}