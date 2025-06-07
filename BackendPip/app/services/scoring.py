import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Tuple, Optional
from app.models.assessment import QuestionResponse, BigFiveDimension
import json
import os

class ScoringService:
    def __init__(self):
        self.questions = self._load_questions()
        self.norms = self._load_norms()
        self.function_orders = {
            'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
            'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
            'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
            'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
            'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
            'INFP': ['Fi', 'Ne', 'Si', 'Te'],
            'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
            'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
            'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
            'ISFJ': ['Si', 'Fe', 'Ti', 'Ne'],
            'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
            'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
            'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
            'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
            'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
            'ESFP': ['Se', 'Fi', 'Te', 'Ni']
        }

    def _load_questions(self) -> Dict:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        questions_path = os.path.join(current_dir, '../../questions/questions.json')
        
        if not os.path.exists(questions_path):
            raise FileNotFoundError(f"Questions file not found at: {questions_path}")
            
        with open(questions_path, 'r') as f:
            data = json.load(f)
        return {q['id']: q for q in data['questions']}

    def _load_norms(self) -> Dict:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        norms_path = os.path.join(current_dir, '../../norms/norm_data.json')
        
        if not os.path.exists(norms_path):
            raise FileNotFoundError(f"Norms file not found at: {norms_path}")
            
        with open(norms_path, 'r') as f:
            return json.load(f)

    def calculate_raw_scores(self, responses: List[QuestionResponse]) -> Dict[str, float]:
        scores = {
            'Extraversion': 0.0,
            'Agreeableness': 0.0,
            'Conscientiousness': 0.0,
            'Neuroticism': 0.0,
            'Openness': 0.0
        }
        
        counts = {dim: 0 for dim in scores}
        
        for response in responses:
            question = self.questions.get(response.question_id)
            if not question or question['response_type'] != 'likert_7':
                continue
                
            # Convert 1-7 scale to 0-6
            value = response.response_value - 1
            
            # Reverse score if needed
            if question['reverse_scored']:
                value = 6 - value
            
            # Apply factor loadings
            if question.get('factor_loadings'):
                for dimension, loading in question['factor_loadings'].items():
                    if dimension in scores:
                        scores[dimension] += value * loading
                        counts[dimension] += abs(loading)
        
        # Normalize by the sum of loadings
        for dimension in scores:
            if counts[dimension] > 0:
                scores[dimension] = scores[dimension] / counts[dimension] * 100 / 6
        
        return scores

    def calculate_irt_scores(self, responses: List[QuestionResponse]) -> Dict[str, Tuple[float, float]]:
        # Simplified IRT implementation - in production would use actual item parameters
        irt_scores = {}
        
        for dimension in ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness']:
            dim_responses = []
            
            for response in responses:
                question = self.questions.get(response.question_id)
                if not question or question.get('dimension') != dimension:
                    continue
                    
                value = response.response_value - 1
                if question['reverse_scored']:
                    value = 6 - value
                    
                dim_responses.append(value)
            
            if dim_responses:
                # Simple theta estimation
                theta = (np.mean(dim_responses) - 3) / 1.5  # Scale to approximately -2 to +2
                se = 1 / np.sqrt(len(dim_responses))  # Simplified standard error
                irt_scores[dimension] = (theta, se)
            else:
                irt_scores[dimension] = (0.0, 1.0)
        
        return irt_scores

    def standardize_scores(self, raw_scores: Dict[str, float], irt_scores: Dict[str, Tuple[float, float]]) -> Dict:
        standardized = {
            'scores': {},
            'percentiles': {},
            'standard_errors': {}
        }
        
        for dimension in raw_scores:
            # Combine raw and IRT scores (weighted average)
            if dimension in irt_scores:
                irt_theta, irt_se = irt_scores[dimension]
                # Convert IRT theta to 0-100 scale
                irt_score = (irt_theta + 2) * 25  # Maps -2,2 to 0,100
                
                # Weight IRT more heavily (70/30)
                combined_score = 0.7 * irt_score + 0.3 * raw_scores[dimension]
                
                # Ensure score is within bounds
                combined_score = max(0, min(100, combined_score))
                
                standardized['scores'][dimension] = round(combined_score, 1)
                standardized['standard_errors'][dimension] = round(irt_se * 15, 1)  # Scale SE
                
                # Calculate percentile
                norm_data = self.norms['norms'][dimension]['general_population']
                z_score = (combined_score - norm_data['mean']) / norm_data['std_dev']
                percentile = norm.cdf(z_score) * 100
                standardized['percentiles'][dimension] = round(percentile, 1)
            else:
                standardized['scores'][dimension] = round(raw_scores[dimension], 1)
                standardized['percentiles'][dimension] = 50.0
                standardized['standard_errors'][dimension] = 5.0
        
        return standardized

    def classify_mbti_type(self, big_five_scores: Dict[str, float], forced_choice_responses: List[QuestionResponse]) -> Dict:
        # Initialize preference scores
        preferences = {'E': 0.0, 'I': 0.0, 'S': 0.0, 'N': 0.0,
                      'T': 0.0, 'F': 0.0, 'J': 0.0, 'P': 0.0}
        
        # Weight forced choice responses (70% weight)
        for response in forced_choice_responses:
            question = self.questions.get(response.question_id)
            if not question or question['response_type'] != 'forced_choice':
                continue
                
            if response.selected_option == 'a':
                for pref, score in question['option_a']['scores'].items():
                    preferences[pref] += score * 0.7
            else:
                for pref, score in question['option_b']['scores'].items():
                    preferences[pref] += score * 0.7
        
        # Add Big Five correlations (30% weight)
        # Based on empirical correlations from framework
        e_score = big_five_scores.get('Extraversion', 50) / 100
        preferences['E'] += e_score * 0.3
        preferences['I'] += (1 - e_score) * 0.3
        
        n_score = big_five_scores.get('Openness', 50) / 100
        preferences['N'] += n_score * 0.3
        preferences['S'] += (1 - n_score) * 0.3
        
        f_score = big_five_scores.get('Agreeableness', 50) / 100
        preferences['F'] += f_score * 0.3
        preferences['T'] += (1 - f_score) * 0.3
        
        j_score = big_five_scores.get('Conscientiousness', 50) / 100
        preferences['J'] += j_score * 0.3
        preferences['P'] += (1 - j_score) * 0.3
        
        # Determine type with probabilities
        type_code = ''
        dimension_probabilities = {}
        
        for pair in [('E', 'I'), ('S', 'N'), ('T', 'F'), ('J', 'P')]:
            total = preferences[pair[0]] + preferences[pair[1]]
            if total > 0:
                prob_first = preferences[pair[0]] / total
            else:
                prob_first = 0.5
                
            if prob_first > 0.5:
                type_code += pair[0]
                dimension_probabilities[pair[0]] = round(prob_first, 3)
            else:
                type_code += pair[1]
                dimension_probabilities[pair[1]] = round(1 - prob_first, 3)
        
        # Calculate overall type probability
        overall_probability = np.prod(list(dimension_probabilities.values()))
        
        # Find secondary type if probability < 0.8
        secondary_type = None
        if overall_probability < 0.8:
            secondary_type = self._find_secondary_type(preferences, type_code)
        
        return {
            'primary_type': type_code,
            'probability': round(overall_probability, 3),
            'secondary_type': secondary_type,
            'dimension_probabilities': dimension_probabilities
        }

    def _find_secondary_type(self, preferences: Dict[str, float], primary_type: str) -> Optional[str]:
        # Find the dimension with the lowest confidence
        min_diff = float('inf')
        flip_dim = None
        
        for i, pair in enumerate([('E', 'I'), ('S', 'N'), ('T', 'F'), ('J', 'P')]):
            diff = abs(preferences[pair[0]] - preferences[pair[1]])
            if diff < min_diff:
                min_diff = diff
                flip_dim = i
        
        if flip_dim is not None:
            secondary = list(primary_type)
            current = secondary[flip_dim]
            
            # Flip to opposite preference
            for pair in [('E', 'I'), ('S', 'N'), ('T', 'F'), ('J', 'P')]:
                if current in pair:
                    secondary[flip_dim] = pair[1] if current == pair[0] else pair[0]
                    break
            
            return ''.join(secondary)
        
        return None

    def determine_function_stack(self, mbti_type: str, big_five_scores: Dict[str, float], 
                                depth_responses: List[QuestionResponse]) -> Dict:
        if mbti_type not in self.function_orders:
            return {
                'primary_stack': [],
                'development_levels': {},
                'shadow_functions': []
            }
        
        stack = self.function_orders[mbti_type]
        development_levels = {}
        
        for i, function in enumerate(stack):
            base_level = [0.8, 0.6, 0.4, 0.2][i]  # Dominant to inferior
            
            # Adjust based on relevant Big Five scores
            modifier = 0.0
            
            if function[1] == 'i':  # Introverted function
                modifier = (100 - big_five_scores.get('Extraversion', 50)) / 200
            else:  # Extraverted function
                modifier = big_five_scores.get('Extraversion', 50) / 200
            
            if function[0] == 'N':  # Intuition
                modifier += big_five_scores.get('Openness', 50) / 200
            elif function[0] == 'S':  # Sensing
                modifier += (100 - big_five_scores.get('Openness', 50)) / 200
            elif function[0] == 'T':  # Thinking
                modifier += (100 - big_five_scores.get('Agreeableness', 50)) / 200
            elif function[0] == 'F':  # Feeling
                modifier += big_five_scores.get('Agreeableness', 50) / 200
            
            development_levels[function] = round(min(1.0, base_level + modifier), 2)
        
        # Identify shadow functions
        shadow_functions = self._identify_shadow_functions(stack, depth_responses)
        
        return {
            'primary_stack': stack,
            'development_levels': development_levels,
            'shadow_functions': shadow_functions
        }

    def _identify_shadow_functions(self, primary_stack: List[str], depth_responses: List[QuestionResponse]) -> List[str]:
        # Simplified shadow function identification
        shadow_map = {
            'Ni': 'Ne', 'Ne': 'Ni',
            'Si': 'Se', 'Se': 'Si',
            'Ti': 'Te', 'Te': 'Ti',
            'Fi': 'Fe', 'Fe': 'Fi'
        }
        
        shadow_functions = []
        for function in primary_stack[:2]:  # Focus on dominant and auxiliary
            if function in shadow_map:
                shadow_functions.append(shadow_map[function])
        
        return shadow_functions

    def calculate_confidence_intervals(self, scores: Dict[str, float], 
                                     standard_errors: Dict[str, float], 
                                     confidence_level: float = 0.95) -> Dict:
        z_score = norm.ppf((1 + confidence_level) / 2)
        intervals = {}
        
        for dimension, score in scores.items():
            se = standard_errors.get(dimension, 5.0)
            margin = z_score * se
            
            intervals[dimension] = {
                'point_estimate': score,
                'lower_bound': round(max(0, score - margin), 1),
                'upper_bound': round(min(100, score + margin), 1),
                'confidence_level': confidence_level
            }
        
        return intervals

    def classify_to_cluster(self, big_five_scores: List[float]) -> Dict:
        # Simplified cluster classification
        # In production, would use pre-trained GMM model
        
        # Define cluster prototypes
        clusters = {
            0: {'name': 'Resilient', 'profile': [65, 60, 65, 35, 60]},
            1: {'name': 'Overcontrolled', 'profile': [35, 50, 55, 70, 45]},
            2: {'name': 'Undercontrolled', 'profile': [55, 35, 35, 60, 55]},
            3: {'name': 'Average', 'profile': [50, 50, 50, 50, 50]}
        }
        
        # Calculate distances to each cluster
        distances = {}
        for cluster_id, cluster_info in clusters.items():
            dist = np.sqrt(sum((a - b) ** 2 for a, b in zip(big_five_scores, cluster_info['profile'])))
            distances[cluster_id] = dist
        
        # Find closest cluster
        primary_cluster = min(distances, key=distances.get)
        
        # Calculate probabilities (inverse distance weighting)
        total_inv_dist = sum(1 / (d + 1) for d in distances.values())
        probabilities = [1 / (distances[i] + 1) / total_inv_dist for i in range(4)]
        
        return {
            'primary_cluster': primary_cluster,
            'cluster_probabilities': probabilities,
            'cluster_description': clusters[primary_cluster]['name']
        }

    def analyze_depth_responses(self, responses: List[QuestionResponse]) -> Dict:
        shadow_scores = []
        archetype_scores = {}
        individuation_scores = []
        
        for response in responses:
            question = self.questions.get(response.question_id)
            if not question:
                continue
                
            if question.get('dimension') == 'Shadow_Integration':
                if response.response_value:
                    # Convert 1-5 to 0-1 scale
                    shadow_scores.append((response.response_value - 1) / 4)
                    
            elif question.get('dimension') == 'Archetype':
                archetype = question.get('archetype')
                if archetype and response.response_value:
                    if archetype not in archetype_scores:
                        archetype_scores[archetype] = []
                    archetype_scores[archetype].append(response.response_value)
                    
            elif question.get('dimension') == 'Individuation':
                if response.response_value:
                    individuation_scores.append((response.response_value - 1) / 4)
        
        # Calculate averages
        shadow_integration = np.mean(shadow_scores) if shadow_scores else 0.5
        
        archetype_profile = {}
        for archetype, scores in archetype_scores.items():
            archetype_profile[archetype] = round(np.mean(scores) / 5, 2)
        
        # Determine primary archetype
        primary_archetype = max(archetype_profile, key=archetype_profile.get) if archetype_profile else None
        
        individuation_stage = self._determine_individuation_stage(
            np.mean(individuation_scores) if individuation_scores else 0.5
        )
        
        return {
            'shadow_integration': round(shadow_integration, 2),
            'archetype_profile': archetype_profile,
            'primary_archetype': primary_archetype,
            'individuation_stage': individuation_stage
        }

    def _determine_individuation_stage(self, score: float) -> str:
        if score < 0.25:
            return "Early Development"
        elif score < 0.5:
            return "Emerging Awareness"
        elif score < 0.75:
            return "Active Integration"
        else:
            return "Advanced Integration"

    def calculate_facet_scores(self, responses: List[QuestionResponse]) -> Dict[str, Dict[str, float]]:
        facet_scores = {}
        facet_counts = {}
        
        for response in responses:
            question = self.questions.get(response.question_id)
            if not question or not question.get('facet'):
                continue
                
            dimension = question['dimension']
            facet = question['facet']
            
            if dimension not in facet_scores:
                facet_scores[dimension] = {}
                facet_counts[dimension] = {}
            
            if facet not in facet_scores[dimension]:
                facet_scores[dimension][facet] = 0
                facet_counts[dimension][facet] = 0
            
            value = response.response_value - 1
            if question['reverse_scored']:
                value = 6 - value
            
            facet_scores[dimension][facet] += value
            facet_counts[dimension][facet] += 1
        
        # Calculate averages and convert to percentages
        result = {}
        for dimension, facets in facet_scores.items():
            result[dimension] = {}
            for facet, total in facets.items():
                count = facet_counts[dimension][facet]
                if count > 0:
                    avg = total / count
                    percentage = (avg / 6) * 100
                    result[dimension][facet] = round(percentage, 1)
        
        return result