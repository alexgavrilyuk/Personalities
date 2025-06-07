# API Reference Documentation

This application uses two backend services:

## Backend Services

### BackendPip (Python/FastAPI) - Assessment Processing
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```
**Authentication**: None required - stateless processing

### Backend (Node.js/Express) - User Management
```
Development: http://localhost:8001/api
Production: https://your-domain.com/auth-api
```
**Authentication**: Bearer token (JWT from Supabase)

## BackendPip Endpoints (Assessment Processing)

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
      "response_type": "forced_choice",
      "options": {
        "a": "Mingle and meet new people",
        "b": "Have deep conversations with a few people"
      },
      "assessment_layer": "secondary"
    }
    // ... 198 more questions
  ]
}
```

### 2. Submit Assessment

#### `POST /api/submit-assessment`

Processes assessment responses and returns comprehensive personality analysis.

**Request**
```http
POST /api/submit-assessment
Content-Type: application/json
```

**Request Body**
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
    // ... more responses (minimum 160 required)
  ]
}
```

**Response**
```json
{
  "big_five": {
    "Extraversion": {
      "score": 3.2,
      "percentile": 40,
      "confidence_interval": [2.9, 3.5],
      "facets": {
        "Warmth": 3.5,
        "Gregariousness": 2.8,
        "Assertiveness": 3.1,
        "Activity_Level": 3.4,
        "Excitement_Seeking": 3.0,
        "Positive_Emotions": 3.2
      }
    }
    // ... other Big Five traits
  },
  "mbti": {
    "type": "INTJ",
    "preferences": {
      "E_I": { "E": 0.35, "I": 0.65 },
      "S_N": { "S": 0.28, "N": 0.72 },
      "T_F": { "T": 0.71, "F": 0.29 },
      "J_P": { "J": 0.83, "P": 0.17 }
    },
    "confidence": 0.78
  },
  "cognitive_functions": {
    "dominant": { "function": "Ni", "development": 0.85 },
    "auxiliary": { "function": "Te", "development": 0.72 },
    "tertiary": { "function": "Fi", "development": 0.58 },
    "inferior": { "function": "Se", "development": 0.31 },
    "shadow_functions": ["Ne", "Ti", "Fe", "Si"]
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
  "interpretation": "Your personality profile indicates...",
  "development_suggestions": [
    "Practice initiating social connections...",
    "Develop empathy through active listening..."
  ]
}
```

## Backend Endpoints (User Management)

### Authentication Endpoints

#### `POST /api/auth/signup`

Create a new user account.

**Request**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```

**Response**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-07T12:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

#### `POST /api/auth/login`

Sign in existing user.

**Request**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**: Same as signup

#### `POST /api/auth/logout`

Sign out current user.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Response**
```json
{
  "message": "Successfully logged out"
}
```

#### `GET /api/auth/session`

Get current session status.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Response**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "John Doe"
    }
  }
}
```

### User Management Endpoints

#### `GET /api/user/profile`

Get user profile information.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Response**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-07T12:00:00Z"
}
```

#### `PUT /api/user/profile`

Update user profile.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Request Body**
```json
{
  "name": "Jane Doe"
}
```

**Response**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

#### `GET /api/user/progress`

Get assessment progress for current user.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Query Parameters**
```
assessmentType: string (optional, defaults to 'core')
```

**Response**
```json
{
  "totalResponses": 85,
  "completionPercentage": 42,
  "isComplete": false,
  "assessmentType": "core",
  "expectedQuestions": 200
}
```

#### `GET /api/user/completions`

Get all completed assessments for current user.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Response**
```json
{
  "completions": [
    {
      "assessmentType": "core",
      "completedAt": "2024-01-07T12:30:00Z",
      "responseCount": 200
    }
  ]
}
```

#### `GET /api/user/report/:assessmentType?`

Generate report for completed assessment.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Parameters**
```
assessmentType: string (optional, defaults to 'core')
```

**Response**
```json
{
  "report": {
    // Full assessment results (see Submit Assessment response)
  },
  "assessmentType": "core",
  "completedAt": "2024-01-07T12:30:00Z",
  "generatedAt": "2024-01-08T10:00:00Z"
}
```

### Response Management Endpoints

#### `POST /api/responses/save`

Save a single response.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Request Body**
```json
{
  "questionId": "BF_E_001",
  "responseValue": 5
}
```
OR
```json
{
  "questionId": "FC_EI_001",
  "selectedOption": "a"
}
```

**Response**
```json
{
  "success": true,
  "totalResponses": 86
}
```

#### `POST /api/responses/batch`

Save multiple responses at once.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Request Body**
```json
{
  "responses": [
    {
      "questionId": "BF_E_001",
      "responseValue": 5
    },
    {
      "questionId": "FC_EI_001",
      "selectedOption": "a"
    }
    // ... more responses
  ]
}
```

**Response**
```json
{
  "success": true,
  "savedCount": 10,
  "totalResponses": 95,
  "assessmentType": "core"
}
```

#### `GET /api/responses/all`

Get all saved responses for current user.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Query Parameters**
```
assessmentType: string (optional, defaults to 'core')
```

**Response**
```json
{
  "responses": [
    {
      "questionId": "BF_E_001",
      "responseValue": 5,
      "selectedOption": null
    },
    {
      "questionId": "FC_EI_001",
      "responseValue": null,
      "selectedOption": "a"
    }
    // ... more responses
  ],
  "count": 95,
  "assessmentType": "core"
}
```

#### `DELETE /api/responses/clear`

Clear all responses and start over.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Response**
```json
{
  "success": true,
  "message": "All responses cleared successfully"
}
```

#### `GET /api/responses/report/:sessionId`

Generate report from saved responses.

**Request Header**
```
Authorization: Bearer <access_token>
```

**Response**
```json
{
  "report": {
    // Same structure as submit-assessment response
  },
  "sessionId": "uuid",
  "generatedAt": "2024-01-07T12:35:00Z"
}
```

## Error Handling

All endpoints follow standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

Error responses include a `detail` or `error` field with a human-readable error message.

## Rate Limiting

Authentication endpoints (`/api/auth/*`) are rate-limited to 5 requests per 15 minutes per IP address.

## Security Notes

1. **Passwords**: Must be at least 8 characters long
2. **Tokens**: JWT tokens expire after 1 hour
3. **Data Access**: Users can only access their own data (enforced by Row Level Security)
4. **HTTPS**: Always use HTTPS in production

## Usage Examples

### JavaScript/TypeScript with Authentication

```typescript
// Sign up
const signUp = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8001/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword: password })
  });
  
  const data = await response.json();
  // Store the access token
  localStorage.setItem('access_token', data.session.access_token);
  return data;
};

// Save response with authentication
const saveResponse = async (questionId: string, value: number) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8001/api/responses/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      questionId,
      responseValue: value
    })
  });
  
  return response.json();
};

// Get progress
const getProgress = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8001/api/user/progress', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## Migration Notes

When migrating from the anonymous-only version:
1. Authentication is optional - anonymous users can still use the app
2. Results are never stored - only raw responses for authenticated users
3. The assessment processing logic remains unchanged
4. Frontend needs to handle auth state and progress saving
5. Add Supabase configuration to environment