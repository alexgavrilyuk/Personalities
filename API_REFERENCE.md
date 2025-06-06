# API Reference Documentation

## Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

## Authentication
**None required** - This API is stateless and requires no authentication.

## Endpoints

### 1. Start Assessment

#### `POST /api/start-assessment`

Initializes a new personality assessment by returning the complete question set.

**Request**
```http
POST /api/start-assessment
Content-Type: application/json
```

No request body required.

**Response**
```json
{
  "questions": [
    {
      "id": "BF_E_001",
      "text": "I warm up quickly to others",
      "dimension": "Extraversion",
      "facet": "Warmth",
      "reverse_scored": false,
      "assessment_layer": "primary",
      "response_type": "likert_7",
      "factor_loadings": {
        "Extraversion": 0.72,
        "Agreeableness": 0.25,
        "Conscientiousness": 0.00,
        "Neuroticism": -0.10,
        "Openness": 0.08
      }
    },
    {
      "id": "FC_EI_001",
      "text": "At a party, I usually:",
      "assessment_layer": "secondary",
      "response_type": "forced_choice",
      "option_a": {
        "text": "Seek out new people to meet",
        "scores": {"E": 1, "I": 0}
      },
      "option_b": {
        "text": "Have deep conversations with one or two people",
        "scores": {"E": 0, "I": 1}
      }
    }
  ],
  "total_questions": 200
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| questions | Array[Question] | Complete list of assessment questions |
| total_questions | Integer | Total number of questions (always 200) |

**Question Object**

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique question identifier |
| text | String | Question text to display |
| dimension | String? | Big Five dimension (primary layer only) |
| facet | String? | Specific facet within dimension |
| reverse_scored | Boolean | Whether scoring should be reversed |
| assessment_layer | String | "primary", "secondary", or "tertiary" |
| response_type | String | "likert_7", "likert_5", or "forced_choice" |
| factor_loadings | Object? | Cross-loadings on Big Five (primary only) |
| option_a | Object? | First option for forced choice |
| option_b | Object? | Second option for forced choice |

**Notes**
- Questions are shuffled within each assessment layer
- Layer order is preserved: primary → secondary → tertiary
- No session is created; questions must be stored client-side

---

### 2. Submit Assessment

#### `POST /api/submit-assessment`

Processes completed assessment responses and returns comprehensive personality results.

**Request**
```http
POST /api/submit-assessment
Content-Type: application/json
```

```json
{
  "responses": [
    {
      "question_id": "BF_E_001",
      "response_value": 5
    },
    {
      "question_id": "FC_EI_001",
      "selected_option": "a"
    }
  ]
}
```

**Request Fields**

| Field | Type | Description |
|-------|------|-------------|
| responses | Array[Response] | User's responses to questions |

**Response Object**

| Field | Type | Description |
|-------|------|-------------|
| question_id | String | ID of the answered question |
| response_value | Integer? | 1-7 for Likert scales |
| selected_option | String? | "a" or "b" for forced choice |

**Response**
```json
{
  "big_five": {
    "scores": {
      "Extraversion": 65.3,
      "Agreeableness": 72.1,
      "Conscientiousness": 58.9,
      "Neuroticism": 41.2,
      "Openness": 83.7
    },
    "percentiles": {
      "Extraversion": 73,
      "Agreeableness": 81,
      "Conscientiousness": 62,
      "Neuroticism": 38,
      "Openness": 91
    },
    "confidence_intervals": {
      "Extraversion": {
        "point_estimate": 65.3,
        "lower_bound": 59.8,
        "upper_bound": 70.8,
        "confidence_level": 0.95
      }
    },
    "facet_scores": {
      "Extraversion": {
        "Warmth": 68.5,
        "Gregariousness": 62.1,
        "Assertiveness": 71.3,
        "Activity": 59.8,
        "Excitement-Seeking": 66.2,
        "Positive Emotions": 63.9
      }
    }
  },
  "mbti": {
    "primary_type": "INTJ",
    "probability": 0.782,
    "secondary_type": "INFJ",
    "dimension_probabilities": {
      "I": 0.823,
      "N": 0.912,
      "T": 0.667,
      "J": 0.754
    }
  },
  "cognitive_functions": {
    "primary_stack": ["Ni", "Te", "Fi", "Se"],
    "development_levels": {
      "Ni": 0.85,
      "Te": 0.72,
      "Fi": 0.48,
      "Se": 0.31
    },
    "shadow_functions": ["Ne", "Ti"]
  },
  "personality_cluster": {
    "primary_cluster": 0,
    "cluster_probabilities": [0.65, 0.20, 0.10, 0.05],
    "cluster_description": "Resilient"
  },
  "jungian_depth": {
    "shadow_integration": 0.68,
    "archetype_profile": {
      "Sage": 0.82,
      "Hero": 0.65,
      "Creator": 0.71
    },
    "individuation_stage": "Active Integration"
  },
  "interpretation": "Your personality profile indicates INTJ preferences...",
  "development_suggestions": [
    "Practice initiating social connections...",
    "Develop empathy through active listening...",
    "Work on developing your inferior function (Se)...",
    "Explore shadow work through journaling...",
    "Ground innovative ideas with practical steps..."
  ]
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| big_five | Object | Big Five trait scores and analysis |
| mbti | Object | MBTI type classification |
| cognitive_functions | Object | Jungian cognitive function stack |
| personality_cluster | Object | Statistical personality cluster |
| jungian_depth | Object | Depth psychology metrics |
| interpretation | String | Integrated narrative interpretation |
| development_suggestions | Array[String] | Personalized growth recommendations |

**Error Responses**

**400 Bad Request**
```json
{
  "detail": "Insufficient responses. Received 150, minimum required is 160."
}
```

**500 Internal Server Error**
```json
{
  "detail": "Error processing assessment: [error details]"
}
```

---

## Error Handling

All endpoints follow standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

Error responses include a `detail` field with a human-readable error message.

## Rate Limiting

No rate limiting is implemented in the current version. For production deployment, consider implementing rate limiting at the reverse proxy level.

## CORS

CORS is configured to allow all origins (`*`) in the current implementation. For production, update the CORS middleware to specify allowed origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)
```

## Data Types

### Question Types

**Likert Scale Questions**
- `likert_7`: 7-point scale (Strongly Disagree to Strongly Agree)
- `likert_5`: 5-point scale (used for some depth questions)

**Forced Choice Questions**
- Binary choice between two equally desirable options
- Used for MBTI preference assessment

### Assessment Layers

1. **Primary**: Big Five personality traits (120 questions)
2. **Secondary**: MBTI preferences (50 questions)
3. **Tertiary**: Jungian depth psychology (30 questions)

### Big Five Dimensions

- **Extraversion**: Social energy and assertiveness
- **Agreeableness**: Cooperation and trust
- **Conscientiousness**: Organization and dependability
- **Neuroticism**: Emotional stability (reverse)
- **Openness**: Creativity and intellectual curiosity

### MBTI Dimensions

- **E/I**: Extraversion vs Introversion
- **S/N**: Sensing vs Intuition
- **T/F**: Thinking vs Feeling
- **J/P**: Judging vs Perceiving

### Cognitive Functions

**Perceiving Functions**
- Ni: Introverted Intuition
- Ne: Extraverted Intuition
- Si: Introverted Sensing
- Se: Extraverted Sensing

**Judging Functions**
- Ti: Introverted Thinking
- Te: Extraverted Thinking
- Fi: Introverted Feeling
- Fe: Extraverted Feeling

## Usage Examples

### JavaScript/TypeScript

```typescript
// Start assessment
const startAssessment = async () => {
  const response = await fetch('http://localhost:8000/api/start-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data.questions;
};

// Submit responses
const submitAssessment = async (responses: QuestionResponse[]) => {
  const response = await fetch('http://localhost:8000/api/submit-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses })
  });
  
  if (!response.ok) {
    throw new Error('Assessment submission failed');
  }
  
  return response.json();
};
```

### Python

```python
import requests

# Start assessment
response = requests.post('http://localhost:8000/api/start-assessment')
questions = response.json()['questions']

# Submit responses
responses = [
    {"question_id": "BF_E_001", "response_value": 5},
    {"question_id": "FC_EI_001", "selected_option": "a"}
    # ... more responses
]

result = requests.post(
    'http://localhost:8000/api/submit-assessment',
    json={"responses": responses}
)
personality_profile = result.json()
```

### cURL

```bash
# Start assessment
curl -X POST http://localhost:8000/api/start-assessment \
  -H "Content-Type: application/json"

# Submit assessment
curl -X POST http://localhost:8000/api/submit-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {"question_id": "BF_E_001", "response_value": 5},
      {"question_id": "FC_EI_001", "selected_option": "a"}
    ]
  }'
```

## Best Practices

1. **Complete All Questions**: For accurate results, users should answer at least 160 questions (80%)
2. **Single Session**: Complete the assessment in one session as no data is persisted
3. **Response Validation**: Validate responses client-side before submission
4. **Error Handling**: Implement proper error handling for network failures
5. **Progress Saving**: Consider implementing local storage for progress (client-side only)

## Limitations

- No data persistence between sessions
- No user authentication or profiles
- Results are calculated in real-time and not stored
- Maximum processing time ~2-3 seconds for full assessment
- No partial results - minimum 80% completion required

## Future Considerations

For API extensions, maintain these principles:
- Stateless design (no sessions)
- Privacy-first (no data storage)
- Clear, RESTful endpoints
- Comprehensive error messages
- Backward compatibility