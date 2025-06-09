import json
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import numpy as np

class ContextAwareReportGenerator:
    """Generate personalized, scientifically-grounded reports"""
    
    def __init__(self):
        self.narrative_templates = self._load_narrative_templates()
        self.interaction_rules = self._load_interaction_rules()
        self.scientific_citations = self._load_scientific_citations()
    
    def _load_narrative_templates(self) -> Dict:
        """Load narrative templates - in production would come from database"""
        return {
            'openness': {
                'very_high': [
                    {
                        'min_percentile': 85,
                        'max_percentile': 95,
                        'template': """Your Openness score places you in the {percentile}th percentile, marking you as 
                        exceptionally receptive to new experiences and ideas. This isn't just about being "creative" – 
                        it's a fundamental orientation toward novelty and complexity that shapes how you perceive reality. 
                        You likely find yourself drawn to abstract concepts that others find bewildering, and you may 
                        experience a rich inner world of imagination that sometimes feels more real than the mundane."""
                    },
                    {
                        'min_percentile': 95,
                        'max_percentile': 100,
                        'template': """At the {percentile}th percentile for Openness, you represent the vanguard of 
                        human curiosity and intellectual exploration. Your mind operates like a particle accelerator 
                        for ideas – constantly smashing concepts together to see what new insights emerge. This extreme 
                        openness can be both a superpower and a challenge, as you may struggle with the mundane necessities 
                        of life that don't stimulate your ever-hungry intellect."""
                    }
                ],
                'high': [
                    {
                        'min_percentile': 70,
                        'max_percentile': 85,
                        'template': """With an Openness score in the {percentile}th percentile, you demonstrate a strong 
                        inclination toward intellectual curiosity and aesthetic appreciation. Your mind naturally seeks 
                        out new perspectives and experiences, though you balance this with practical considerations. 
                        You're likely seen as creative and insightful by others, capable of thinking outside conventional 
                        boundaries while still maintaining connection to shared reality."""
                    }
                ],
                'moderate_high': [
                    {
                        'min_percentile': 55,
                        'max_percentile': 70,
                        'template': """Your Openness score of {score} places you moderately above average, suggesting 
                        a healthy balance between novelty-seeking and practical grounding. You enjoy exploring new ideas 
                        and experiences, but you're selective about which rabbit holes you dive down. This balanced 
                        approach often makes you an effective bridge between visionaries and pragmatists."""
                    }
                ],
                'moderate': [
                    {
                        'min_percentile': 45,
                        'max_percentile': 55,
                        'template': """With an Openness score near the population average, you demonstrate a balanced 
                        approach to new experiences. You're neither closed off to novelty nor constantly seeking it out. 
                        This equilibrium allows you to adapt to various situations – embracing change when beneficial 
                        while maintaining stability when needed."""
                    }
                ],
                'moderate_low': [
                    {
                        'min_percentile': 30,
                        'max_percentile': 45,
                        'template': """Your Openness score suggests you lean toward the practical and proven over the 
                        theoretical and novel. This isn't a limitation – it's a grounding force that helps you navigate 
                        life with clarity and purpose. While others chase every new trend, you focus on what works, 
                        building expertise through depth rather than breadth."""
                    }
                ],
                'low': [
                    {
                        'min_percentile': 15,
                        'max_percentile': 30,
                        'template': """Scoring in the {percentile}th percentile for Openness, you demonstrate a strong 
                        preference for the familiar, practical, and time-tested. Your mind excels at mastering established 
                        systems and finding efficiency within existing frameworks. This focused approach often leads to 
                        deep expertise and reliable judgment in your areas of specialization."""
                    }
                ],
                'very_low': [
                    {
                        'min_percentile': 0,
                        'max_percentile': 15,
                        'template': """Your Openness score places you among the most practically-minded individuals. 
                        You have an exceptional ability to focus on concrete realities without being distracted by 
                        abstract possibilities. This laser focus on the tangible and proven makes you exceptionally 
                        reliable and effective in domains requiring consistency and attention to detail."""
                    }
                ]
            },
            'conscientiousness': {
                'very_high': [
                    {
                        'min_percentile': 85,
                        'max_percentile': 100,
                        'template': """Your Conscientiousness score of {score} ({percentile}th percentile) reveals 
                        exceptional self-discipline and organization. You don't just set goals – you architect detailed 
                        systems to achieve them. This trait constellation is found in high achievers across domains, 
                        from CEOs to Olympic athletes. Your ability to delay gratification and maintain focus over 
                        extended periods gives you a significant advantage in long-term endeavors."""
                    }
                ],
                'high': [
                    {
                        'min_percentile': 70,
                        'max_percentile': 85,
                        'template': """Scoring in the {percentile}th percentile for Conscientiousness, you demonstrate 
                        strong organizational abilities and self-control. You're the person others rely on to follow 
                        through, meet deadlines, and maintain standards. This reliability, combined with your ability 
                        to plan ahead, positions you well for leadership roles and complex projects."""
                    }
                ]
            },
            'extraversion': {
                'very_high': [
                    {
                        'min_percentile': 85,
                        'max_percentile': 100,
                        'template': """Your Extraversion score places you in the {percentile}th percentile, indicating 
                        exceptional social energy and enthusiasm. You don't just enjoy social interaction – you're 
                        energized by it, often feeling most alive when engaged with others. This high extraversion 
                        manifests as natural leadership ability, infectious enthusiasm, and a talent for bringing 
                        people together around shared goals."""
                    }
                ]
            },
            'agreeableness': {
                'very_high': [
                    {
                        'min_percentile': 85,
                        'max_percentile': 100,
                        'template': """At the {percentile}th percentile for Agreeableness, you possess exceptional 
                        empathy and concern for others' wellbeing. This isn't mere niceness – it's a deep orientation 
                        toward harmony and cooperation that influences how you perceive and navigate social situations. 
                        Your high agreeableness makes you a natural mediator and trusted confidant."""
                    }
                ]
            },
            'neuroticism': {
                'very_high': [
                    {
                        'min_percentile': 85,
                        'max_percentile': 100,
                        'template': """Your Neuroticism score in the {percentile}th percentile indicates heightened 
                        emotional sensitivity and reactivity. This isn't a flaw – it's a different way of experiencing 
                        the world that comes with both challenges and gifts. Your emotional depth allows you to perceive 
                        subtle interpersonal dynamics and experience life with remarkable intensity."""
                    }
                ],
                'very_low': [
                    {
                        'min_percentile': 0,
                        'max_percentile': 15,
                        'template': """Scoring in the {percentile}th percentile for Neuroticism reveals exceptional 
                        emotional stability and resilience. You maintain equilibrium in situations that would unsettle 
                        most people. This isn't emotional numbness – it's a robust psychological constitution that 
                        allows you to remain clear-headed under pressure and recover quickly from setbacks."""
                    }
                ]
            }
        }
    
    def _load_interaction_rules(self) -> List[Dict]:
        """Load trait interaction patterns"""
        return [
            {
                'name': 'Creative Chaos',
                'conditions': {
                    'openness': {'min': 70},
                    'conscientiousness': {'max': 30}
                },
                'narrative': """Your combination of high Openness ({openness_score}) and low Conscientiousness 
                ({conscientiousness_score}) creates what researchers call the "Creative Chaos" pattern. You're 
                blessed with exceptional creativity and vision, but cursed with the challenge of bringing those 
                visions to practical fruition. This pattern is found in many revolutionary artists and innovators 
                who changed the world – but also struggled with deadlines, organization, and finishing projects.""",
                'behavioral_examples': [
                    "Starting multiple creative projects with enthusiasm, then losing steam",
                    "Having brilliant ideas at 3 AM but forgetting them by morning",
                    "Your workspace looking like a tornado hit it, but you knowing where everything is"
                ],
                'growth_suggestions': [
                    "Partner with detail-oriented people who can execute your visions",
                    "Use external structure (apps, accountability partners) to compensate",
                    "Embrace your pattern but build minimal systems for capturing ideas"
                ]
            },
            {
                'name': 'Turbulent Extravert',
                'conditions': {
                    'extraversion': {'min': 70},
                    'neuroticism': {'min': 70}
                },
                'narrative': """The combination of high Extraversion ({extraversion_score}) and high Neuroticism 
                ({neuroticism_score}) creates an intense internal experience. You crave social connection and 
                thrive in group settings, yet you're also highly sensitive to social dynamics and potential 
                rejection. This creates a push-pull dynamic that can be exhausting but also leads to deep, 
                meaningful connections with others who appreciate your authenticity.""",
                'behavioral_examples': [
                    "Being the life of the party while battling inner anxiety",
                    "Feeling energized by social events but emotionally drained afterward",
                    "Having intense, passionate friendships with lots of ups and downs"
                ],
                'growth_suggestions': [
                    "Build in recovery time after social events",
                    "Practice self-compassion when social anxiety arises",
                    "Choose quality over quantity in social connections"
                ]
            },
            {
                'name': 'The Diplomat',
                'conditions': {
                    'agreeableness': {'min': 80},
                    'neuroticism': {'max': 30}
                },
                'narrative': """Your exceptional Agreeableness ({agreeableness_score}) combined with low Neuroticism 
                ({neuroticism_score}) creates a powerful diplomatic presence. You possess both the desire to help 
                others and the emotional stability to do so effectively. This rare combination makes you a natural 
                peacemaker and trusted advisor, able to navigate conflicts without being overwhelmed by them.""",
                'behavioral_examples': [
                    "Being the person everyone turns to for advice",
                    "Mediating conflicts without taking sides or getting stressed",
                    "Maintaining optimism and warmth even in difficult situations"
                ],
                'growth_suggestions': [
                    "Set boundaries to prevent burnout from helping others",
                    "Practice asserting your own needs alongside others'",
                    "Use your gifts in leadership or counseling roles"
                ]
            }
        ]
    
    def _load_scientific_citations(self) -> List[Dict]:
        """Load scientific references"""
        return [
            {
                'id': 'costa1992',
                'citation': 'Costa, P. T., & McCrae, R. R. (1992). Revised NEO Personality Inventory (NEO-PI-R) and NEO Five-Factor Inventory (NEO-FFI) professional manual. Psychological Assessment Resources.',
                'category': 'big_five',
                'relevance_tags': ['big_five', 'measurement', 'validation']
            },
            {
                'id': 'mccrae1989',
                'citation': 'McCrae, R. R., & Costa, P. T. (1989). Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality. Journal of Personality, 57(1), 17-40.',
                'category': 'mbti_big_five',
                'relevance_tags': ['mbti', 'big_five', 'correlation']
            }
        ]
    
    def generate_discovery_report(self, profile: Dict) -> Dict:
        """Generate 2-3 page teaser report for discovery assessment"""
        report = {
            'metadata': {
                'assessment_type': 'discovery',
                'generated_at': datetime.now().isoformat(),
                'confidence_level': 'indicative'
            },
            'sections': []
        }
        
        # 1. Personality Snapshot
        snapshot = self._generate_personality_snapshot(profile)
        report['sections'].append({
            'title': 'Your Personality Snapshot',
            'content': snapshot,
            'visual_type': 'radar_chart',
            'visual_data': self._prepare_radar_data(profile)
        })
        
        # 2. Tentative Type
        type_section = self._generate_type_teaser(profile)
        report['sections'].append({
            'title': f'You Might Be An {profile["mbti"]["primary_type"]}',
            'content': type_section,
            'confidence_note': 'Based on limited questions. Take the full assessment for accurate typing.',
            'confidence_percentage': round(profile['mbti']['probability'] * 100)
        })
        
        # 3. Top Strengths & Growth Edge
        strengths = self._identify_top_strengths(profile, limit=3)
        growth = self._identify_growth_opportunity(profile, limit=1)
        
        report['sections'].append({
            'title': 'Your Unique Strengths',
            'content': strengths,
            'type': 'strengths'
        })
        
        report['sections'].append({
            'title': 'Your Growth Edge',
            'content': growth,
            'type': 'growth'
        })
        
        # 4. Call to Action
        cta = self._generate_discovery_cta(profile)
        report['sections'].append({
            'title': 'Discover Your Full Personality Profile',
            'content': cta,
            'type': 'cta'
        })
        
        return report
    
    def generate_core_report(self, profile: Dict) -> Dict:
        """Generate comprehensive 15-20 page report"""
        report = {
            'metadata': {
                'assessment_type': 'core',
                'generated_at': datetime.now().isoformat(),
                'assessment_version': '2.0',
                'scientific_basis': True
            },
            'sections': []
        }
        
        # 1. Executive Summary
        executive_summary = self._generate_executive_summary(profile)
        report['sections'].append({
            'title': 'Executive Summary',
            'content': executive_summary,
            'type': 'summary'
        })
        
        # 2. The Big Five Deep Dive
        for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']:
            trait_analysis = self._generate_trait_deep_dive(trait, profile)
            report['sections'].append(trait_analysis)
        
        # 3. Personality Type Analysis
        type_analysis = self._generate_comprehensive_type_analysis(profile)
        report['sections'].append(type_analysis)
        
        # 4. What Makes You Unique
        uniqueness = self._generate_uniqueness_section(profile)
        report['sections'].append(uniqueness)
        
        # 5. Trait Interactions
        interactions = self._generate_trait_interaction_insights(profile)
        report['sections'].append(interactions)
        
        # 6. Your Growth Blueprint
        growth_plan = self._generate_personalized_growth_plan(profile)
        report['sections'].append(growth_plan)
        
        # 7. Scientific References
        report['sections'].append({
            'title': 'Scientific Basis',
            'content': self._generate_scientific_references(),
            'type': 'references'
        })
        
        return report
    
    def _generate_personality_snapshot(self, profile: Dict) -> str:
        """Generate concise personality overview"""
        scores = profile['big_five']['scores']
        percentiles = profile['big_five']['percentiles']
        
        # Find most extreme traits
        extreme_traits = []
        for trait, percentile in percentiles.items():
            if percentile > 80:
                extreme_traits.append(f"exceptionally high {trait}")
            elif percentile < 20:
                extreme_traits.append(f"remarkably low {trait}")
        
        snapshot = f"""Your personality profile reveals a unique combination of traits that sets you apart. """
        
        if extreme_traits:
            snapshot += f"You show {', '.join(extreme_traits[:2])}"
            if len(extreme_traits) > 2:
                snapshot += f" and {extreme_traits[2]}"
            snapshot += ". "
        
        # Add balance statement
        balanced_traits = [t for t, p in percentiles.items() if 40 <= p <= 60]
        if balanced_traits:
            snapshot += f"You demonstrate balance in {', '.join(balanced_traits)}. "
        
        snapshot += """This combination creates a distinctive personality pattern that influences how you 
        think, feel, and interact with the world around you."""
        
        return snapshot
    
    def _generate_type_teaser(self, profile: Dict) -> str:
        """Generate MBTI type teaser for discovery report"""
        mbti_type = profile['mbti']['primary_type']
        probability = profile['mbti']['probability']
        
        type_descriptions = {
            'INTJ': "the Architect - a strategic, innovative thinker who sees the big picture",
            'INTP': "the Thinker - an analytical problem-solver who loves understanding systems",
            'ENTJ': "the Commander - a bold, imaginative leader who organizes change",
            'ENTP': "the Debater - a smart, curious innovator who enjoys intellectual challenges",
            'INFJ': "the Advocate - an insightful, principled helper with strong intuition",
            'INFP': "the Mediator - an idealistic, empathetic dreamer who seeks meaning",
            'ENFJ': "the Protagonist - an inspiring, reliable leader who helps others grow",
            'ENFP': "the Campaigner - an enthusiastic, creative spirit who inspires others",
            'ISTJ': "the Logistician - a practical, fact-oriented organizer who values tradition",
            'ISFJ': "the Defender - a dedicated, warm protector who remembers details",
            'ESTJ': "the Executive - an organized, practical leader who gets things done",
            'ESFJ': "the Consul - a caring, social organizer who creates harmony",
            'ISTP': "the Virtuoso - a bold, practical experimenter who works with their hands",
            'ISFP': "the Adventurer - a flexible, charming artist who lives in the moment",
            'ESTP': "the Entrepreneur - an energetic, perceptive doer who loves action",
            'ESFP': "the Entertainer - a spontaneous, enthusiastic performer who engages others"
        }
        
        description = type_descriptions.get(mbti_type, "a unique personality type")
        
        content = f"""Based on your responses, you appear to be {description}. """
        
        if probability < 0.7:
            content += f"""However, with only 60 questions, we can only be {round(probability * 100)}% confident 
            in this classification. The full assessment would provide a much clearer picture of your type and 
            reveal important nuances about your cognitive preferences."""
        else:
            content += f"""This preliminary typing shows {round(probability * 100)}% confidence, which is 
            promising but not definitive. The full assessment would confirm this type and explore the unique 
            ways it manifests in your personality."""
        
        return content
    
    def _prepare_radar_data(self, profile: Dict) -> Dict:
        """Prepare data for radar chart visualization"""
        return {
            'labels': ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
            'values': [
                profile['big_five']['scores']['Openness'],
                profile['big_five']['scores']['Conscientiousness'],
                profile['big_five']['scores']['Extraversion'],
                profile['big_five']['scores']['Agreeableness'],
                profile['big_five']['scores']['Neuroticism']
            ],
            'percentiles': [
                profile['big_five']['percentiles']['Openness'],
                profile['big_five']['percentiles']['Conscientiousness'],
                profile['big_five']['percentiles']['Extraversion'],
                profile['big_five']['percentiles']['Agreeableness'],
                profile['big_five']['percentiles']['Neuroticism']
            ]
        }
    
    def _identify_top_strengths(self, profile: Dict, limit: int = 3) -> List[Dict]:
        """Identify and describe top personality strengths"""
        strengths = []
        scores = profile['big_five']['scores']
        percentiles = profile['big_five']['percentiles']
        
        # High trait strengths
        strength_map = {
            'Openness': {
                'high': {
                    'title': 'Creative Visionary',
                    'description': 'Your exceptional openness to experience makes you a natural innovator and creative problem-solver.'
                }
            },
            'Conscientiousness': {
                'high': {
                    'title': 'Reliable Achiever',
                    'description': 'Your strong conscientiousness means others can count on you to deliver excellence consistently.'
                }
            },
            'Extraversion': {
                'high': {
                    'title': 'Natural Connector',
                    'description': 'Your high extraversion gives you the ability to energize and inspire those around you.'
                },
                'low': {
                    'title': 'Deep Thinker',
                    'description': 'Your introversion allows for deep focus and thoughtful analysis that others often miss.'
                }
            },
            'Agreeableness': {
                'high': {
                    'title': 'Trusted Mediator',
                    'description': 'Your high agreeableness makes you a natural peacemaker and trusted confidant.'
                }
            },
            'Neuroticism': {
                'low': {
                    'title': 'Emotional Rock',
                    'description': 'Your emotional stability allows you to remain calm and effective under pressure.'
                }
            }
        }
        
        # Find high and low extremes
        for trait, percentile in sorted(percentiles.items(), key=lambda x: abs(x[1] - 50), reverse=True):
            if len(strengths) >= limit:
                break
                
            if percentile > 70 and trait in strength_map and 'high' in strength_map[trait]:
                strengths.append(strength_map[trait]['high'])
            elif percentile < 30 and trait in strength_map and 'low' in strength_map[trait]:
                strengths.append(strength_map[trait]['low'])
        
        return strengths
    
    def _identify_growth_opportunity(self, profile: Dict, limit: int = 1) -> List[Dict]:
        """Identify primary growth opportunity"""
        opportunities = []
        scores = profile['big_five']['scores']
        
        # Look for challenging combinations
        if scores['Openness'] > 70 and scores['Conscientiousness'] < 40:
            opportunities.append({
                'title': 'Channeling Your Creativity',
                'description': 'Your creative brilliance would shine even brighter with some simple organizational systems.',
                'suggestion': 'Try using a simple capture system for your ideas - even a voice recorder app can help preserve your insights.'
            })
        
        if scores['Agreeableness'] > 80:
            opportunities.append({
                'title': 'Healthy Boundaries',
                'description': 'Your caring nature is a gift, but remember that saying "no" sometimes helps you say "yes" to what matters most.',
                'suggestion': 'Practice one small "no" this week to something that doesn\'t align with your priorities.'
            })
        
        if scores['Neuroticism'] > 70:
            opportunities.append({
                'title': 'Emotional Regulation',
                'description': 'Your emotional sensitivity gives you deep empathy, and learning to regulate these feelings can make them a superpower.',
                'suggestion': 'Try a simple breathing exercise (4-4-4) when you feel overwhelmed.'
            })
        
        # Default opportunity if none found
        if not opportunities:
            opportunities.append({
                'title': 'Continuous Growth',
                'description': 'Every personality has areas for growth. The full assessment will reveal your specific development opportunities.',
                'suggestion': 'Take the complete assessment to get personalized growth recommendations.'
            })
        
        return opportunities[:limit]
    
    def _generate_discovery_cta(self, profile: Dict) -> str:
        """Generate call to action for discovery report"""
        cta = """This snapshot only scratches the surface of your personality. The full Core Assessment includes:

• 200 scientifically-validated questions for precise measurement
• Detailed analysis of all five personality dimensions and their facets  
• Confident personality type determination with cognitive function analysis
• Personalized growth recommendations based on your unique profile
• Comparison with population norms and identification of your rare traits

Ready to discover your complete personality profile?"""
        
        return cta
    
    def _generate_executive_summary(self, profile: Dict) -> str:
        """Generate executive summary for full report"""
        scores = profile['big_five']['scores']
        mbti_type = profile['mbti']['primary_type']
        
        summary = f"""You are an {mbti_type} with a distinctive personality profile characterized by """
        
        # Highlight extremes
        extremes = []
        for trait, score in scores.items():
            if score > 75:
                extremes.append(f"high {trait}")
            elif score < 25:
                extremes.append(f"low {trait}")
        
        if extremes:
            summary += f"{', '.join(extremes)}. "
        
        # Add uniqueness
        if 'uniqueness' in profile:
            uniqueness_score = profile['uniqueness']['uniqueness_score']
            if uniqueness_score > 50:
                summary += f"Your personality combination is statistically rare, appearing in less than {100-uniqueness_score}% of the population. "
        
        summary += f"""This report provides a comprehensive analysis of your personality traits, their interactions, 
        and their implications for your personal and professional life."""
        
        return summary
    
    def _generate_trait_deep_dive(self, trait: str, profile: Dict) -> Dict:
        """Generate nuanced analysis for a single Big Five trait"""
        score = profile['big_five']['scores'][trait]
        percentile = profile['big_five']['percentiles'][trait]
        facets = profile['big_five'].get('facet_scores', {}).get(trait, {})
        
        # Select appropriate narrative
        narrative = self._select_trait_narrative(trait, percentile)
        
        # Format narrative with actual values
        formatted_narrative = narrative.format(
            score=round(score, 1),
            percentile=round(percentile, 1)
        )
        
        # Add facet analysis
        facet_analysis = self._generate_facet_analysis(trait, facets)
        
        # Real-world implications
        implications = self._generate_trait_implications(trait, score, percentile)
        
        return {
            'title': f'Your {trait} Profile',
            'type': 'trait_analysis',
            'trait': trait,
            'score_summary': {
                'score': score,
                'percentile': percentile,
                'description': self._get_percentile_description(percentile),
                'confidence_interval': profile['big_five']['confidence_intervals'][trait]
            },
            'narrative': formatted_narrative,
            'facet_analysis': facet_analysis,
            'implications': implications,
            'visual_type': 'facet_bar_chart',
            'visual_data': {
                'facets': facets,
                'trait_score': score
            }
        }
    
    def _select_trait_narrative(self, trait: str, percentile: float) -> str:
        """Select appropriate narrative based on trait and percentile"""
        trait_lower = trait.lower()
        
        if trait_lower not in self.narrative_templates:
            return f"Your {trait} score of {{score}} ({{percentile}}th percentile) shapes your personality in important ways."
        
        # Determine level
        if percentile >= 85:
            level = 'very_high'
        elif percentile >= 70:
            level = 'high'
        elif percentile >= 55:
            level = 'moderate_high'
        elif percentile >= 45:
            level = 'moderate'
        elif percentile >= 30:
            level = 'moderate_low'
        elif percentile >= 15:
            level = 'low'
        else:
            level = 'very_low'
        
        # Get narratives for this level
        level_narratives = self.narrative_templates[trait_lower].get(level, [])
        
        if not level_narratives:
            return f"Your {trait} score of {{score}} ({{percentile}}th percentile) shapes your personality in important ways."
        
        # Select narrative based on specific percentile
        for narrative in level_narratives:
            if narrative['min_percentile'] <= percentile <= narrative['max_percentile']:
                return narrative['template']
        
        # Default to first narrative if no exact match
        return level_narratives[0]['template']
    
    def _generate_facet_analysis(self, trait: str, facets: Dict[str, float]) -> str:
        """Generate analysis of trait facets"""
        if not facets:
            return "Detailed facet analysis requires the complete assessment data."
        
        analysis = f"Breaking down your {trait} into its component facets reveals important nuances:\n\n"
        
        # Sort facets by score
        sorted_facets = sorted(facets.items(), key=lambda x: x[1], reverse=True)
        
        # Highlight highest and lowest
        if sorted_facets:
            highest = sorted_facets[0]
            analysis += f"• Your highest facet is {highest[0].replace('_', ' ').title()} ({highest[1]}%), "
            analysis += f"suggesting particular strength in this aspect of {trait}.\n"
            
            if len(sorted_facets) > 1:
                lowest = sorted_facets[-1]
                analysis += f"• Your lowest facet is {lowest[0].replace('_', ' ').title()} ({lowest[1]}%), "
                analysis += f"indicating an area where you express {trait} less strongly.\n"
        
        # Note significant variations
        if facets:
            facet_values = list(facets.values())
            std_dev = np.std(facet_values)
            if std_dev > 15:
                analysis += f"\nThe significant variation across your {trait} facets (SD={std_dev:.1f}) suggests "
                analysis += f"a complex, nuanced expression of this trait rather than a uniform pattern."
        
        return analysis
    
    def _generate_trait_implications(self, trait: str, score: float, percentile: float) -> List[Dict]:
        """Generate real-world implications for trait level"""
        implications = []
        
        # Trait-specific implications
        if trait == 'Openness':
            if percentile > 70:
                implications.append({
                    'domain': 'Career',
                    'implication': 'You\'ll thrive in roles requiring innovation, creativity, and strategic thinking'
                })
                implications.append({
                    'domain': 'Learning',
                    'implication': 'You learn best through exploration and connecting diverse concepts'
                })
            elif percentile < 30:
                implications.append({
                    'domain': 'Career',
                    'implication': 'You excel in roles requiring expertise, consistency, and practical application'
                })
                implications.append({
                    'domain': 'Decision Making',
                    'implication': 'You make decisions based on proven methods and concrete evidence'
                })
        
        elif trait == 'Conscientiousness':
            if percentile > 70:
                implications.append({
                    'domain': 'Work Style',
                    'implication': 'You naturally create systems and stick to them, making you highly productive'
                })
                implications.append({
                    'domain': 'Leadership',
                    'implication': 'Others see you as reliable and trustworthy, natural leadership qualities'
                })
            elif percentile < 30:
                implications.append({
                    'domain': 'Creativity',
                    'implication': 'Your flexibility allows for spontaneous creativity and adaptability'
                })
                implications.append({
                    'domain': 'Stress',
                    'implication': 'You may feel constrained by rigid structures and excessive rules'
                })
        
        # Add more trait-specific implications...
        
        return implications
    
    def _get_percentile_description(self, percentile: float) -> str:
        """Get description for percentile score"""
        if percentile >= 95:
            return "Exceptionally high - among the highest 5%"
        elif percentile >= 85:
            return "Very high - higher than 85% of people"
        elif percentile >= 70:
            return "High - higher than 70% of people"
        elif percentile >= 55:
            return "Moderately high - above average"
        elif percentile >= 45:
            return "Average - near the population mean"
        elif percentile >= 30:
            return "Moderately low - below average"
        elif percentile >= 15:
            return "Low - lower than 85% of people"
        elif percentile >= 5:
            return "Very low - lower than 95% of people"
        else:
            return "Exceptionally low - among the lowest 5%"
    
    def _generate_comprehensive_type_analysis(self, profile: Dict) -> Dict:
        """Generate comprehensive MBTI type analysis"""
        mbti_type = profile['mbti']['primary_type']
        probability = profile['mbti']['probability']
        functions = profile.get('cognitive_functions', {})
        
        analysis = {
            'title': f'Your Personality Type: {mbti_type}',
            'type': 'mbti_analysis',
            'content': self._generate_type_description(mbti_type, probability),
            'cognitive_functions': self._explain_cognitive_functions(functions),
            'type_dynamics': self._explain_type_dynamics(mbti_type),
            'visual_type': 'function_stack',
            'visual_data': functions
        }
        
        return analysis
    
    def _generate_type_description(self, mbti_type: str, probability: float) -> str:
        """Generate detailed type description"""
        # This would be much more extensive in production
        base_description = f"""As an {mbti_type}, you represent approximately {self._get_type_percentage(mbti_type)}% 
        of the population. Your type is characterized by a unique cognitive function stack that shapes how you 
        perceive and judge information."""
        
        if probability > 0.8:
            base_description += f" With {round(probability * 100)}% confidence in this typing, we can provide detailed insights into your cognitive preferences."
        else:
            base_description += f" The {round(probability * 100)}% confidence suggests some flexibility in your type expression."
        
        return base_description
    
    def _get_type_percentage(self, mbti_type: str) -> float:
        """Get population percentage for MBTI type"""
        # Based on various population studies
        type_percentages = {
            'INTJ': 2.1, 'INTP': 3.3, 'ENTJ': 1.8, 'ENTP': 3.2,
            'INFJ': 1.5, 'INFP': 4.4, 'ENFJ': 2.5, 'ENFP': 8.1,
            'ISTJ': 11.6, 'ISFJ': 13.8, 'ESTJ': 8.7, 'ESFJ': 12.0,
            'ISTP': 5.4, 'ISFP': 8.8, 'ESTP': 4.3, 'ESFP': 8.5
        }
        return type_percentages.get(mbti_type, 5.0)
    
    def _explain_cognitive_functions(self, functions: Dict) -> str:
        """Explain cognitive function stack"""
        if not functions.get('primary_stack'):
            return "Cognitive function analysis requires complete assessment data."
        
        stack = functions['primary_stack']
        development = functions.get('development_levels', {})
        
        explanation = "Your cognitive function stack:\n\n"
        
        function_roles = ['Dominant', 'Auxiliary', 'Tertiary', 'Inferior']
        
        for i, (role, func) in enumerate(zip(function_roles, stack)):
            level = development.get(func, 0.5)
            explanation += f"**{role} Function: {self._get_function_name(func)}**\n"
            explanation += f"Development level: {round(level * 100)}%\n"
            explanation += f"{self._get_function_description(func, role)}\n\n"
        
        return explanation
    
    def _get_function_name(self, function: str) -> str:
        """Get full name for cognitive function"""
        function_names = {
            'Ni': 'Introverted Intuition',
            'Ne': 'Extraverted Intuition',
            'Si': 'Introverted Sensing',
            'Se': 'Extraverted Sensing',
            'Ti': 'Introverted Thinking',
            'Te': 'Extraverted Thinking',
            'Fi': 'Introverted Feeling',
            'Fe': 'Extraverted Feeling'
        }
        return function_names.get(function, function)
    
    def _get_function_description(self, function: str, role: str) -> str:
        """Get description for cognitive function in specific role"""
        # Simplified - would be much more detailed in production
        descriptions = {
            'Ni': "Sees patterns and future implications, building internal models of how things work",
            'Ne': "Explores possibilities and connections, generating new ideas and perspectives",
            'Si': "Recalls past experiences and compares to present, maintaining traditions",
            'Se': "Engages with immediate environment, seeking sensory experiences",
            'Ti': "Analyzes and categorizes information, building logical frameworks",
            'Te': "Organizes external world efficiently, focusing on objective metrics",
            'Fi': "Evaluates based on personal values, maintaining authenticity",
            'Fe': "Harmonizes with others' emotions, creating group cohesion"
        }
        
        return descriptions.get(function, "Processes information in a unique way")
    
    def _explain_type_dynamics(self, mbti_type: str) -> str:
        """Explain how the type functions dynamically"""
        return f"""Your {mbti_type} type creates a dynamic interplay between your cognitive functions. 
        Your dominant function leads the way, while your auxiliary provides balance. Under stress, 
        you may over-rely on your dominant function or fall into the grip of your inferior function."""
    
    def _generate_uniqueness_section(self, profile: Dict) -> Dict:
        """Generate section on what makes this person unique"""
        uniqueness_data = profile.get('uniqueness', {})
        trait_interactions = profile.get('trait_interactions', [])
        
        content = "Your personality profile reveals several statistically unusual characteristics:\n\n"
        
        # Extreme scores
        if uniqueness_data.get('extreme_scores'):
            content += "**Exceptional Trait Levels:**\n"
            for extreme in uniqueness_data['extreme_scores']:
                content += f"• {extreme['trait']}: {extreme['description']}\n"
            content += "\n"
        
        # Rare combinations
        if uniqueness_data.get('rare_combinations'):
            content += "**Rare Trait Combinations:**\n"
            for combo in uniqueness_data['rare_combinations']:
                content += f"• {combo['combination']}: {combo['description']}\n"
            content += "\n"
        
        # Paradoxical patterns
        if uniqueness_data.get('paradoxical_patterns'):
            content += "**Paradoxical Patterns:**\n"
            for pattern in uniqueness_data['paradoxical_patterns']:
                content += f"• {pattern['pattern']}: {pattern['description']}\n"
        
        return {
            'title': 'What Makes You Unique',
            'type': 'uniqueness',
            'content': content,
            'uniqueness_score': uniqueness_data.get('uniqueness_score', 0),
            'visual_type': 'uniqueness_chart',
            'visual_data': uniqueness_data
        }
    
    def _generate_trait_interaction_insights(self, profile: Dict) -> Dict:
        """Generate insights about trait interactions"""
        interactions = profile.get('trait_interactions', [])
        scores = profile['big_five']['scores']
        
        content = "Your personality traits don't exist in isolation - they interact in complex ways:\n\n"
        
        # Find matching interaction patterns
        for rule in self.interaction_rules:
            if self._check_interaction_conditions(scores, rule['conditions']):
                content += f"**{rule['name']}**\n"
                content += rule['narrative'].format(**{k.lower() + '_score': v for k, v in scores.items()})
                content += "\n\n"
                
                if rule.get('behavioral_examples'):
                    content += "This pattern typically manifests as:\n"
                    for example in rule['behavioral_examples']:
                        content += f"• {example}\n"
                    content += "\n"
                
                if rule.get('growth_suggestions'):
                    content += "Growth suggestions for this pattern:\n"
                    for suggestion in rule['growth_suggestions']:
                        content += f"• {suggestion}\n"
                    content += "\n"
        
        return {
            'title': 'How Your Traits Interact',
            'type': 'trait_interactions',
            'content': content,
            'identified_patterns': [rule['name'] for rule in self.interaction_rules 
                                  if self._check_interaction_conditions(scores, rule['conditions'])]
        }
    
    def _check_interaction_conditions(self, scores: Dict[str, float], conditions: Dict) -> bool:
        """Check if scores meet interaction conditions"""
        for trait, condition in conditions.items():
            trait_score = scores.get(trait.capitalize(), 0)
            
            if 'min' in condition and trait_score < condition['min']:
                return False
            if 'max' in condition and trait_score > condition['max']:
                return False
        
        return True
    
    def _generate_personalized_growth_plan(self, profile: Dict) -> Dict:
        """Generate personalized growth recommendations"""
        scores = profile['big_five']['scores']
        mbti_type = profile['mbti']['primary_type']
        
        growth_areas = []
        
        # Type-specific growth
        growth_areas.append({
            'area': 'Cognitive Development',
            'description': f'As an {mbti_type}, focus on developing your tertiary and inferior functions',
            'actions': [
                f'Practice activities that engage your less-developed functions',
                f'Seek feedback on blind spots related to your type'
            ]
        })
        
        # Trait-specific growth
        for trait, score in scores.items():
            if score > 80:
                growth_areas.append({
                    'area': f'Managing High {trait}',
                    'description': f'Your exceptional {trait} is a strength, but may need boundaries',
                    'actions': self._get_high_trait_management_tips(trait)
                })
            elif score < 20:
                growth_areas.append({
                    'area': f'Developing {trait}',
                    'description': f'Small increases in {trait} could open new opportunities',
                    'actions': self._get_low_trait_development_tips(trait)
                })
        
        # Interaction-based growth
        if profile.get('trait_interactions'):
            for interaction in profile['trait_interactions'][:2]:  # Top 2 patterns
                growth_areas.append({
                    'area': f'Optimizing {interaction["name"]}',
                    'description': 'This trait pattern creates unique opportunities and challenges',
                    'actions': ['See trait interaction section for specific suggestions']
                })
        
        return {
            'title': 'Your Personalized Growth Blueprint',
            'type': 'growth_plan',
            'growth_areas': growth_areas,
            'implementation_tips': [
                'Focus on one growth area at a time for sustainable change',
                'Track progress through behavior, not just feelings',
                'Celebrate small wins along the way'
            ]
        }
    
    def _get_high_trait_management_tips(self, trait: str) -> List[str]:
        """Get tips for managing very high trait levels"""
        tips = {
            'Openness': [
                'Channel creativity into concrete projects with deadlines',
                'Balance exploration with execution',
                'Find collaborators who complement your vision with practicality'
            ],
            'Conscientiousness': [
                'Build in flexibility to prevent rigidity',
                'Practice "good enough" for low-stakes decisions',
                'Schedule regular breaks and spontaneous time'
            ],
            'Extraversion': [
                'Ensure you have quiet time for reflection',
                'Practice active listening without immediately responding',
                'Be mindful of others\' need for less stimulation'
            ],
            'Agreeableness': [
                'Practice asserting your own needs',
                'Set clear boundaries to prevent burnout',
                'Remember that conflict can be productive'
            ],
            'Neuroticism': [
                'Develop a toolkit of coping strategies',
                'Practice self-compassion during difficult emotions',
                'Use your sensitivity as an early warning system'
            ]
        }
        return tips.get(trait, ['Seek balance while honoring your natural tendencies'])
    
    def _get_low_trait_development_tips(self, trait: str) -> List[str]:
        """Get tips for developing very low trait levels"""
        tips = {
            'Openness': [
                'Try one new experience per month',
                'Read outside your usual genres',
                'Ask "what if" questions in familiar situations'
            ],
            'Conscientiousness': [
                'Use external tools (calendars, reminders) as scaffolding',
                'Start with tiny habits and build gradually',
                'Partner with someone more organized'
            ],
            'Extraversion': [
                'Honor your introversion while building social skills',
                'Practice small social interactions daily',
                'Find one-on-one or small group settings'
            ],
            'Agreeableness': [
                'Practice seeing others\' perspectives without agreeing',
                'Develop selective empathy for important relationships',
                'Remember that care doesn\'t require self-sacrifice'
            ],
            'Neuroticism': [
                'Your stability is a strength - help others with it',
                'Develop emotional vocabulary to connect with others',
                'Practice noticing subtle emotional cues'
            ]
        }
        return tips.get(trait, ['Small steps toward balance can yield big results'])
    
    def _generate_scientific_references(self) -> str:
        """Generate scientific references section"""
        references = "This report is based on decades of personality research:\n\n"
        
        for ref in self.scientific_citations[:5]:  # Top 5 references
            references += f"• {ref['citation']}\n"
        
        references += "\nFor full references and methodology, visit our scientific validity page."
        
        return references