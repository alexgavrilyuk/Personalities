import numpy as np
from typing import List, Dict, Tuple, Optional
from collections import Counter
import itertools

class TeamInsightsGenerator:
    """Generate insights for team personality comparisons"""
    
    def generate(self, team_profiles: List[Dict]) -> Dict:
        """Generate comprehensive team insights"""
        if not team_profiles:
            return {'error': 'No team members found'}
        
        insights = {
            'team_size': len(team_profiles),
            'team_composition': self.analyze_team_composition(team_profiles),
            'communication_map': self.generate_communication_map(team_profiles),
            'potential_conflicts': self.identify_potential_conflicts(team_profiles),
            'team_strengths': self.identify_collective_strengths(team_profiles),
            'blind_spots': self.identify_team_blind_spots(team_profiles),
            'collaboration_suggestions': self.generate_collaboration_tips(team_profiles),
            'team_dynamics': self.analyze_team_dynamics(team_profiles),
            'leadership_analysis': self.analyze_leadership_potential(team_profiles)
        }
        
        return insights
    
    def analyze_team_composition(self, profiles: List[Dict]) -> Dict:
        """Analyze overall team makeup"""
        composition = {
            'balance_score': 0.0,
            'diversity_score': 0.0,
            'type_distribution': {},
            'trait_averages': {},
            'trait_ranges': {},
            'missing_perspectives': [],
            'dominant_traits': [],
            'team_profile': ''
        }
        
        # Calculate trait statistics
        trait_data = {trait: [] for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']}
        
        for profile in profiles:
            for trait in trait_data:
                score = profile['big_five']['scores'].get(trait, 50)
                trait_data[trait].append(score)
        
        # Calculate averages and ranges
        for trait, scores in trait_data.items():
            composition['trait_averages'][trait] = round(np.mean(scores), 1)
            composition['trait_ranges'][trait] = {
                'min': round(min(scores), 1),
                'max': round(max(scores), 1),
                'std_dev': round(np.std(scores), 1)
            }
        
        # Calculate diversity score (higher std dev = more diverse)
        diversity_scores = [data['std_dev'] for data in composition['trait_ranges'].values()]
        composition['diversity_score'] = round(np.mean(diversity_scores) / 30 * 100, 1)  # Normalize to 0-100
        
        # Calculate balance score (how well distributed across all traits)
        trait_coverage = []
        for trait, avg in composition['trait_averages'].items():
            if avg > 60:
                trait_coverage.append('high')
            elif avg < 40:
                trait_coverage.append('low')
            else:
                trait_coverage.append('moderate')
        
        # Perfect balance would have mix of high, moderate, and low
        balance_distribution = Counter(trait_coverage)
        if len(balance_distribution) == 3:
            composition['balance_score'] = 100.0
        elif len(balance_distribution) == 2:
            composition['balance_score'] = 66.7
        else:
            composition['balance_score'] = 33.3
        
        # Identify missing perspectives
        self._identify_missing_perspectives(composition)
        
        # Identify dominant traits
        for trait, avg in composition['trait_averages'].items():
            if avg > 65:
                composition['dominant_traits'].append({
                    'trait': trait,
                    'strength': 'very_high',
                    'description': f"Your team is exceptionally high in {trait}"
                })
            elif avg < 35:
                composition['dominant_traits'].append({
                    'trait': trait,
                    'strength': 'very_low',
                    'description': f"Your team is notably low in {trait}"
                })
        
        # MBTI type distribution
        type_counts = Counter([p['mbti']['primary_type'] for p in profiles])
        composition['type_distribution'] = dict(type_counts)
        
        # Determine overall team profile
        composition['team_profile'] = self._determine_team_profile(composition)
        
        return composition
    
    def _identify_missing_perspectives(self, composition: Dict) -> None:
        """Identify what perspectives might be missing from the team"""
        avg = composition['trait_averages']
        
        if avg['Conscientiousness'] < 40:
            composition['missing_perspectives'].append({
                'trait': 'Conscientiousness',
                'impact': 'Team may struggle with follow-through, organization, and meeting deadlines',
                'suggestion': 'Implement external project management tools or consider adding detail-oriented members'
            })
        
        if avg['Openness'] < 40:
            composition['missing_perspectives'].append({
                'trait': 'Openness',
                'impact': 'Team may resist new ideas and struggle with innovation',
                'suggestion': 'Schedule regular brainstorming sessions and invite external perspectives'
            })
        
        if avg['Extraversion'] < 35 or avg['Extraversion'] > 65:
            if avg['Extraversion'] < 35:
                composition['missing_perspectives'].append({
                    'trait': 'Extraversion',
                    'impact': 'Team may struggle with networking, presentations, and external communication',
                    'suggestion': 'Designate extraverted allies for external-facing activities'
                })
            else:
                composition['missing_perspectives'].append({
                    'trait': 'Introversion',
                    'impact': 'Team may lack deep focus time and reflective thinking',
                    'suggestion': 'Build in quiet work time and written communication channels'
                })
        
        if avg['Agreeableness'] < 35:
            composition['missing_perspectives'].append({
                'trait': 'Agreeableness',
                'impact': 'Team may experience more conflict and struggle with harmony',
                'suggestion': 'Establish clear conflict resolution processes and empathy practices'
            })
        
        if avg['Neuroticism'] > 65:
            composition['missing_perspectives'].append({
                'trait': 'Emotional Stability',
                'impact': 'Team may experience high stress and emotional volatility',
                'suggestion': 'Implement stress management practices and clear communication protocols'
            })
    
    def _determine_team_profile(self, composition: Dict) -> str:
        """Determine overall team profile based on traits"""
        avg = composition['trait_averages']
        
        # Check for specific team patterns
        if avg['Openness'] > 60 and avg['Conscientiousness'] < 40:
            return "Creative Innovators - High on ideas, may need execution support"
        elif avg['Conscientiousness'] > 60 and avg['Agreeableness'] > 60:
            return "Reliable Collaborators - Dependable and harmonious"
        elif avg['Extraversion'] > 60 and avg['Openness'] > 60:
            return "Dynamic Explorers - Energetic and innovative"
        elif avg['Conscientiousness'] > 60 and avg['Neuroticism'] < 40:
            return "Steady Achievers - Reliable and emotionally stable"
        elif composition['diversity_score'] > 70:
            return "Diverse Perspectives - Wide range of personalities"
        else:
            return "Balanced Team - Moderate across most dimensions"
    
    def generate_communication_map(self, profiles: List[Dict]) -> List[Dict]:
        """Generate pairwise communication tips"""
        communication_map = []
        
        for i, profile1 in enumerate(profiles):
            for j, profile2 in enumerate(profiles):
                if i >= j:  # Skip self and duplicates
                    continue
                
                tips = self.generate_pairwise_communication_tips(profile1, profile2)
                
                communication_map.append({
                    'from_user': profile1.get('user_name', f'Member {i+1}'),
                    'from_type': profile1['mbti']['primary_type'],
                    'to_user': profile2.get('user_name', f'Member {j+1}'),
                    'to_type': profile2['mbti']['primary_type'],
                    'tips': tips,
                    'compatibility_score': self._calculate_compatibility(profile1, profile2)
                })
        
        return communication_map
    
    def generate_pairwise_communication_tips(self, profile1: Dict, profile2: Dict) -> List[str]:
        """Generate specific communication tips between two people"""
        tips = []
        
        p1_scores = profile1['big_five']['scores']
        p2_scores = profile2['big_five']['scores']
        
        # Extraversion differences
        e_diff = abs(p1_scores['Extraversion'] - p2_scores['Extraversion'])
        if e_diff > 40:
            if p1_scores['Extraversion'] > p2_scores['Extraversion']:
                tips.append(f"Give them time to process before expecting responses")
                tips.append(f"Consider written communication for complex topics")
            else:
                tips.append(f"Be prepared for more energetic, verbal communication")
                tips.append(f"Don't mistake enthusiasm for aggression")
        
        # Agreeableness differences
        a_diff = abs(p1_scores['Agreeableness'] - p2_scores['Agreeableness'])
        if a_diff > 40:
            if p1_scores['Agreeableness'] > p2_scores['Agreeableness']:
                tips.append(f"Be direct and logical in your communication")
                tips.append(f"Focus on facts over feelings when making arguments")
            else:
                tips.append(f"Show appreciation and acknowledge their contributions")
                tips.append(f"Use collaborative language ('we' instead of 'you')")
        
        # Conscientiousness differences
        c_diff = abs(p1_scores['Conscientiousness'] - p2_scores['Conscientiousness'])
        if c_diff > 40:
            if p1_scores['Conscientiousness'] > p2_scores['Conscientiousness']:
                tips.append(f"Be flexible with deadlines and processes")
                tips.append(f"Focus on outcomes rather than methods")
            else:
                tips.append(f"Provide clear timelines and expectations")
                tips.append(f"Follow through on commitments consistently")
        
        # Openness differences
        o_diff = abs(p1_scores['Openness'] - p2_scores['Openness'])
        if o_diff > 40:
            if p1_scores['Openness'] > p2_scores['Openness']:
                tips.append(f"Ground abstract ideas in practical examples")
                tips.append(f"Respect their preference for proven methods")
            else:
                tips.append(f"Be open to brainstorming and 'what if' discussions")
                tips.append(f"Don't dismiss ideas as impractical too quickly")
        
        # Type-based tips
        type1 = profile1['mbti']['primary_type']
        type2 = profile2['mbti']['primary_type']
        
        # Thinking vs Feeling
        if 'T' in type1 and 'F' in type2:
            tips.append(f"Acknowledge the personal impact of decisions")
        elif 'F' in type1 and 'T' in type2:
            tips.append(f"Present logical reasoning for your positions")
        
        # Judging vs Perceiving
        if 'J' in type1 and 'P' in type2:
            tips.append(f"Allow for flexibility in plans and schedules")
        elif 'P' in type1 and 'J' in type2:
            tips.append(f"Respect their need for closure and decisions")
        
        return tips[:5]  # Return top 5 most relevant tips
    
    def _calculate_compatibility(self, profile1: Dict, profile2: Dict) -> float:
        """Calculate compatibility score between two profiles"""
        p1_scores = profile1['big_five']['scores']
        p2_scores = profile2['big_five']['scores']
        
        # Start with base compatibility
        compatibility = 70.0
        
        # Similar Agreeableness helps
        a_diff = abs(p1_scores['Agreeableness'] - p2_scores['Agreeableness'])
        if a_diff < 20:
            compatibility += 10
        elif a_diff > 40:
            compatibility -= 10
        
        # Complementary Conscientiousness can work well
        c_diff = abs(p1_scores['Conscientiousness'] - p2_scores['Conscientiousness'])
        if 20 < c_diff < 40:  # Some difference is good
            compatibility += 5
        
        # Very different Neuroticism can be challenging
        n_diff = abs(p1_scores['Neuroticism'] - p2_scores['Neuroticism'])
        if n_diff > 50:
            compatibility -= 15
        
        # Extreme differences in Extraversion need work
        e_diff = abs(p1_scores['Extraversion'] - p2_scores['Extraversion'])
        if e_diff > 60:
            compatibility -= 10
        elif e_diff < 30:
            compatibility += 5
        
        return round(max(0, min(100, compatibility)), 1)
    
    def identify_potential_conflicts(self, profiles: List[Dict]) -> List[Dict]:
        """Identify potential sources of team conflict"""
        conflicts = []
        
        # Check for extreme personality differences
        for i, profile1 in enumerate(profiles):
            for j, profile2 in enumerate(profiles[i+1:], i+1):
                conflict_areas = self._check_conflict_areas(profile1, profile2)
                
                if conflict_areas:
                    conflicts.append({
                        'members': [
                            profile1.get('user_name', f'Member {i+1}'),
                            profile2.get('user_name', f'Member {j+1}')
                        ],
                        'areas': conflict_areas,
                        'severity': self._calculate_conflict_severity(conflict_areas),
                        'mitigation': self._suggest_conflict_mitigation(conflict_areas)
                    })
        
        # Check for team-wide issues
        team_conflicts = self._identify_team_wide_conflicts(profiles)
        conflicts.extend(team_conflicts)
        
        # Sort by severity
        conflicts.sort(key=lambda x: x['severity'], reverse=True)
        
        return conflicts[:5]  # Return top 5 potential conflicts
    
    def _check_conflict_areas(self, profile1: Dict, profile2: Dict) -> List[Dict]:
        """Check for specific conflict areas between two profiles"""
        conflicts = []
        
        p1 = profile1['big_five']['scores']
        p2 = profile2['big_five']['scores']
        
        # Work style conflicts
        if abs(p1['Conscientiousness'] - p2['Conscientiousness']) > 50:
            conflicts.append({
                'type': 'work_style',
                'description': 'Drastically different approaches to organization and deadlines'
            })
        
        # Communication conflicts
        if abs(p1['Extraversion'] - p2['Extraversion']) > 60:
            conflicts.append({
                'type': 'communication_style',
                'description': 'Very different communication preferences and energy levels'
            })
        
        # Decision-making conflicts
        if abs(p1['Agreeableness'] - p2['Agreeableness']) > 50:
            conflicts.append({
                'type': 'decision_making',
                'description': 'Different priorities between harmony and directness'
            })
        
        # Stress response conflicts
        if abs(p1['Neuroticism'] - p2['Neuroticism']) > 50:
            conflicts.append({
                'type': 'stress_response',
                'description': 'Very different emotional reactions to pressure'
            })
        
        return conflicts
    
    def _calculate_conflict_severity(self, conflict_areas: List[Dict]) -> float:
        """Calculate severity of potential conflicts"""
        base_severity = len(conflict_areas) * 20
        
        # Some conflicts are more severe
        for conflict in conflict_areas:
            if conflict['type'] == 'work_style':
                base_severity += 10
            elif conflict['type'] == 'stress_response':
                base_severity += 15
        
        return min(100, base_severity)
    
    def _suggest_conflict_mitigation(self, conflict_areas: List[Dict]) -> List[str]:
        """Suggest ways to mitigate conflicts"""
        suggestions = []
        
        conflict_types = [c['type'] for c in conflict_areas]
        
        if 'work_style' in conflict_types:
            suggestions.append('Establish clear project roles and responsibilities')
            suggestions.append('Use project management tools to track progress')
        
        if 'communication_style' in conflict_types:
            suggestions.append('Use multiple communication channels (written and verbal)')
            suggestions.append('Schedule regular check-ins with clear agendas')
        
        if 'decision_making' in conflict_types:
            suggestions.append('Create decision-making frameworks that balance all perspectives')
            suggestions.append('Rotate who leads different types of decisions')
        
        if 'stress_response' in conflict_types:
            suggestions.append('Develop team stress signals and support protocols')
            suggestions.append('Build in buffer time for high-pressure projects')
        
        return suggestions[:3]
    
    def _identify_team_wide_conflicts(self, profiles: List[Dict]) -> List[Dict]:
        """Identify conflicts that affect the whole team"""
        conflicts = []
        
        # Calculate team-wide metrics
        all_scores = {trait: [] for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']}
        
        for profile in profiles:
            for trait in all_scores:
                all_scores[trait].append(profile['big_five']['scores'][trait])
        
        # Check for lack of diversity (everyone too similar)
        for trait, scores in all_scores.items():
            std_dev = np.std(scores)
            if std_dev < 10:
                conflicts.append({
                    'members': ['Entire team'],
                    'areas': [{
                        'type': 'lack_of_diversity',
                        'description': f'Team lacks diversity in {trait} (SD={std_dev:.1f})'
                    }],
                    'severity': 40,
                    'mitigation': [
                        f'Actively seek different perspectives on {trait}-related decisions',
                        'Consider bringing in external viewpoints',
                        'Practice devil\'s advocate exercises'
                    ]
                })
        
        # Check for extreme team averages
        team_avg = {trait: np.mean(scores) for trait, scores in all_scores.items()}
        
        if team_avg['Agreeableness'] < 35:
            conflicts.append({
                'members': ['Entire team'],
                'areas': [{
                    'type': 'low_agreeableness',
                    'description': 'Team average Agreeableness is very low, risk of excessive conflict'
                }],
                'severity': 60,
                'mitigation': [
                    'Establish clear team values and conflict resolution processes',
                    'Practice active listening and empathy exercises',
                    'Celebrate collaborative wins'
                ]
            })
        
        return conflicts
    
    def identify_collective_strengths(self, profiles: List[Dict]) -> List[Dict]:
        """Identify team's collective strengths"""
        strengths = []
        
        # Calculate team averages
        team_traits = {trait: [] for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']}
        
        for profile in profiles:
            for trait in team_traits:
                team_traits[trait].append(profile['big_five']['scores'][trait])
        
        team_avg = {trait: np.mean(scores) for trait, scores in team_traits.items()}
        
        # High trait strengths
        if team_avg['Openness'] > 65:
            strengths.append({
                'strength': 'Innovation and Creativity',
                'description': 'Your team excels at generating new ideas and thinking outside the box',
                'leverage': 'Take on projects requiring innovation and creative problem-solving'
            })
        
        if team_avg['Conscientiousness'] > 65:
            strengths.append({
                'strength': 'Reliability and Execution',
                'description': 'Your team delivers consistent, high-quality results on time',
                'leverage': 'Handle complex projects requiring attention to detail'
            })
        
        if team_avg['Extraversion'] > 65:
            strengths.append({
                'strength': 'Dynamic Collaboration',
                'description': 'Your team thrives in interactive, high-energy environments',
                'leverage': 'Excel in client-facing roles and collaborative projects'
            })
        
        if team_avg['Agreeableness'] > 65:
            strengths.append({
                'strength': 'Harmonious Cooperation',
                'description': 'Your team works together smoothly with minimal conflict',
                'leverage': 'Build strong partnerships and manage sensitive stakeholder relationships'
            })
        
        if team_avg['Neuroticism'] < 35:
            strengths.append({
                'strength': 'Emotional Stability',
                'description': 'Your team remains calm and effective under pressure',
                'leverage': 'Take on high-stakes projects and crisis management'
            })
        
        # Diversity as strength
        diversity_score = np.mean([np.std(scores) for scores in team_traits.values()])
        if diversity_score > 20:
            strengths.append({
                'strength': 'Diverse Perspectives',
                'description': 'Your team brings varied viewpoints and approaches to problems',
                'leverage': 'Tackle complex, multifaceted challenges requiring different angles'
            })
        
        # Type diversity
        type_variety = len(set([p['mbti']['primary_type'] for p in profiles]))
        if type_variety >= len(profiles) * 0.7:
            strengths.append({
                'strength': 'Cognitive Diversity',
                'description': 'Your team processes information in complementary ways',
                'leverage': 'Ensure thorough analysis by leveraging different thinking styles'
            })
        
        return strengths[:5]  # Top 5 strengths
    
    def identify_team_blind_spots(self, profiles: List[Dict]) -> List[Dict]:
        """Identify team's collective blind spots"""
        blind_spots = []
        
        # Get team averages
        team_traits = {trait: [] for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']}
        
        for profile in profiles:
            for trait in team_traits:
                team_traits[trait].append(profile['big_five']['scores'][trait])
        
        team_avg = {trait: np.mean(scores) for trait, scores in team_traits.items()}
        team_std = {trait: np.std(scores) for trait, scores in team_traits.items()}
        
        # Low trait blind spots
        if team_avg['Openness'] < 35:
            blind_spots.append({
                'blind_spot': 'Resistance to Innovation',
                'description': 'Team may miss opportunities for creative solutions',
                'impact': 'Risk of being disrupted by more innovative competitors',
                'mitigation': 'Schedule regular "innovation days" and invite external speakers'
            })
        
        if team_avg['Conscientiousness'] < 35:
            blind_spots.append({
                'blind_spot': 'Execution Challenges',
                'description': 'Team may struggle with follow-through and details',
                'impact': 'Projects may stall or miss important requirements',
                'mitigation': 'Implement rigorous project management and accountability systems'
            })
        
        if team_avg['Extraversion'] < 30 or team_avg['Extraversion'] > 70:
            if team_avg['Extraversion'] < 30:
                blind_spots.append({
                    'blind_spot': 'Limited External Engagement',
                    'description': 'Team may miss networking and collaboration opportunities',
                    'impact': 'Reduced visibility and fewer external partnerships',
                    'mitigation': 'Assign "ambassador" roles for external engagement'
                })
            else:
                blind_spots.append({
                    'blind_spot': 'Insufficient Deep Work Time',
                    'description': 'Constant interaction may prevent deep thinking',
                    'impact': 'Surface-level solutions to complex problems',
                    'mitigation': 'Schedule protected quiet time for focused work'
                })
        
        if team_avg['Agreeableness'] > 75:
            blind_spots.append({
                'blind_spot': 'Conflict Avoidance',
                'description': 'Team may avoid necessary disagreements',
                'impact': 'Important issues go unaddressed, groupthink risk',
                'mitigation': 'Practice structured debate and devil\'s advocate roles'
            })
        
        if team_avg['Neuroticism'] > 65:
            blind_spots.append({
                'blind_spot': 'Stress Amplification',
                'description': 'Team may create anxiety feedback loops',
                'impact': 'Decreased performance under pressure',
                'mitigation': 'Develop team stress management protocols and celebrate wins'
            })
        
        # Check for homogeneity
        low_diversity_traits = [trait for trait, std in team_std.items() if std < 15]
        if len(low_diversity_traits) >= 3:
            blind_spots.append({
                'blind_spot': 'Homogeneous Thinking',
                'description': f'Team lacks diversity in {", ".join(low_diversity_traits)}',
                'impact': 'May miss important perspectives and solutions',
                'mitigation': 'Actively seek contrarian views and diverse input'
            })
        
        return blind_spots[:5]  # Top 5 blind spots
    
    def generate_collaboration_tips(self, profiles: List[Dict]) -> List[Dict]:
        """Generate specific collaboration suggestions"""
        tips = []
        
        # Analyze team composition
        team_avg = self._calculate_team_averages(profiles)
        team_std = self._calculate_team_std(profiles)
        types = [p['mbti']['primary_type'] for p in profiles]
        
        # Meeting structure tips
        if team_avg['Extraversion'] > 60:
            tips.append({
                'category': 'Meeting Structure',
                'tip': 'Use active, discussion-based meetings with breakout sessions',
                'reason': 'Your team\'s high extraversion thrives on interaction'
            })
        elif team_avg['Extraversion'] < 40:
            tips.append({
                'category': 'Meeting Structure',
                'tip': 'Send agendas in advance and allow written input options',
                'reason': 'Your team\'s introversion benefits from preparation time'
            })
        else:
            tips.append({
                'category': 'Meeting Structure',
                'tip': 'Balance discussion with quiet reflection time',
                'reason': 'Your team has mixed extraversion levels'
            })
        
        # Decision-making tips
        if team_avg['Agreeableness'] > 65:
            tips.append({
                'category': 'Decision Making',
                'tip': 'Use anonymous voting for contentious decisions',
                'reason': 'High agreeableness may lead to conformity pressure'
            })
        
        t_count = sum(1 for t in types if 'T' in t)
        f_count = sum(1 for t in types if 'F' in t)
        if abs(t_count - f_count) <= 1:
            tips.append({
                'category': 'Decision Making',
                'tip': 'Balance logical analysis with impact on people',
                'reason': 'Your team has equal Thinking and Feeling preferences'
            })
        
        # Communication tips
        if team_std['Conscientiousness'] > 25:
            tips.append({
                'category': 'Communication',
                'tip': 'Establish clear expectations about deadlines and detail levels',
                'reason': 'Team has very different organizational preferences'
            })
        
        # Work allocation tips
        if team_std['Openness'] > 25:
            tips.append({
                'category': 'Work Allocation',
                'tip': 'Match tasks to comfort with ambiguity - innovators on new projects, others on refinement',
                'reason': 'Team has diverse openness levels'
            })
        
        # Conflict resolution tips
        if team_avg['Neuroticism'] > 55 or team_std['Neuroticism'] > 25:
            tips.append({
                'category': 'Conflict Resolution',
                'tip': 'Address conflicts quickly with structured, calm discussions',
                'reason': 'Team has heightened emotional sensitivity'
            })
        
        # Innovation tips
        if team_avg['Openness'] < 45:
            tips.append({
                'category': 'Innovation',
                'tip': 'Use structured innovation methods like SCAMPER or Design Thinking',
                'reason': 'Team prefers concrete approaches over abstract brainstorming'
            })
        
        return tips[:7]  # Return top 7 tips
    
    def analyze_team_dynamics(self, profiles: List[Dict]) -> Dict:
        """Analyze overall team dynamics"""
        dynamics = {
            'energy_flow': self._analyze_energy_flow(profiles),
            'decision_style': self._analyze_decision_style(profiles),
            'work_pace': self._analyze_work_pace(profiles),
            'innovation_potential': self._analyze_innovation_potential(profiles),
            'stability_index': self._analyze_stability(profiles)
        }
        
        return dynamics
    
    def _analyze_energy_flow(self, profiles: List[Dict]) -> Dict:
        """Analyze how energy flows in the team"""
        extraversion_scores = [p['big_five']['scores']['Extraversion'] for p in profiles]
        avg_e = np.mean(extraversion_scores)
        std_e = np.std(extraversion_scores)
        
        if avg_e > 60:
            flow_type = 'High Energy Collaborative'
            description = 'Team generates energy through interaction and collaboration'
        elif avg_e < 40:
            flow_type = 'Focused Independent'
            description = 'Team works best with independent tasks and minimal interruption'
        else:
            flow_type = 'Balanced Flow'
            description = 'Team can adapt between collaborative and independent work'
        
        return {
            'type': flow_type,
            'description': description,
            'variability': 'high' if std_e > 25 else 'low',
            'recommendation': self._get_energy_recommendation(avg_e, std_e)
        }
    
    def _get_energy_recommendation(self, avg: float, std: float) -> str:
        """Get recommendation based on energy analysis"""
        if std > 25:
            return 'Create both collaborative and quiet zones to accommodate different energy needs'
        elif avg > 60:
            return 'Build in recovery time between high-energy sessions'
        elif avg < 40:
            return 'Use asynchronous communication for complex discussions'
        else:
            return 'Current balance works well - maintain flexible work options'
    
    def _analyze_decision_style(self, profiles: List[Dict]) -> Dict:
        """Analyze team's decision-making style"""
        types = [p['mbti']['primary_type'] for p in profiles]
        
        t_count = sum(1 for t in types if 'T' in t)
        f_count = sum(1 for t in types if 'F' in t)
        j_count = sum(1 for t in types if 'J' in t)
        p_count = sum(1 for t in types if 'P' in t)
        
        # Determine primary style
        if t_count > f_count * 1.5:
            thinking_style = 'Logic-driven'
        elif f_count > t_count * 1.5:
            thinking_style = 'Values-driven'
        else:
            thinking_style = 'Balanced'
        
        if j_count > p_count * 1.5:
            closure_style = 'Quick closure'
        elif p_count > j_count * 1.5:
            closure_style = 'Exploratory'
        else:
            closure_style = 'Flexible'
        
        return {
            'thinking_style': thinking_style,
            'closure_style': closure_style,
            'description': f'{thinking_style} decisions with {closure_style.lower()} approach',
            'strengths': self._get_decision_strengths(thinking_style, closure_style),
            'watch_outs': self._get_decision_watch_outs(thinking_style, closure_style)
        }
    
    def _get_decision_strengths(self, thinking: str, closure: str) -> List[str]:
        """Get decision-making strengths"""
        strengths = []
        
        if thinking == 'Logic-driven':
            strengths.append('Objective, data-based decisions')
        elif thinking == 'Values-driven':
            strengths.append('Considers human impact thoroughly')
        else:
            strengths.append('Balances logic and values effectively')
        
        if closure == 'Quick closure':
            strengths.append('Decisive and action-oriented')
        elif closure == 'Exploratory':
            strengths.append('Thorough exploration of options')
        else:
            strengths.append('Adapts decision speed to situation')
        
        return strengths
    
    def _get_decision_watch_outs(self, thinking: str, closure: str) -> List[str]:
        """Get decision-making watch-outs"""
        watch_outs = []
        
        if thinking == 'Logic-driven':
            watch_outs.append('May overlook emotional impacts')
        elif thinking == 'Values-driven':
            watch_outs.append('May struggle with tough personnel decisions')
        
        if closure == 'Quick closure':
            watch_outs.append('Risk of premature decisions')
        elif closure == 'Exploratory':
            watch_outs.append('May delay necessary decisions')
        
        return watch_outs
    
    def _analyze_work_pace(self, profiles: List[Dict]) -> Dict:
        """Analyze team's work pace preferences"""
        conscientiousness = [p['big_five']['scores']['Conscientiousness'] for p in profiles]
        openness = [p['big_five']['scores']['Openness'] for p in profiles]
        
        avg_c = np.mean(conscientiousness)
        avg_o = np.mean(openness)
        
        if avg_c > 65:
            pace = 'Steady and Methodical'
            description = 'Team prefers structured progress with clear milestones'
        elif avg_c < 35:
            pace = 'Flexible and Adaptive'
            description = 'Team works in bursts and adapts to changing priorities'
        else:
            pace = 'Moderate and Balanced'
            description = 'Team can work both structured and flexibly as needed'
        
        return {
            'pace': pace,
            'description': description,
            'optimal_project_length': self._get_optimal_project_length(avg_c, avg_o),
            'scheduling_tips': self._get_scheduling_tips(avg_c)
        }
    
    def _get_optimal_project_length(self, conscientiousness: float, openness: float) -> str:
        """Determine optimal project length for team"""
        if conscientiousness > 60 and openness < 40:
            return 'Long-term projects with clear phases'
        elif conscientiousness < 40 and openness > 60:
            return 'Short sprints with room for pivoting'
        else:
            return 'Medium-term projects with flexibility'
    
    def _get_scheduling_tips(self, conscientiousness: float) -> List[str]:
        """Get scheduling tips based on conscientiousness"""
        if conscientiousness > 65:
            return [
                'Set clear deadlines well in advance',
                'Break large projects into detailed milestones',
                'Allow buffer time for quality control'
            ]
        elif conscientiousness < 35:
            return [
                'Use flexible deadlines where possible',
                'Build in time for exploration and iteration',
                'Focus on outcomes over process'
            ]
        else:
            return [
                'Balance structure with flexibility',
                'Set firm deadlines for critical items only',
                'Allow team to self-organize within boundaries'
            ]
    
    def _analyze_innovation_potential(self, profiles: List[Dict]) -> Dict:
        """Analyze team's innovation potential"""
        openness = [p['big_five']['scores']['Openness'] for p in profiles]
        neuroticism = [p['big_five']['scores']['Neuroticism'] for p in profiles]
        
        avg_o = np.mean(openness)
        std_o = np.std(openness)
        avg_n = np.mean(neuroticism)
        
        # Calculate innovation score
        innovation_score = avg_o * 0.7 + (100 - avg_n) * 0.3
        
        if innovation_score > 70:
            potential = 'High Innovation Potential'
            description = 'Team naturally generates and embraces new ideas'
        elif innovation_score < 40:
            potential = 'Incremental Innovation'
            description = 'Team excels at refining and improving existing solutions'
        else:
            potential = 'Moderate Innovation'
            description = 'Team can innovate when needed but prefers proven methods'
        
        return {
            'potential': potential,
            'score': round(innovation_score, 1),
            'description': description,
            'enablers': self._get_innovation_enablers(avg_o, std_o),
            'barriers': self._get_innovation_barriers(avg_o, avg_n)
        }
    
    def _get_innovation_enablers(self, openness: float, openness_std: float) -> List[str]:
        """Identify innovation enablers"""
        enablers = []
        
        if openness > 60:
            enablers.append('Natural curiosity and idea generation')
        if openness_std > 20:
            enablers.append('Diverse perspectives on problems')
        if openness > 40:
            enablers.append('Willingness to try new approaches')
        
        return enablers
    
    def _get_innovation_barriers(self, openness: float, neuroticism: float) -> List[str]:
        """Identify innovation barriers"""
        barriers = []
        
        if openness < 40:
            barriers.append('Preference for proven methods')
        if neuroticism > 65:
            barriers.append('Risk aversion due to anxiety')
        if openness < 50 and neuroticism > 50:
            barriers.append('Discomfort with uncertainty')
        
        return barriers
    
    def _analyze_stability(self, profiles: List[Dict]) -> Dict:
        """Analyze team stability and resilience"""
        neuroticism = [p['big_five']['scores']['Neuroticism'] for p in profiles]
        conscientiousness = [p['big_five']['scores']['Conscientiousness'] for p in profiles]
        
        avg_n = np.mean(neuroticism)
        avg_c = np.mean(conscientiousness)
        
        # Calculate stability index
        stability_index = (100 - avg_n) * 0.6 + avg_c * 0.4
        
        if stability_index > 70:
            level = 'High Stability'
            description = 'Team remains steady under pressure'
        elif stability_index < 40:
            level = 'Variable Stability'
            description = 'Team performance fluctuates with stress levels'
        else:
            level = 'Moderate Stability'
            description = 'Team handles normal stress well but may struggle with crises'
        
        return {
            'level': level,
            'index': round(stability_index, 1),
            'description': description,
            'stress_response': self._predict_stress_response(avg_n, avg_c),
            'resilience_factors': self._identify_resilience_factors(profiles)
        }
    
    def _predict_stress_response(self, neuroticism: float, conscientiousness: float) -> str:
        """Predict how team responds to stress"""
        if neuroticism > 65:
            return 'Team may experience heightened anxiety and need extra support during stressful periods'
        elif neuroticism < 35:
            return 'Team remains calm under pressure but may underestimate risks'
        elif conscientiousness > 65:
            return 'Team responds to stress with increased planning and organization'
        else:
            return 'Team shows moderate stress response with some variability between members'
    
    def _identify_resilience_factors(self, profiles: List[Dict]) -> List[str]:
        """Identify factors that contribute to team resilience"""
        factors = []
        
        # Check for resilient individuals
        resilient_count = sum(1 for p in profiles 
                            if p['big_five']['scores']['Neuroticism'] < 40 
                            and p['big_five']['scores']['Conscientiousness'] > 60)
        
        if resilient_count >= len(profiles) * 0.3:
            factors.append(f'{resilient_count} highly resilient team members provide stability')
        
        # Check for diversity as resilience
        trait_stds = []
        for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']:
            scores = [p['big_five']['scores'][trait] for p in profiles]
            trait_stds.append(np.std(scores))
        
        if np.mean(trait_stds) > 20:
            factors.append('Personality diversity provides multiple coping strategies')
        
        # Check for high agreeableness
        avg_agreeableness = np.mean([p['big_five']['scores']['Agreeableness'] for p in profiles])
        if avg_agreeableness > 60:
            factors.append('High team cohesion and mutual support')
        
        return factors
    
    def analyze_leadership_potential(self, profiles: List[Dict]) -> Dict:
        """Analyze leadership dynamics and potential in the team"""
        leadership_analysis = {
            'natural_leaders': [],
            'leadership_styles': [],
            'succession_planning': [],
            'distributed_leadership': self._analyze_distributed_leadership(profiles)
        }
        
        # Identify natural leaders
        for i, profile in enumerate(profiles):
            leadership_score = self._calculate_leadership_potential(profile)
            
            if leadership_score > 70:
                leader_info = {
                    'member': profile.get('user_name', f'Member {i+1}'),
                    'type': profile['mbti']['primary_type'],
                    'leadership_score': leadership_score,
                    'style': self._determine_leadership_style(profile),
                    'strengths': self._identify_leadership_strengths(profile),
                    'development_areas': self._identify_leadership_development(profile)
                }
                leadership_analysis['natural_leaders'].append(leader_info)
        
        # Sort by leadership score
        leadership_analysis['natural_leaders'].sort(key=lambda x: x['leadership_score'], reverse=True)
        
        # Analyze team leadership styles
        all_styles = [leader['style'] for leader in leadership_analysis['natural_leaders']]
        style_distribution = Counter(all_styles)
        
        leadership_analysis['leadership_styles'] = {
            'distribution': dict(style_distribution),
            'primary_style': style_distribution.most_common(1)[0][0] if style_distribution else 'Collaborative',
            'recommendation': self._get_leadership_style_recommendation(style_distribution)
        }
        
        return leadership_analysis
    
    def _calculate_leadership_potential(self, profile: Dict) -> float:
        """Calculate leadership potential score"""
        scores = profile['big_five']['scores']
        mbti_type = profile['mbti']['primary_type']
        
        # Base score
        leadership_score = 50.0
        
        # Extraversion contributes to leadership
        leadership_score += (scores['Extraversion'] - 50) * 0.3
        
        # Conscientiousness important for leadership
        leadership_score += (scores['Conscientiousness'] - 50) * 0.25
        
        # Low neuroticism helps with leadership
        leadership_score += (50 - scores['Neuroticism']) * 0.2
        
        # Moderate agreeableness is optimal
        agreeableness_deviation = abs(scores['Agreeableness'] - 55)
        leadership_score -= agreeableness_deviation * 0.1
        
        # Type bonuses
        if mbti_type in ['ENTJ', 'ESTJ', 'ENFJ', 'INTJ']:
            leadership_score += 10
        elif 'J' in mbti_type:
            leadership_score += 5
        
        return round(max(0, min(100, leadership_score)), 1)
    
    def _determine_leadership_style(self, profile: Dict) -> str:
        """Determine leadership style based on personality"""
        scores = profile['big_five']['scores']
        mbti_type = profile['mbti']['primary_type']
        
        if scores['Extraversion'] > 65 and scores['Agreeableness'] > 65:
            return 'Inspirational'
        elif scores['Conscientiousness'] > 70 and 'T' in mbti_type:
            return 'Strategic'
        elif scores['Agreeableness'] > 70 and 'F' in mbti_type:
            return 'Servant'
        elif scores['Openness'] > 70 and scores['Extraversion'] > 60:
            return 'Visionary'
        elif scores['Conscientiousness'] > 65 and scores['Neuroticism'] < 40:
            return 'Steady'
        else:
            return 'Adaptive'
    
    def _identify_leadership_strengths(self, profile: Dict) -> List[str]:
        """Identify leadership strengths based on personality"""
        strengths = []
        scores = profile['big_five']['scores']
        
        if scores['Extraversion'] > 65:
            strengths.append('Energizes and motivates others')
        if scores['Conscientiousness'] > 65:
            strengths.append('Reliable execution and follow-through')
        if scores['Openness'] > 65:
            strengths.append('Innovative problem-solving')
        if scores['Agreeableness'] > 65:
            strengths.append('Builds strong team cohesion')
        if scores['Neuroticism'] < 35:
            strengths.append('Calm under pressure')
        
        return strengths[:3]
    
    def _identify_leadership_development(self, profile: Dict) -> List[str]:
        """Identify leadership development areas"""
        development = []
        scores = profile['big_five']['scores']
        
        if scores['Extraversion'] < 40:
            development.append('Practice public speaking and visibility')
        if scores['Conscientiousness'] < 45:
            development.append('Develop systematic planning skills')
        if scores['Agreeableness'] > 80:
            development.append('Practice making tough decisions')
        if scores['Neuroticism'] > 65:
            development.append('Build stress management techniques')
        
        return development[:2]
    
    def _analyze_distributed_leadership(self, profiles: List[Dict]) -> Dict:
        """Analyze potential for distributed leadership"""
        leadership_scores = [self._calculate_leadership_potential(p) for p in profiles]
        
        high_potential_count = sum(1 for score in leadership_scores if score > 60)
        score_variance = np.var(leadership_scores)
        
        if high_potential_count >= len(profiles) * 0.5:
            model = 'Distributed Leadership'
            description = 'Multiple team members can lead in different contexts'
        elif score_variance > 400:  # High variance
            model = 'Hierarchical Leadership'
            description = 'Clear leadership hierarchy with distinct leaders and followers'
        else:
            model = 'Collaborative Leadership'
            description = 'Team works best with shared leadership responsibilities'
        
        return {
            'model': model,
            'description': description,
            'high_potential_ratio': round(high_potential_count / len(profiles), 2),
            'recommendation': self._get_distributed_leadership_recommendation(model, high_potential_count)
        }
    
    def _get_distributed_leadership_recommendation(self, model: str, high_count: int) -> str:
        """Get recommendation for distributed leadership"""
        if model == 'Distributed Leadership':
            return 'Rotate leadership roles based on project type and expertise'
        elif model == 'Hierarchical Leadership':
            return 'Establish clear leadership roles while developing emerging leaders'
        else:
            return 'Use collaborative decision-making with rotating facilitation'
    
    def _get_leadership_style_recommendation(self, style_distribution: Counter) -> str:
        """Get recommendation based on leadership style distribution"""
        if len(style_distribution) == 1:
            return 'Seek diverse leadership perspectives to avoid blind spots'
        elif len(style_distribution) > 3:
            return 'Leverage diverse leadership styles for different situations'
        else:
            return 'Current leadership diversity provides good balance'
    
    def _calculate_team_averages(self, profiles: List[Dict]) -> Dict[str, float]:
        """Calculate team average scores"""
        averages = {}
        for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']:
            scores = [p['big_five']['scores'][trait] for p in profiles]
            averages[trait] = np.mean(scores)
        return averages
    
    def _calculate_team_std(self, profiles: List[Dict]) -> Dict[str, float]:
        """Calculate team standard deviations"""
        stds = {}
        for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']:
            scores = [p['big_five']['scores'][trait] for p in profiles]
            stds[trait] = np.std(scores)
        return stds