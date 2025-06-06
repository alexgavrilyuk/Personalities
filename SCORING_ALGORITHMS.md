# Scoring Algorithms Documentation

## Overview

This document provides detailed technical documentation of all scoring algorithms used in the personality assessment application. The scoring system integrates multiple psychometric approaches to provide accurate, reliable personality measurement.

## Table of Contents

1. [Big Five Scoring](#big-five-scoring)
2. [MBTI Type Classification](#mbti-type-classification)
3. [Cognitive Function Analysis](#cognitive-function-analysis)
4. [Personality Cluster Classification](#personality-cluster-classification)
5. [Jungian Depth Analysis](#jungian-depth-analysis)
6. [Statistical Methods](#statistical-methods)
7. [Validation and Reliability](#validation-and-reliability)

## Big Five Scoring

### 1. Raw Score Calculation

The raw scoring algorithm processes Likert-scale responses using factor loadings:

```python
def calculate_raw_scores(responses):
    scores = {dim: 0.0 for dim in BIG_FIVE_DIMENSIONS}
    counts = {dim: 0 for dim in BIG_FIVE_DIMENSIONS}
    
    for response in responses:
        question = get_question(response.question_id)
        
        # Convert 1-7 scale to 0-6
        value = response.response_value - 1
        
        # Apply reverse scoring
        if question.reverse_scored:
            value = 6 - value
        
        # Apply factor loadings
        for dimension, loading in question.factor_loadings.items():
            scores[dimension] += value * loading
            counts[dimension] += abs(loading)
    
    # Normalize to 0-100 scale
    for dimension in scores:
        if counts[dimension] > 0:
            scores[dimension] = (scores[dimension] / counts[dimension]) * 100 / 6
```

**Key Concepts:**
- **Factor Loadings**: Each question has loadings on multiple dimensions
- **Cross-loadings**: Questions can contribute to multiple traits
- **Normalization**: Scores scaled to 0-100 for interpretability

### 2. Item Response Theory (IRT) Scoring

The IRT implementation uses a simplified Graded Response Model:

```python
def calculate_irt_scores(responses):
    """
    Estimates latent trait (theta) using maximum likelihood
    """
    def graded_response_probability(theta, a, b):
        """
        a: discrimination parameter
        b: threshold parameters
        """
        # Probability of responding in category k
        p_k = norm.cdf(b[k] - a * theta) - norm.cdf(b[k-1] - a * theta)
        return p_k
    
    # Maximum likelihood estimation
    theta_estimate = minimize(
        lambda t: -log_likelihood(t, responses, item_params),
        x0=[0],
        bounds=[(-4, 4)]
    ).x[0]
    
    # Standard error from information function
    information = sum(a**2 * p * (1-p) for a, p in item_info)
    se = 1 / sqrt(information)
```

**IRT Parameters:**
- **Theta (θ)**: Latent trait level (-4 to +4 scale)
- **Discrimination (a)**: How well item differentiates trait levels
- **Thresholds (b)**: Difficulty parameters for each response option

### 3. Score Standardization

Combines raw and IRT scores with norm comparison:

```python
def standardize_scores(raw_scores, irt_scores):
    standardized = {}
    
    for dimension in BIG_FIVE_DIMENSIONS:
        # Weight IRT more heavily (70/30 split)
        irt_theta, irt_se = irt_scores[dimension]
        irt_scaled = (irt_theta + 2) * 25  # Convert -2,+2 to 0,100
        
        combined_score = 0.7 * irt_scaled + 0.3 * raw_scores[dimension]
        
        # Calculate percentile from norm data
        z_score = (combined_score - norm_mean) / norm_sd
        percentile = norm.cdf(z_score) * 100
        
        standardized[dimension] = {
            'score': combined_score,
            'percentile': percentile,
            'se': irt_se * 15  # Scale standard error
        }
```

### 4. Facet Score Calculation

Each Big Five dimension has 6 facets:

```python
FACET_STRUCTURE = {
    'Extraversion': ['Warmth', 'Gregariousness', 'Assertiveness', 
                     'Activity', 'Excitement-Seeking', 'Positive Emotions'],
    'Agreeableness': ['Trust', 'Straightforwardness', 'Altruism',
                      'Compliance', 'Modesty', 'Tender-Mindedness'],
    # ... other dimensions
}

def calculate_facet_scores(responses):
    facet_scores = {}
    
    for response in responses:
        question = get_question(response.question_id)
        facet = question.facet
        
        if facet:
            score = (response.value - 1) / 6 * 100
            if question.reverse_scored:
                score = 100 - score
            
            facet_scores[facet].append(score)
    
    # Average scores for each facet
    return {facet: mean(scores) for facet, scores in facet_scores.items()}
```

## MBTI Type Classification

### 1. Hybrid Scoring Approach

Combines forced-choice responses with Big Five correlations:

```python
def classify_mbti_type(big_five_scores, forced_choice_responses):
    preferences = {dim: 0.0 for dim in MBTI_DIMENSIONS}
    
    # Step 1: Process forced-choice responses (70% weight)
    for response in forced_choice_responses:
        question = get_question(response.question_id)
        selected = question.option_a if response.selected == 'a' else question.option_b
        
        for preference, score in selected.scores.items():
            preferences[preference] += score * 0.7
    
    # Step 2: Add Big Five correlations (30% weight)
    # Based on empirical research
    correlations = {
        'E': big_five_scores['Extraversion'] / 100,
        'I': 1 - big_five_scores['Extraversion'] / 100,
        'N': big_five_scores['Openness'] / 100,
        'S': 1 - big_five_scores['Openness'] / 100,
        'F': big_five_scores['Agreeableness'] / 100,
        'T': 1 - big_five_scores['Agreeableness'] / 100,
        'J': big_five_scores['Conscientiousness'] / 100,
        'P': 1 - big_five_scores['Conscientiousness'] / 100
    }
    
    for pref, weight in correlations.items():
        preferences[pref] += weight * 0.3
```

### 2. Type Determination with Probabilities

```python
def determine_type_with_probabilities(preferences):
    type_code = ''
    dimension_probabilities = {}
    
    for dim1, dim2 in [('E','I'), ('S','N'), ('T','F'), ('J','P')]:
        total = preferences[dim1] + preferences[dim2]
        prob_first = preferences[dim1] / total if total > 0 else 0.5
        
        if prob_first > 0.5:
            type_code += dim1
            dimension_probabilities[dim1] = prob_first
        else:
            type_code += dim2
            dimension_probabilities[dim2] = 1 - prob_first
    
    # Overall type probability
    overall_prob = prod(dimension_probabilities.values())
    
    # Find secondary type if probability < 0.8
    secondary = find_secondary_type(preferences) if overall_prob < 0.8 else None
    
    return {
        'primary_type': type_code,
        'probability': overall_prob,
        'secondary_type': secondary,
        'dimension_probabilities': dimension_probabilities
    }
```

### 3. Empirical Correlations Used

Based on McCrae & Costa research:

| MBTI Dimension | Big Five Correlation | Strength |
|----------------|---------------------|----------|
| E-I | Extraversion | r = -0.74 |
| S-N | Openness | r = 0.72 |
| T-F | Agreeableness | r = 0.44 |
| J-P | Conscientiousness | r = 0.49 |

## Cognitive Function Analysis

### 1. Function Stack Determination

Maps MBTI type to cognitive function order:

```python
FUNCTION_STACKS = {
    'INTJ': ['Ni', 'Te', 'Fi', 'Se', 'Ne', 'Ti', 'Fe', 'Si'],
    'INTP': ['Ti', 'Ne', 'Si', 'Fe', 'Te', 'Ni', 'Se', 'Fi'],
    # ... all 16 types
}

def determine_function_stack(mbti_type, big_five_scores):
    stack = FUNCTION_STACKS[mbti_type][:4]  # Primary 4 functions
    development_levels = {}
    
    for i, function in enumerate(stack):
        # Base development by stack position
        base_levels = [0.8, 0.6, 0.4, 0.2]  # Dominant to inferior
        base = base_levels[i]
        
        # Adjust based on Big Five scores
        modifier = calculate_function_modifier(function, big_five_scores)
        
        development_levels[function] = min(1.0, base + modifier)
    
    return stack, development_levels
```

### 2. Function Development Calculation

```python
def calculate_function_modifier(function, big_five_scores):
    """
    Adjusts function development based on trait scores
    """
    modifier = 0.0
    
    # Attitude (introverted/extraverted)
    if function[1] == 'i':  # Introverted function
        modifier += (100 - big_five_scores['Extraversion']) / 400
    else:  # Extraverted function
        modifier += big_five_scores['Extraversion'] / 400
    
    # Perceiving functions
    if function[0] == 'N':  # Intuition
        modifier += big_five_scores['Openness'] / 400
    elif function[0] == 'S':  # Sensing
        modifier += (100 - big_five_scores['Openness']) / 400
    
    # Judging functions
    elif function[0] == 'T':  # Thinking
        modifier += (100 - big_five_scores['Agreeableness']) / 400
    elif function[0] == 'F':  # Feeling
        modifier += big_five_scores['Agreeableness'] / 400
    
    return modifier
```

### 3. Shadow Function Identification

```python
def identify_shadow_functions(primary_stack):
    """
    Maps primary functions to their shadow opposites
    """
    shadow_map = {
        'Ni': 'Ne', 'Ne': 'Ni',
        'Si': 'Se', 'Se': 'Si',
        'Ti': 'Te', 'Te': 'Ti',
        'Fi': 'Fe', 'Fe': 'Fi'
    }
    
    return [shadow_map[func] for func in primary_stack[:2]]
```

## Personality Cluster Classification

### 1. Cluster Prototypes

Based on personality research identifying common patterns:

```python
CLUSTER_PROTOTYPES = {
    'Resilient': {
        'profile': [65, 60, 65, 35, 60],  # E, A, C, N, O
        'description': 'Well-adapted, confident, capable'
    },
    'Overcontrolled': {
        'profile': [35, 50, 55, 70, 45],
        'description': 'Cautious, emotionally reactive, introverted'
    },
    'Undercontrolled': {
        'profile': [55, 35, 35, 60, 55],
        'description': 'Impulsive, disagreeable, unconventional'
    },
    'Average': {
        'profile': [50, 50, 50, 50, 50],
        'description': 'Typical, no extreme traits'
    }
}
```

### 2. Distance-Based Classification

```python
def classify_to_cluster(big_five_scores):
    """
    Assigns individual to nearest cluster prototype
    """
    distances = {}
    
    for cluster_name, cluster_data in CLUSTER_PROTOTYPES.items():
        # Euclidean distance in 5D space
        distance = sqrt(sum(
            (score - prototype)**2 
            for score, prototype in zip(big_five_scores, cluster_data['profile'])
        ))
        distances[cluster_name] = distance
    
    # Find closest cluster
    primary_cluster = min(distances, key=distances.get)
    
    # Calculate probabilities using inverse distance weighting
    inv_distances = {k: 1/(v+1) for k, v in distances.items()}
    total = sum(inv_distances.values())
    probabilities = {k: v/total for k, v in inv_distances.items()}
    
    return primary_cluster, probabilities
```

### 3. Future Enhancement: Gaussian Mixture Model

```python
def train_cluster_model(population_data):
    """
    For production: train GMM on large sample
    """
    from sklearn.mixture import GaussianMixture
    
    # Determine optimal clusters using BIC
    bic_scores = []
    for n in range(2, 8):
        gmm = GaussianMixture(n_components=n, covariance_type='full')
        gmm.fit(population_data)
        bic_scores.append(gmm.bic(population_data))
    
    optimal_n = np.argmin(bic_scores) + 2
    
    # Train final model
    final_model = GaussianMixture(
        n_components=optimal_n,
        covariance_type='full',
        n_init=10
    )
    final_model.fit(population_data)
    
    return final_model
```

## Jungian Depth Analysis

### 1. Shadow Integration Scoring

```python
def calculate_shadow_integration(depth_responses):
    """
    Measures awareness and integration of shadow aspects
    """
    shadow_items = [
        "I notice qualities I dislike in others exist in myself",
        "I can acknowledge my less desirable traits",
        "What irritates me in others often reflects my own issues"
    ]
    
    shadow_scores = []
    for response in depth_responses:
        if response.question_id.startswith('JD_SH'):
            # Convert 1-5 scale to 0-1
            normalized = (response.value - 1) / 4
            shadow_scores.append(normalized)
    
    integration_score = mean(shadow_scores) if shadow_scores else 0.5
    
    # Categorize integration level
    if integration_score < 0.25:
        stage = "Unconscious"
    elif integration_score < 0.5:
        stage = "Emerging Awareness"
    elif integration_score < 0.75:
        stage = "Active Integration"
    else:
        stage = "Advanced Integration"
    
    return integration_score, stage
```

### 2. Archetype Profile Analysis

```python
ARCHETYPES = [
    'Hero', 'Sage', 'Explorer', 'Ruler',
    'Creator', 'Caregiver', 'Magician', 'Lover',
    'Jester', 'Everyman', 'Rebel', 'Innocent'
]

def analyze_archetype_profile(responses, big_five_scores):
    """
    Maps responses to archetypal patterns
    """
    archetype_scores = {arch: 0.0 for arch in ARCHETYPES}
    
    # Direct archetype questions
    for response in responses:
        if response.question.archetype:
            archetype_scores[response.question.archetype] += response.value / 5
    
    # Big Five correlations with archetypes
    archetype_correlations = {
        'Hero': {'E': 0.6, 'C': 0.7, 'N': -0.5},
        'Sage': {'O': 0.8, 'E': -0.3},
        'Creator': {'O': 0.9, 'C': 0.4},
        # ... other archetypes
    }
    
    for archetype, correlations in archetype_correlations.items():
        for trait, weight in correlations.items():
            score = big_five_scores[trait] / 100
            if weight < 0:
                score = 1 - score
            archetype_scores[archetype] += abs(weight) * score
    
    # Normalize to percentages
    total = sum(archetype_scores.values())
    return {arch: score/total for arch, score in archetype_scores.items()}
```

### 3. Individuation Stage Assessment

```python
def assess_individuation_stage(responses, age, shadow_integration, big_five):
    """
    Determines progress in Jungian individuation process
    """
    indicators = {
        'self_awareness': 0,
        'shadow_work': shadow_integration,
        'anima_animus': 0,
        'wise_self': 0
    }
    
    # Process individuation-specific questions
    for response in responses:
        if 'individuation' in response.question.dimension:
            category = response.question.category
            indicators[category] += response.value / 5
    
    # Age adjustment (individuation typically progresses with age)
    age_factor = min(age / 50, 1.0) if age else 0.5
    
    # Big Five indicators of individuation
    emotional_stability = (100 - big_five['Neuroticism']) / 100
    self_actualization = big_five['Openness'] / 100
    
    # Composite individuation score
    composite = mean([
        indicators['self_awareness'],
        indicators['shadow_work'],
        indicators['anima_animus'],
        indicators['wise_self'],
        emotional_stability * 0.5,
        self_actualization * 0.5
    ]) * age_factor
    
    # Stage determination
    if composite < 0.25:
        return "Initial Awakening"
    elif composite < 0.5:
        return "Confronting the Shadow"
    elif composite < 0.75:
        return "Integration Phase"
    else:
        return "Approaching Wholeness"
```

## Statistical Methods

### 1. Confidence Interval Calculation

```python
def calculate_confidence_intervals(scores, standard_errors, alpha=0.05):
    """
    Calculates confidence intervals for all scores
    """
    z_critical = norm.ppf(1 - alpha/2)  # 1.96 for 95% CI
    
    intervals = {}
    for dimension, score in scores.items():
        se = standard_errors.get(dimension, 5.0)  # Default SE
        margin = z_critical * se
        
        intervals[dimension] = {
            'point_estimate': score,
            'lower_bound': max(0, score - margin),
            'upper_bound': min(100, score + margin),
            'confidence_level': 1 - alpha
        }
    
    return intervals
```

### 2. Bootstrap Methods for Robust Estimation

```python
def bootstrap_confidence_intervals(responses, n_iterations=1000):
    """
    Non-parametric confidence intervals via bootstrap
    """
    bootstrap_scores = []
    
    for _ in range(n_iterations):
        # Resample with replacement
        resampled = np.random.choice(responses, size=len(responses), replace=True)
        scores = calculate_raw_scores(resampled)
        bootstrap_scores.append(scores)
    
    # Calculate percentile intervals
    intervals = {}
    for dimension in BIG_FIVE_DIMENSIONS:
        dim_scores = [s[dimension] for s in bootstrap_scores]
        intervals[dimension] = {
            'lower': np.percentile(dim_scores, 2.5),
            'upper': np.percentile(dim_scores, 97.5)
        }
    
    return intervals
```

### 3. Multiple Comparison Correction

```python
def bonferroni_correction(p_values, alpha=0.05):
    """
    Adjusts significance level for multiple comparisons
    """
    n_comparisons = len(p_values)
    adjusted_alpha = alpha / n_comparisons
    
    significant = {
        test: p_val < adjusted_alpha 
        for test, p_val in p_values.items()
    }
    
    return significant, adjusted_alpha
```

## Validation and Reliability

### 1. Internal Consistency (Cronbach's Alpha)

```python
def calculate_cronbachs_alpha(item_scores):
    """
    Measures scale reliability
    """
    n_items = len(item_scores[0])
    n_respondents = len(item_scores)
    
    # Item variances
    item_vars = [np.var([r[i] for r in item_scores]) for i in range(n_items)]
    
    # Total score variance
    total_scores = [sum(r) for r in item_scores]
    total_var = np.var(total_scores)
    
    # Cronbach's alpha formula
    alpha = (n_items / (n_items - 1)) * (1 - sum(item_vars) / total_var)
    
    return alpha
```

**Target Reliability:**
- Big Five scales: α > 0.80
- MBTI dimensions: α > 0.75
- Depth measures: α > 0.70

### 2. Test-Retest Reliability

```python
def calculate_test_retest_reliability(time1_scores, time2_scores):
    """
    Measures temporal stability
    """
    correlations = {}
    
    for dimension in BIG_FIVE_DIMENSIONS:
        r = pearsonr(time1_scores[dimension], time2_scores[dimension])[0]
        correlations[dimension] = r
    
    # Intraclass correlation coefficient
    icc = calculate_icc(time1_scores, time2_scores)
    
    return correlations, icc
```

### 3. Convergent Validity

Correlations with established measures:
- Big Five with NEO-PI-R: r > 0.85
- MBTI with Form M: r > 0.80
- Depth measures with existing scales: r > 0.65

## Implementation Notes

### Performance Considerations

1. **Caching**: Pre-calculate item parameters and norm tables
2. **Vectorization**: Use NumPy for batch calculations
3. **Parallel Processing**: Score dimensions independently
4. **Memory**: ~50MB for complete scoring with all parameters

### Accuracy Requirements

1. **Floating Point**: Use double precision throughout
2. **Rounding**: Only for final display (1 decimal place)
3. **Missing Data**: Require 80% completion minimum
4. **Outlier Detection**: Flag extreme response patterns

### Future Enhancements

1. **Adaptive Testing**: Select questions based on previous responses
2. **Machine Learning**: Neural networks for type classification
3. **Multilevel IRT**: Account for facet structure
4. **Bayesian Methods**: Full posterior distributions for scores

This comprehensive scoring system provides scientifically valid personality assessment while maintaining computational efficiency and user interpretability.