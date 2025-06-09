# API Reference Documentation V2

This application uses two backend services with enhanced premium features:

## Backend Services

### BackendPip (Python/FastAPI) - Assessment Processing & Premium Features
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```
**Authentication**: None for basic endpoints, user context for premium
**Version**: 2.0.0

### Backend (Node.js/Express) - User Management & Payment
```
Development: http://localhost:8001/api
Production: https://your-domain.com/auth-api
```
**Authentication**: Bearer token (JWT from Supabase)

## BackendPip Endpoints (Assessment Processing)

### Core Assessment Endpoints

#### 1. Start Assessment

##### `POST /api/start-assessment`

Initializes a new personality assessment by returning the complete question set.

**Request**
```http
POST /api/start-assessment
Content-Type: application/json

{
  "user_seed": 12345  // Optional: for deterministic question ordering
}
```

**Response**
```json
{
  "questions": [...],  // Array of 200 questions
  "total_questions": 200
}
```

#### 2. Submit Assessment

##### `POST /api/submit-assessment`

Processes assessment responses and returns comprehensive results.

**Request**
```http
POST /api/submit-assessment
Content-Type: application/json

{
  "responses": [
    {
      "question_id": "BF_E_001",
      "response_value": 5,
      "selected_option": null
    },
    {
      "question_id": "MBTI_EI_001",
      "response_value": null,
      "selected_option": "a"
    }
  ]
}
```

**Response**
```json
{
  "big_five": {
    "scores": {...},
    "percentiles": {...},
    "confidence_intervals": {...},
    "facet_scores": {...}
  },
  "mbti": {
    "primary_type": "INTJ",
    "probability": 0.87,
    "secondary_type": "INFJ",
    "dimension_probabilities": {...}
  },
  "cognitive_functions": {...},
  "personality_cluster": {...},
  "jungian_analysis": {...}
}
```

### Premium Assessment Endpoints

#### 3. Get Assessment Types

##### `GET /api/premium/assessment-types`

Returns all available assessment types with access status.

**Headers**
```http
Authorization: Bearer <jwt_token>
```

**Response**
```json
[
  {
    "id": "discovery",
    "name": "Discovery Assessment",
    "tier": "discovery",
    "question_count": 60,
    "description": "Quick personality snapshot",
    "is_premium": false,
    "is_available": true
  },
  {
    "id": "relationships",
    "name": "Relationship Dynamics",
    "tier": "premium",
    "question_count": 50,
    "description": "Understand your attachment style",
    "is_premium": true,
    "is_available": false  // true if user has premium
  }
]
```

#### 4. Start Premium Assessment

##### `POST /api/premium/start-assessment/{assessment_type}`

Starts a specific assessment type (discovery, relationships, career, etc.).

**Path Parameters**
- `assessment_type`: One of: discovery, core, relationships, career, emotional_intelligence, leadership, creativity

**Headers**
```http
Authorization: Bearer <jwt_token>
```

**Response**
```json
{
  "assessment_type": "relationships",
  "questions": [...],
  "total_questions": 50
}
```

#### 5. Submit Premium Assessment

##### `POST /api/premium/submit-assessment/{assessment_type}`

Submits and scores a premium assessment.

**Response (Relationships)**
```json
{
  "assessment_type": "relationships",
  "results": {
    "attachment": {
      "style": "secure",
      "anxiety_score": 2.3,
      "avoidance_score": 2.1,
      "description": "You have a secure attachment style..."
    },
    "love_languages": {
      "primary": "quality_time",
      "secondary": "words_of_affirmation",
      "rankings": [...]
    },
    "relationship_strengths": [...],
    "growth_areas": [...]
  }
}
```

**Response (Career)**
```json
{
  "assessment_type": "career",
  "results": {
    "holland_code": "RIA",
    "riasec_scores": {...},
    "career_themes": [...],
    "suggested_careers": [...],
    "work_environment_preferences": {...},
    "career_development_tips": [...]
  }
}
```

### Team Endpoints

#### 6. Create Team

##### `POST /api/teams/create`

Creates a new team for personality comparison.

**Request**
```json
{
  "name": "Our Work Team",
  "description": "Engineering team personality analysis",
  "team_type": "work"  // family, friends, work, other
}
```

**Response**
```json
{
  "team_id": "uuid",
  "invite_code": "ABC123XY",
  "team": {...}
}
```

#### 7. Join Team

##### `POST /api/teams/join/{invite_code}`

Join a team using an invite code.

**Request**
```json
{
  "user_id": "user-uuid",
  "share_level": "full"  // full, basic, anonymous
}
```

#### 8. Get Team Insights

##### `GET /api/teams/{team_id}/insights`

Generates comprehensive team personality insights.

**Response**
```json
{
  "team_id": "uuid",
  "team_name": "Our Work Team",
  "insights": {
    "team_composition": {
      "balance_score": 75.5,
      "diversity_score": 82.3,
      "trait_averages": {...},
      "missing_perspectives": [...],
      "team_profile": "Dynamic Explorers"
    },
    "communication_map": [...],
    "potential_conflicts": [...],
    "team_strengths": [...],
    "blind_spots": [...],
    "collaboration_suggestions": [...],
    "leadership_analysis": {...}
  }
}
```

## Backend (Node.js) Endpoints

### Authentication Endpoints

#### 1. Sign Up

##### `POST /api/auth/signup`

**Request**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### 2. Login

##### `POST /api/auth/login`

**Request**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**
```json
{
  "user": {...},
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### User Management Endpoints

#### 3. Get User Progress

##### `GET /api/user/progress?assessmentType=core`

Returns user's progress for specified assessment.

**Query Parameters**
- `assessmentType`: Assessment type to check progress for

**Response**
```json
{
  "responses": [...],
  "progress": {
    "totalQuestions": 200,
    "answeredQuestions": 150,
    "percentComplete": 75
  }
}
```

#### 4. Get Completions

##### `GET /api/user/completions`

Returns all completed assessments.

**Response**
```json
{
  "completions": [
    {
      "assessment_type": "core",
      "completed_at": "2024-01-15T10:30:00Z",
      "response_count": 200
    }
  ]
}
```

### Payment Endpoints

#### 5. Create Payment Intent

##### `POST /api/payment/create-payment-intent`

Creates a payment intent for premium upgrade.

**Response**
```json
{
  "clientSecret": "pi_test_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### 6. Confirm Purchase

##### `POST /api/payment/confirm-purchase`

Confirms premium purchase after payment.

**Request**
```json
{
  "payment_intent_id": "pi_xxx"
}
```

**Response**
```json
{
  "success": true,
  "message": "Premium access activated successfully",
  "features": [...]
}
```

#### 7. Check Premium Status

##### `GET /api/payment/premium-status`

Returns user's premium status.

**Response**
```json
{
  "is_premium": true,
  "purchased_at": "2024-01-15T10:30:00Z",
  "features": [
    "Relationship Dynamics Assessment",
    "Career Alignment Profile",
    "Emotional Intelligence Mapping",
    "Leadership Potential Analysis",
    "Creative Expression Profile",
    "Unlimited Team Comparisons"
  ]
}
```

### Response Management

#### 8. Save Responses (Batch)

##### `POST /api/responses/batch`

Saves multiple assessment responses.

**Request**
```json
{
  "responses": [...],
  "assessmentType": "core"
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message",
  "detail": "Detailed error information",
  "status_code": 400
}
```

Common status codes:
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions (e.g., premium required)
- `404`: Not Found - Resource not found
- `500`: Internal Server Error

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes per IP
- Assessment endpoints: 100 requests per hour per user
- Team endpoints: 50 requests per hour per user

## Webhooks

The system supports webhooks for:
- Assessment completion
- Team member joined
- Premium purchase completed

Configure webhook URLs in your environment settings.