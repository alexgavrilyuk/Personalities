from typing import Dict, List

class InterpretationService:
    def __init__(self):
        self.type_descriptions = {
            'INTJ': 'Architect - Independent, strategic, and driven by competence',
            'INTP': 'Thinker - Analytical, innovative, and intellectually curious',
            'ENTJ': 'Commander - Bold, strategic, and natural leaders',
            'ENTP': 'Debater - Quick-witted, clever, and love intellectual challenges',
            'INFJ': 'Advocate - Idealistic, principled, and deeply caring',
            'INFP': 'Mediator - Imaginative, idealistic, and guided by values',
            'ENFJ': 'Protagonist - Charismatic, altruistic, and natural leaders',
            'ENFP': 'Campaigner - Enthusiastic, creative, and sociable free spirits',
            'ISTJ': 'Logistician - Practical, fact-oriented, and reliable',
            'ISFJ': 'Defender - Dedicated, warm, and protective',
            'ESTJ': 'Executive - Organized, traditional, and excellent administrators',
            'ESFJ': 'Consul - Caring, social, and popular helpers',
            'ISTP': 'Virtuoso - Bold, practical, and masters of tools',
            'ISFP': 'Adventurer - Flexible, charming, and artistic',
            'ESTP': 'Entrepreneur - Energetic, perceptive, and live in the moment',
            'ESFP': 'Entertainer - Spontaneous, enthusiastic, and love life'
        }

    def generate_integrated_interpretation(self, results: Dict) -> str:
        big_five = results['big_five']['scores']
        mbti = results['mbti']
        functions = results['cognitive_functions']
        cluster = results['personality_cluster']
        depth = results['jungian_depth']
        
        interpretation = []
        
        # Opening with MBTI type
        type_desc = self.type_descriptions.get(mbti['primary_type'], 'Unique personality type')
        interpretation.append(f"Your personality profile indicates {mbti['primary_type']} preferences - {type_desc}. "
                            f"This classification shows {mbti['probability']*100:.1f}% confidence.")
        
        # Big Five trait highlights
        trait_insights = []
        
        # Extraversion
        e_score = big_five['Extraversion']
        if e_score > 65:
            trait_insights.append("highly extraverted nature energizes you in social situations")
        elif e_score < 35:
            trait_insights.append("introverted tendencies give you depth in reflection and focused work")
        
        # Openness
        o_score = big_five['Openness']
        if o_score > 70:
            trait_insights.append("exceptional openness drives your creativity and intellectual curiosity")
        elif o_score > 55:
            trait_insights.append("above-average openness supports your innovative thinking")
        
        # Conscientiousness
        c_score = big_five['Conscientiousness']
        if c_score > 65:
            trait_insights.append("strong conscientiousness ensures reliability and achievement")
        elif c_score < 35:
            trait_insights.append("flexible approach allows for spontaneity and adaptability")
        
        # Agreeableness
        a_score = big_five['Agreeableness']
        if a_score > 65:
            trait_insights.append("high agreeableness fosters harmony and cooperation")
        elif a_score < 35:
            trait_insights.append("analytical nature prioritizes truth over harmony")
        
        # Neuroticism
        n_score = big_five['Neuroticism']
        if n_score < 35:
            trait_insights.append("emotional stability provides resilience under pressure")
        elif n_score > 65:
            trait_insights.append("emotional sensitivity offers deep awareness and empathy")
        
        if trait_insights:
            interpretation.append(f"\nYour {', '.join(trait_insights[:2])}. "
                                f"{'Additionally, your ' + trait_insights[2] if len(trait_insights) > 2 else ''}")
        
        # Cognitive functions
        if functions['primary_stack']:
            dominant = functions['primary_stack'][0]
            auxiliary = functions['primary_stack'][1]
            dom_level = functions['development_levels'].get(dominant, 0)
            aux_level = functions['development_levels'].get(auxiliary, 0)
            
            interpretation.append(f"\nYour cognitive function stack reveals {dominant} as your dominant function "
                                f"(developed to {dom_level*100:.0f}%), supported by {auxiliary} "
                                f"({aux_level*100:.0f}% developed). This combination creates a unique lens "
                                f"through which you perceive and interact with the world.")
        
        # Cluster insight
        cluster_desc = cluster.get('cluster_description', 'unique')
        interpretation.append(f"\nYour overall personality pattern aligns with the '{cluster_desc}' cluster, "
                            f"suggesting {self._get_cluster_meaning(cluster_desc)}.")
        
        # Depth psychology insights
        if depth['shadow_integration'] > 0.7:
            interpretation.append("\nYour high shadow integration score indicates advanced self-awareness "
                                "and acceptance of your complete personality, including aspects you may "
                                "have previously rejected.")
        elif depth['shadow_integration'] > 0.5:
            interpretation.append("\nYou show moderate shadow integration, suggesting growing awareness "
                                "of your unconscious patterns and projections.")
        
        if depth.get('primary_archetype'):
            interpretation.append(f"\nYour primary archetype appears to be the {depth['primary_archetype']}, "
                                f"which influences your life narrative and core motivations.")
        
        # Integration summary
        interpretation.append("\n\nThis integrated profile reveals a complex individual who combines "
                            f"{self._get_integration_summary(big_five, mbti['primary_type'])}. "
                            "Remember that personality is dynamic and continues to develop throughout life.")
        
        return ' '.join(interpretation)

    def _get_cluster_meaning(self, cluster_name: str) -> str:
        meanings = {
            'Resilient': 'strong adaptation across multiple life domains with high functionality',
            'Overcontrolled': 'careful, cautious approach with heightened emotional sensitivity',
            'Undercontrolled': 'spontaneous, flexible style with preference for immediate experience',
            'Average': 'balanced traits without extreme tendencies in any direction'
        }
        return meanings.get(cluster_name, 'a unique personality configuration')

    def _get_integration_summary(self, big_five: Dict[str, float], mbti_type: str) -> str:
        # Create a brief integration summary based on highest and lowest traits
        sorted_traits = sorted(big_five.items(), key=lambda x: x[1], reverse=True)
        highest = sorted_traits[0][0].lower()
        lowest = sorted_traits[-1][0].lower()
        
        if mbti_type.startswith('I'):
            style = "reflective depth"
        else:
            style = "engaging energy"
        
        if mbti_type[1] == 'N':
            approach = "innovative vision"
        else:
            approach = "practical wisdom"
        
        return f"{style} with {approach}, anchored by strong {highest} while managing lower {lowest}"

    def generate_development_suggestions(self, results: Dict) -> List[str]:
        suggestions = []
        
        big_five = results['big_five']['scores']
        mbti = results['mbti']['primary_type']
        functions = results['cognitive_functions']
        depth = results['jungian_depth']
        
        # Suggestions based on lowest Big Five trait
        sorted_traits = sorted(big_five.items(), key=lambda x: x[1])
        lowest_trait, lowest_score = sorted_traits[0]
        
        if lowest_trait == 'Extraversion' and lowest_score < 35:
            suggestions.append("Practice initiating social connections in comfortable settings to expand your interpersonal comfort zone")
        elif lowest_trait == 'Agreeableness' and lowest_score < 35:
            suggestions.append("Develop empathy through active listening exercises and considering others' perspectives before responding")
        elif lowest_trait == 'Conscientiousness' and lowest_score < 35:
            suggestions.append("Implement simple organizational systems and time-blocking to enhance productivity without losing flexibility")
        elif lowest_trait == 'Openness' and lowest_score < 35:
            suggestions.append("Explore new experiences in small doses - try a new cuisine, read outside your usual genres, or learn a new skill")
        
        # Suggestions based on cognitive functions
        if functions['primary_stack'] and len(functions['primary_stack']) >= 4:
            inferior = functions['primary_stack'][3]
            inferior_level = functions['development_levels'].get(inferior, 0.2)
            
            if inferior_level < 0.3:
                suggestions.append(f"Work on developing your inferior function ({inferior}) through low-stakes practice and gradual exposure")
        
        # Shadow work suggestions
        if depth['shadow_integration'] < 0.5:
            suggestions.append("Explore shadow work through journaling about what triggers strong emotional reactions in others")
        
        # Type-specific growth edges
        if mbti.startswith('I') and big_five['Extraversion'] < 40:
            suggestions.append("Balance introspection with external engagement through structured social activities")
        elif mbti.startswith('E') and big_five['Extraversion'] > 70:
            suggestions.append("Cultivate reflective practices like meditation or journaling to deepen self-awareness")
        
        if mbti[1] == 'N' and big_five['Openness'] > 70:
            suggestions.append("Ground innovative ideas with practical implementation steps and concrete details")
        elif mbti[1] == 'S' and big_five['Openness'] < 40:
            suggestions.append("Stretch your comfort zone by exploring abstract concepts and future possibilities")
        
        if mbti[2] == 'T' and big_five['Agreeableness'] < 40:
            suggestions.append("Practice expressing appreciation and considering emotional impacts in decision-making")
        elif mbti[2] == 'F' and big_five['Agreeableness'] > 70:
            suggestions.append("Develop objective analysis skills and practice setting healthy boundaries")
        
        if mbti[3] == 'J' and big_five['Conscientiousness'] > 70:
            suggestions.append("Build flexibility by intentionally leaving some plans open-ended and embracing spontaneity")
        elif mbti[3] == 'P' and big_five['Conscientiousness'] < 40:
            suggestions.append("Create loose structures and routines that support your goals while maintaining adaptability")
        
        # Individuation suggestions
        if depth.get('individuation_stage') == 'Early Development':
            suggestions.append("Begin exploring your authentic self through values clarification exercises")
        elif depth.get('individuation_stage') == 'Emerging Awareness':
            suggestions.append("Deepen self-knowledge through therapy, coaching, or structured self-reflection")
        elif depth.get('individuation_stage') == 'Active Integration':
            suggestions.append("Continue integrating disparate aspects of self through creative expression and meaningful relationships")
        
        # Ensure we have at least 5 suggestions
        while len(suggestions) < 5:
            generic_suggestions = [
                "Practice mindfulness to increase present-moment awareness and emotional regulation",
                "Seek feedback from trusted others to gain perspective on blind spots",
                "Engage in activities that challenge your comfort zone in manageable ways",
                "Develop a growth mindset by viewing challenges as opportunities for development",
                "Create a personal development plan with specific, measurable goals"
            ]
            for sugg in generic_suggestions:
                if sugg not in suggestions and len(suggestions) < 5:
                    suggestions.append(sugg)
        
        return suggestions[:5]  # Return top 5 suggestions