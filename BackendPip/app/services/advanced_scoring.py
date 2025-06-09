import numpy as np
from scipy.stats import norm
from typing import List, Dict, Tuple, Optional
from app.models.assessment import QuestionResponse
from app.services.scoring import ScoringService
import json
import os

class AdvancedScoringService(ScoringService):
    """Extended scoring service with advanced features for premium assessments"""
    
    def __init__(self):
        super().__init__()
        self.discovery_questions = self._load_discovery_questions()
        self.trait_interaction_patterns = self._load_trait_interactions()
        
    def _load_discovery_questions(self) -> Dict:
        """Load the 60-question discovery assessment"""
        current_dir = os.path.dirname(os.path.abspath(__file__))
        discovery_path = os.path.join(current_dir, '../../questions/discovery_questions.json')
        
        if not os.path.exists(discovery_path):
            # Fallback to main questions if discovery doesn't exist
            return self.questions
            
        with open(discovery_path, 'r') as f:
            data = json.load(f)
        return {q['id']: q for q in data['questions']}
    
    def _load_trait_interactions(self) -> List[Dict]:
        """Load trait interaction patterns"""
        # In production, this would load from database
        return [
            {
                'pattern': 'creative_chaos',
                'name': 'Creative Chaos',
                'conditions': lambda scores: scores['Openness'] > 70 and scores['Conscientiousness'] < 30,
                'description': 'Your high creativity combined with low structure creates a unique "Creative Chaos" pattern'
            },
            {
                'pattern': 'turbulent_extravert',
                'name': 'Turbulent Extravert',
                'conditions': lambda scores: scores['Extraversion'] > 70 and scores['Neuroticism'] > 70,
                'description': 'You show a rare combination of high social energy with emotional sensitivity'
            },
            {
                'pattern': 'diplomatic_mediator',
                'name': 'Diplomatic Mediator',
                'conditions': lambda scores: scores['Agreeableness'] > 80 and scores['Neuroticism'] < 30,
                'description': 'Your exceptional agreeableness combined with emotional stability makes you a natural mediator'
            },
            {
                'pattern': 'analytical_perfectionist',
                'name': 'Analytical Perfectionist',
                'conditions': lambda scores: scores['Conscientiousness'] > 80 and scores['Openness'] > 70,
                'description': 'You combine high standards with intellectual curiosity, creating a drive for innovative excellence'
            },
            {
                'pattern': 'stoic_guardian',
                'name': 'Stoic Guardian',
                'conditions': lambda scores: scores['Conscientiousness'] > 70 and scores['Neuroticism'] < 20 and scores['Agreeableness'] > 60,
                'description': 'Your emotional stability, reliability, and care for others makes you a dependable protector'
            },
            {
                'pattern': 'intense_idealist',
                'name': 'Intense Idealist',
                'conditions': lambda scores: scores['Openness'] > 80 and scores['Neuroticism'] > 60 and scores['Agreeableness'] > 70,
                'description': 'You feel deeply about your ideals and values, experiencing both the heights and depths of human emotion'
            },
            {
                'pattern': 'practical_skeptic',
                'name': 'Practical Skeptic',
                'conditions': lambda scores: scores['Openness'] < 30 and scores['Agreeableness'] < 40,
                'description': 'Your preference for proven methods combined with healthy skepticism makes you a grounded realist'
            },
            {
                'pattern': 'social_architect',
                'name': 'Social Architect',
                'conditions': lambda scores: scores['Extraversion'] > 70 and scores['Conscientiousness'] > 70,
                'description': 'You excel at organizing people and events, bringing structure to social environments'
            }
        ]
    
    def calculate_discovery_scores(self, responses: List[QuestionResponse]) -> Dict:
        """
        Simplified scoring for 60-question discovery assessment
        Uses maximum likelihood estimation with broader confidence intervals
        """
        # Filter to only use discovery questions
        discovery_ids = set(self.discovery_questions.keys())
        filtered_responses = [r for r in responses if r.question_id in discovery_ids]
        
        # Use existing IRT scoring but adjust for fewer items
        base_scores = self.calculate_irt_scores(filtered_responses)
        
        # Adjust standard errors for reduced item count
        adjusted_scores = {}
        for dimension in base_scores:
            theta, se = base_scores[dimension]
            # Increase SE by factor of sqrt(200/60) to account for fewer items
            adjusted_se = se * np.sqrt(200/60)
            adjusted_scores[dimension] = (theta, adjusted_se)
        
        # Get standardized scores with warnings about precision
        raw_scores = self.calculate_raw_scores(filtered_responses)
        standardized = self.standardize_scores(raw_scores, adjusted_scores)
        
        # Add confidence warnings
        standardized['confidence_warning'] = (
            "This is a shortened assessment. Results are indicative but less precise "
            "than the full 200-question assessment."
        )
        
        # Mark scores that have high uncertainty
        standardized['high_uncertainty_traits'] = []
        for dimension, se in standardized['standard_errors'].items():
            if se > 10:  # High standard error threshold
                standardized['high_uncertainty_traits'].append(dimension)
        
        return standardized
    
    def analyze_trait_interactions(self, big_five_scores: Dict[str, float]) -> List[Dict]:
        """
        Identify statistically unusual trait combinations
        """
        interactions = []
        
        for pattern in self.trait_interaction_patterns:
            if pattern['conditions'](big_five_scores):
                # Calculate interaction strength
                strength = self._calculate_interaction_strength(pattern, big_five_scores)
                
                interactions.append({
                    'pattern': pattern['pattern'],
                    'name': pattern['name'],
                    'strength': strength,
                    'description': pattern['description']
                })
        
        # Sort by strength
        interactions.sort(key=lambda x: x['strength'], reverse=True)
        
        return interactions
    
    def _calculate_interaction_strength(self, pattern: Dict, scores: Dict[str, float]) -> float:
        """Calculate how strongly a pattern is expressed"""
        # This is a simplified calculation
        # In production, would use more sophisticated metrics
        if pattern['pattern'] == 'creative_chaos':
            openness_excess = max(0, scores['Openness'] - 70) / 30
            conscientiousness_deficit = max(0, 30 - scores['Conscientiousness']) / 30
            return min(openness_excess, conscientiousness_deficit)
        elif pattern['pattern'] == 'turbulent_extravert':
            extraversion_excess = max(0, scores['Extraversion'] - 70) / 30
            neuroticism_excess = max(0, scores['Neuroticism'] - 70) / 30
            return min(extraversion_excess, neuroticism_excess)
        # Add more pattern-specific calculations
        return 0.5  # Default moderate strength
    
    def calculate_statistical_unusualness(self, profile: Dict) -> Dict:
        """
        Identify what makes this person statistically unique
        """
        unusualness = {
            'extreme_scores': [],
            'rare_combinations': [],
            'paradoxical_patterns': [],
            'uniqueness_score': 0.0
        }
        
        # Check for extreme scores
        extreme_count = 0
        for trait, score in profile['big_five']['scores'].items():
            percentile = profile['big_five']['percentiles'][trait]
            if percentile > 90:
                unusualness['extreme_scores'].append({
                    'trait': trait,
                    'percentile': percentile,
                    'rarity': f'Higher than {percentile}% of people',
                    'description': self._get_extreme_trait_description(trait, 'high')
                })
                extreme_count += 1
            elif percentile < 10:
                unusualness['extreme_scores'].append({
                    'trait': trait,
                    'percentile': percentile,
                    'rarity': f'Lower than {100-percentile}% of people',
                    'description': self._get_extreme_trait_description(trait, 'low')
                })
                extreme_count += 1
        
        # Check for rare combinations
        scores = profile['big_five']['scores']
        
        # High in opposing traits
        if scores['Openness'] > 70 and scores['Conscientiousness'] > 70:
            unusualness['rare_combinations'].append({
                'combination': 'High Openness + High Conscientiousness',
                'rarity': 'Found in ~8% of population',
                'description': 'You combine creativity with discipline - a rare and powerful combination'
            })
        
        if scores['Extraversion'] > 70 and scores['Neuroticism'] < 30:
            unusualness['rare_combinations'].append({
                'combination': 'High Extraversion + Low Neuroticism',
                'rarity': 'Found in ~12% of population',
                'description': 'You have exceptional social confidence and emotional stability'
            })
        
        # Paradoxical patterns
        if scores['Agreeableness'] > 80 and scores['Neuroticism'] < 20:
            unusualness['paradoxical_patterns'].append({
                'pattern': 'The Unshakeable Altruist',
                'description': 'You care deeply for others while maintaining remarkable emotional equilibrium'
            })
        
        # Calculate overall uniqueness score (0-100)
        uniqueness_components = [
            extreme_count * 15,  # Each extreme trait adds 15 points
            len(unusualness['rare_combinations']) * 10,  # Each rare combo adds 10
            len(unusualness['paradoxical_patterns']) * 20  # Paradoxes add 20
        ]
        unusualness['uniqueness_score'] = min(100, sum(uniqueness_components))
        
        return unusualness
    
    def _get_extreme_trait_description(self, trait: str, level: str) -> str:
        """Get description for extreme trait levels"""
        descriptions = {
            'Openness': {
                'high': 'Your exceptional openness puts you among the most creative and intellectually curious individuals',
                'low': 'Your practical, grounded approach is remarkably consistent and focused'
            },
            'Conscientiousness': {
                'high': 'Your exceptional self-discipline and organization rivals that of top executives and athletes',
                'low': 'Your spontaneous, flexible approach to life is remarkably adaptable'
            },
            'Extraversion': {
                'high': 'Your social energy and enthusiasm is extraordinarily high, energizing those around you',
                'low': 'Your deep introversion allows for exceptional focus and self-reflection'
            },
            'Agreeableness': {
                'high': 'Your compassion and cooperation is exceptional, making you a natural peacemaker',
                'low': 'Your independence and analytical approach allows for objective decision-making'
            },
            'Neuroticism': {
                'high': 'Your emotional sensitivity gives you deep empathy and awareness of subtle dynamics',
                'low': 'Your emotional stability is remarkable, providing steady leadership in turbulent times'
            }
        }
        
        return descriptions.get(trait, {}).get(level, 'Your score on this trait is exceptional')
    
    def score_relationship_assessment(self, responses: List[QuestionResponse]) -> Dict:
        """
        Specialized scoring for relationship dynamics assessment
        """
        # Attachment dimensions based on ECR-R model
        attachment_scores = {
            'anxiety': 0.0,
            'avoidance': 0.0
        }
        
        attachment_counts = {'anxiety': 0, 'avoidance': 0}
        
        # Love languages scoring
        love_languages = {
            'words_of_affirmation': 0,
            'quality_time': 0,
            'receiving_gifts': 0,
            'acts_of_service': 0,
            'physical_touch': 0
        }
        
        love_language_counts = {lang: 0 for lang in love_languages}
        
        # Process responses
        for response in responses:
            question = self.questions.get(response.question_id)
            if not question:
                continue
            
            # Attachment scoring
            if question.get('dimension') == 'attachment_anxiety':
                value = response.response_value
                if question.get('reverse_scored'):
                    value = 8 - value  # Assuming 7-point scale
                attachment_scores['anxiety'] += value
                attachment_counts['anxiety'] += 1
            
            elif question.get('dimension') == 'attachment_avoidance':
                value = response.response_value
                if question.get('reverse_scored'):
                    value = 8 - value
                attachment_scores['avoidance'] += value
                attachment_counts['avoidance'] += 1
            
            # Love language scoring
            elif question.get('dimension', '').startswith('love_language_'):
                language = question['dimension'].replace('love_language_', '')
                if language in love_languages:
                    love_languages[language] += response.response_value
                    love_language_counts[language] += 1
        
        # Calculate averages
        for dim in ['anxiety', 'avoidance']:
            if attachment_counts[dim] > 0:
                attachment_scores[dim] = attachment_scores[dim] / attachment_counts[dim]
        
        # Classify attachment style
        attachment_style = self._classify_attachment_style(
            attachment_scores['anxiety'], 
            attachment_scores['avoidance']
        )
        
        # Rank love languages
        love_language_scores = {}
        for lang, total in love_languages.items():
            if love_language_counts[lang] > 0:
                love_language_scores[lang] = total / love_language_counts[lang]
        
        ranked_love_languages = sorted(
            love_language_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        return {
            'attachment': {
                'style': attachment_style,
                'anxiety_score': round(attachment_scores['anxiety'], 2),
                'avoidance_score': round(attachment_scores['avoidance'], 2),
                'description': self._get_attachment_description(attachment_style)
            },
            'love_languages': {
                'primary': ranked_love_languages[0][0] if ranked_love_languages else None,
                'secondary': ranked_love_languages[1][0] if len(ranked_love_languages) > 1 else None,
                'rankings': [{'language': lang, 'score': round(score, 2)} 
                           for lang, score in ranked_love_languages]
            },
            'relationship_strengths': self._identify_relationship_strengths(attachment_style, love_language_scores),
            'growth_areas': self._identify_relationship_growth_areas(attachment_style, attachment_scores)
        }
    
    def _classify_attachment_style(self, anxiety: float, avoidance: float) -> str:
        """Classify attachment style based on ECR-R cutoffs"""
        if anxiety < 3.5 and avoidance < 3.5:
            return 'secure'
        elif anxiety >= 3.5 and avoidance < 3.5:
            return 'anxious'
        elif anxiety < 3.5 and avoidance >= 3.5:
            return 'avoidant'
        else:
            return 'fearful-avoidant'
    
    def _get_attachment_description(self, style: str) -> str:
        """Get description for attachment style"""
        descriptions = {
            'secure': 'You have a secure attachment style, comfortable with intimacy and independence',
            'anxious': 'You tend toward anxious attachment, desiring closeness but worrying about rejection',
            'avoidant': 'You have an avoidant attachment style, valuing independence over intimacy',
            'fearful-avoidant': 'You show a fearful-avoidant pattern, wanting close relationships but fearing hurt'
        }
        return descriptions.get(style, 'Your attachment style is complex')
    
    def _identify_relationship_strengths(self, attachment_style: str, love_languages: Dict) -> List[str]:
        """Identify relationship strengths based on assessment"""
        strengths = []
        
        if attachment_style == 'secure':
            strengths.append('Balanced approach to intimacy and independence')
            strengths.append('Comfortable expressing needs and boundaries')
        elif attachment_style == 'anxious':
            strengths.append('Deep capacity for emotional connection')
            strengths.append('Highly attuned to partner\'s needs')
        elif attachment_style == 'avoidant':
            strengths.append('Strong sense of self and independence')
            strengths.append('Gives partners space to grow')
        
        # Add love language strengths
        if love_languages:
            primary = max(love_languages, key=love_languages.get)
            if primary == 'words_of_affirmation':
                strengths.append('Excellent at verbal expression of love')
            elif primary == 'quality_time':
                strengths.append('Prioritizes meaningful connection')
            elif primary == 'acts_of_service':
                strengths.append('Shows love through practical support')
        
        return strengths
    
    def _identify_relationship_growth_areas(self, attachment_style: str, scores: Dict) -> List[str]:
        """Identify areas for relationship growth"""
        growth_areas = []
        
        if attachment_style == 'anxious':
            growth_areas.append('Developing self-soothing strategies for relationship anxiety')
            growth_areas.append('Building confidence in your worth as a partner')
        elif attachment_style == 'avoidant':
            growth_areas.append('Practicing emotional vulnerability with trusted partners')
            growth_areas.append('Recognizing and expressing emotional needs')
        elif attachment_style == 'fearful-avoidant':
            growth_areas.append('Working through past relationship wounds')
            growth_areas.append('Building trust gradually in safe relationships')
        
        # Add score-based suggestions
        if scores.get('anxiety', 0) > 5:
            growth_areas.append('Managing jealousy and fear of abandonment')
        if scores.get('avoidance', 0) > 5:
            growth_areas.append('Allowing others to provide emotional support')
        
        return growth_areas
    
    def score_career_assessment(self, responses: List[QuestionResponse], 
                               big_five_scores: Dict[str, float]) -> Dict:
        """
        Score career assessment mapping to Holland's RIASEC with personality integration
        """
        # Initialize RIASEC scores
        riasec_scores = {
            'Realistic': 0.0,
            'Investigative': 0.0,
            'Artistic': 0.0,
            'Social': 0.0,
            'Enterprising': 0.0,
            'Conventional': 0.0
        }
        
        riasec_counts = {key: 0 for key in riasec_scores}
        
        # Process direct career responses
        for response in responses:
            question = self.questions.get(response.question_id)
            if not question:
                continue
            
            if question.get('assessment_type') == 'career':
                for riasec_type in riasec_scores:
                    if question.get('riasec_type') == riasec_type:
                        value = response.response_value
                        if question.get('reverse_scored'):
                            value = 8 - value
                        riasec_scores[riasec_type] += value
                        riasec_counts[riasec_type] += 1
        
        # Calculate averages
        for riasec_type in riasec_scores:
            if riasec_counts[riasec_type] > 0:
                riasec_scores[riasec_type] = riasec_scores[riasec_type] / riasec_counts[riasec_type]
        
        # Integrate Big Five personality scores
        riasec_adjusted = self._integrate_personality_with_riasec(riasec_scores, big_five_scores)
        
        # Find top 3 Holland codes
        sorted_codes = sorted(riasec_adjusted.items(), key=lambda x: x[1], reverse=True)
        holland_code = ''.join([code[0][0] for code in sorted_codes[:3]])
        
        # Generate career suggestions
        career_suggestions = self._generate_career_suggestions(holland_code, big_five_scores)
        
        return {
            'holland_code': holland_code,
            'riasec_scores': {k: round(v, 2) for k, v in riasec_adjusted.items()},
            'career_themes': self._identify_career_themes(sorted_codes[:3]),
            'suggested_careers': career_suggestions,
            'work_environment_preferences': self._identify_work_preferences(big_five_scores, riasec_adjusted),
            'career_development_tips': self._generate_career_development_tips(holland_code, big_five_scores)
        }
    
    def _integrate_personality_with_riasec(self, riasec: Dict, big_five: Dict) -> Dict:
        """Adjust RIASEC scores based on Big Five personality"""
        adjusted = riasec.copy()
        
        # Realistic: low Openness, high Conscientiousness
        adjusted['Realistic'] += (100 - big_five['Openness']) * 0.002 + big_five['Conscientiousness'] * 0.001
        
        # Investigative: high Openness, high Introversion
        adjusted['Investigative'] += big_five['Openness'] * 0.002 + (100 - big_five['Extraversion']) * 0.001
        
        # Artistic: high Openness, low Conscientiousness
        adjusted['Artistic'] += big_five['Openness'] * 0.003 + (100 - big_five['Conscientiousness']) * 0.001
        
        # Social: high Extraversion, high Agreeableness
        adjusted['Social'] += big_five['Extraversion'] * 0.002 + big_five['Agreeableness'] * 0.002
        
        # Enterprising: high Extraversion, low Agreeableness
        adjusted['Enterprising'] += big_five['Extraversion'] * 0.002 + (100 - big_five['Agreeableness']) * 0.001
        
        # Conventional: high Conscientiousness, low Openness
        adjusted['Conventional'] += big_five['Conscientiousness'] * 0.002 + (100 - big_five['Openness']) * 0.001
        
        return adjusted
    
    def _identify_career_themes(self, top_codes: List[Tuple[str, float]]) -> List[str]:
        """Identify career themes from top Holland codes"""
        themes = []
        
        code_themes = {
            'Realistic': 'Working with things, tools, or machines',
            'Investigative': 'Solving complex problems and discovering new knowledge',
            'Artistic': 'Creating, designing, and expressing ideas',
            'Social': 'Helping, teaching, and connecting with people',
            'Enterprising': 'Leading, persuading, and achieving business goals',
            'Conventional': 'Organizing, structuring, and maintaining systems'
        }
        
        for code, _ in top_codes:
            if code in code_themes:
                themes.append(code_themes[code])
        
        return themes
    
    def _generate_career_suggestions(self, holland_code: str, big_five: Dict) -> List[Dict]:
        """Generate specific career suggestions based on Holland code and personality"""
        # This is a simplified version - in production would use a comprehensive career database
        career_map = {
            'RIA': ['Engineer', 'Architect', 'Research Scientist'],
            'RIS': ['Medical Technician', 'Computer Programmer', 'Electrician'],
            'AIR': ['Industrial Designer', 'Technical Writer', 'Web Developer'],
            'AIS': ['Graphic Designer', 'Musician', 'Writer'],
            'SAI': ['Art Teacher', 'Counselor', 'Librarian'],
            'SIA': ['Psychologist', 'Social Worker', 'Teacher'],
            'ESA': ['Sales Manager', 'Public Relations', 'Marketing Director'],
            'EAS': ['Advertising Executive', 'Event Planner', 'Brand Manager'],
            'CER': ['Accountant', 'Financial Analyst', 'Project Manager'],
            'CEI': ['Data Analyst', 'Actuary', 'Compliance Officer']
        }
        
        # Get base careers from Holland code
        base_careers = career_map.get(holland_code[:3], ['Consultant', 'Analyst', 'Specialist'])
        
        # Adjust based on personality
        career_suggestions = []
        for career in base_careers:
            fit_score = self._calculate_career_fit(career, big_five)
            career_suggestions.append({
                'title': career,
                'fit_score': round(fit_score, 2),
                'description': f'This role aligns with your {holland_code} profile'
            })
        
        # Sort by fit score
        career_suggestions.sort(key=lambda x: x['fit_score'], reverse=True)
        
        return career_suggestions[:5]  # Top 5 suggestions
    
    def _calculate_career_fit(self, career: str, big_five: Dict) -> float:
        """Calculate career fit score based on personality"""
        # Simplified scoring - in production would use detailed career requirements
        base_score = 70.0
        
        # Adjust based on career type and personality match
        if 'Manager' in career or 'Director' in career:
            base_score += (big_five['Extraversion'] - 50) * 0.3
            base_score += (big_five['Conscientiousness'] - 50) * 0.2
        elif 'Analyst' in career or 'Scientist' in career:
            base_score += (big_five['Openness'] - 50) * 0.3
            base_score += (100 - big_five['Extraversion'] - 50) * 0.2
        elif 'Designer' in career or 'Artist' in career:
            base_score += (big_five['Openness'] - 50) * 0.4
            base_score += (100 - big_five['Conscientiousness'] - 50) * 0.1
        
        return min(100, max(0, base_score))
    
    def _identify_work_preferences(self, big_five: Dict, riasec: Dict) -> Dict:
        """Identify work environment preferences"""
        preferences = {
            'work_style': [],
            'environment': [],
            'motivators': [],
            'avoid': []
        }
        
        # Work style preferences
        if big_five['Extraversion'] > 60:
            preferences['work_style'].append('Collaborative team environments')
        else:
            preferences['work_style'].append('Independent work with focused time')
        
        if big_five['Conscientiousness'] > 70:
            preferences['work_style'].append('Structured processes and clear expectations')
        elif big_five['Conscientiousness'] < 40:
            preferences['work_style'].append('Flexible schedules and creative freedom')
        
        # Environment preferences
        if riasec['Artistic'] > 5:
            preferences['environment'].append('Creative and innovative workplace culture')
        if riasec['Social'] > 5:
            preferences['environment'].append('Mission-driven organizations helping others')
        if riasec['Conventional'] > 5:
            preferences['environment'].append('Stable, well-established organizations')
        
        # Motivators
        if big_five['Openness'] > 70:
            preferences['motivators'].append('Learning new skills and concepts')
        if big_five['Agreeableness'] > 70:
            preferences['motivators'].append('Making a positive impact on others')
        if riasec['Enterprising'] > 5:
            preferences['motivators'].append('Achievement and recognition')
        
        # Things to avoid
        if big_five['Neuroticism'] > 70:
            preferences['avoid'].append('High-pressure, unpredictable environments')
        if big_five['Extraversion'] < 30:
            preferences['avoid'].append('Constant social interaction and networking')
        
        return preferences
    
    def _generate_career_development_tips(self, holland_code: str, big_five: Dict) -> List[str]:
        """Generate personalized career development tips"""
        tips = []
        
        # Holland code specific tips
        if 'R' in holland_code[:2]:
            tips.append('Develop hands-on technical skills through certifications or workshops')
        if 'I' in holland_code[:2]:
            tips.append('Pursue advanced education or research opportunities in your field')
        if 'A' in holland_code[:2]:
            tips.append('Build a portfolio showcasing your creative work')
        if 'S' in holland_code[:2]:
            tips.append('Gain experience in mentoring or teaching roles')
        if 'E' in holland_code[:2]:
            tips.append('Develop leadership skills through project management')
        if 'C' in holland_code[:2]:
            tips.append('Master relevant software and organizational systems')
        
        # Personality-based tips
        if big_five['Conscientiousness'] < 50:
            tips.append('Use external tools and accountability partners to stay organized')
        if big_five['Extraversion'] < 40:
            tips.append('Practice networking in small, structured settings')
        if big_five['Openness'] > 80:
            tips.append('Seek roles that allow for innovation and creative problem-solving')
        
        return tips[:5]  # Return top 5 most relevant tips