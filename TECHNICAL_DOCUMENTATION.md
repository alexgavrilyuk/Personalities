# Technical Documentation - Personality Assessment Application

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Services Documentation](#backend-services-documentation)
3. [Frontend Documentation](#frontend-documentation)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [API Documentation](#api-documentation)
7. [Scoring Algorithms](#scoring-algorithms)
8. [Data Flow](#data-flow)
9. [Component Architecture](#component-architecture)
10. [State Management](#state-management)
11. [Deployment Guide](#deployment-guide)
12. [Future Expansion Guide](#future-expansion-guide)

## Architecture Overview

### System Design Principles
- **Three-Service Architecture**: Frontend, Backend (Auth/Data), BackendPip (Processing)
- **Optional Authentication**: Works for both anonymous and authenticated users
- **Privacy-First**: Only raw responses saved, never calculated results
- **Real-Time Progress Saving**: Automatic save with debouncing
- **Deterministic Shuffling**: Consistent question order for authenticated users
- **Scientific Validity**: Evidence-based scoring algorithms with statistical rigor

### Technology Stack
```
Frontend:
├── React 18 with TypeScript
├── Tailwind CSS (styling)
├── Framer Motion (animations)
├── React Router (navigation)
├── Supabase JS Client (authentication)
└── Custom hooks (state management)

Backend (Node.js):
├── Node.js 16+
├── Express (REST API framework)
├── Supabase Admin SDK (database)
├── Joi (validation)
├── Helmet (security)
├── Rate limiting
└── CORS configuration

BackendPip (Python):
├── Python 3.10+
├── FastAPI (REST API framework)
├── NumPy (numerical computations)
├── SciPy (statistical functions)
├── scikit-learn (machine learning models)
└── Pydantic (data validation)

Infrastructure:
├── Docker (containerization)
├── Docker Compose (orchestration)
├── Supabase (PostgreSQL + Auth)
├── Nginx (frontend serving)
└── Row Level Security (data isolation)
```

### Directory Structure
```
PersonalitiesTwo/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── results/
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useResponseSaver.ts
│   │   ├── pages/
│   │   │   ├── MyAccount.tsx
│   │   │   ├── MyReports.tsx
│   │   │   ├── About.tsx
│   │   │   └── Support.tsx
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── Backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   └── responses.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── services/
│   │   │   └── supabaseClient.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── index.js
│   └── package.json
├── BackendPip/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── questions/
│   ├── norms/
│   └── requirements.txt
├── docker-compose.yml
└── supabase_schema.sql
```

## Backend Services Documentation

### Backend (Node.js) - Authentication & Data Service

The Node.js backend handles all authentication and data persistence operations.

#### Key Features:
- JWT-based authentication via Supabase
- Real-time response saving with RLS bypass
- Session management
- Progress tracking
- Rate limiting on auth endpoints

#### Service Configuration:
```javascript
// Uses Supabase Admin SDK for RLS bypass
const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

#### Critical Implementation Details:
1. **RLS Bypass**: All database operations use the admin client to bypass Row Level Security
2. **Cache Prevention**: All API responses include no-cache headers
3. **Error Handling**: Comprehensive error handling with Joi validation
4. **Session Management**: Tracks assessment sessions for progress restoration

### BackendPip (Python) - Assessment Processing Service

The Python backend handles all assessment logic and scoring calculations.

#### Key Features:
- Deterministic question shuffling with user seeds
- IRT-based scoring algorithms
- Factor mixture modeling
- Comprehensive result interpretation

#### Deterministic Shuffling Implementation:
```python
if request.user_seed:
    rng = random.Random(request.user_seed)
    rng.shuffle(primary)
    rng.shuffle(secondary)
    rng.shuffle(tertiary)
```

## Database Schema

### Tables

#### user_responses
```sql
CREATE TABLE user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id VARCHAR(20) NOT NULL,
  response_value INTEGER CHECK (response_value >= 1 AND response_value <= 7),
  selected_option CHAR(1) CHECK (selected_option IN ('a', 'b')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);
```

#### assessment_sessions
```sql
CREATE TABLE assessment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_responses INTEGER DEFAULT 0,
  last_question_index INTEGER DEFAULT 0
);
```

### Row Level Security (RLS)
- Both tables have RLS enabled
- Policy: `auth.uid() = user_id`
- Backend uses service role key to bypass RLS for server operations

## Authentication Flow

### Sign Up Flow
1. User enters email/password in SignupModal
2. Frontend calls Backend `/api/auth/signup`
3. Backend creates user via Supabase Auth
4. Session token returned and stored in AuthContext
5. Progress saving enabled automatically

### Sign In Flow
1. User enters credentials
2. Frontend calls Backend `/api/auth/login`
3. Session restored from Supabase
4. Previous progress loaded if exists

### Anonymous Flow
1. User clicks "Skip for Now"
2. Assessment proceeds without authentication
3. No progress saving available
4. Results only exist in browser memory

## API Documentation

See [API_REFERENCE.md](./API_REFERENCE.md) for complete endpoint documentation.

### Key Endpoints:

#### Backend (Node.js)
- `/api/auth/*` - Authentication endpoints
- `/api/user/*` - User management
- `/api/responses/*` - Response saving/loading

#### BackendPip (Python)
- `/api/start-assessment` - Get questions (with optional user seed)
- `/api/submit-assessment` - Calculate results

## Scoring Algorithms

### Big Five Scoring with IRT

#### Graded Response Model Implementation
```python
def irt_score(responses, discrimination, difficulty):
    theta_est = minimize(
        lambda theta: -log_likelihood(theta, responses, discrimination, difficulty),
        x0=0,
        bounds=[(-4, 4)]
    ).x[0]
    return theta_est
```

### MBTI Classification

#### Probabilistic Type Assignment
- Uses response patterns to calculate dimension probabilities
- Applies Bayesian inference for type classification
- Provides confidence scores for each preference

### Factor Mixture Modeling

#### Personality Clusters
1. Data standardization with StandardScaler
2. Gaussian Mixture Model with 5 components
3. Cluster assignment based on maximum posterior probability

## Data Flow

### Anonymous User Flow
```
1. Frontend → BackendPip: POST /api/start-assessment
2. BackendPip → Frontend: Shuffled questions
3. User answers questions (no saving)
4. Frontend → BackendPip: POST /api/submit-assessment
5. BackendPip → Frontend: Calculated results
```

### Authenticated User Flow
```
1. Frontend → Backend: GET /api/user/progress
2. Frontend → BackendPip: POST /api/start-assessment (with user_seed)
3. BackendPip → Frontend: Deterministically shuffled questions
4. Frontend → Backend: GET /api/responses/all
5. User answers questions
6. Frontend → Backend: POST /api/responses/save (debounced)
7. On completion: Frontend → BackendPip: POST /api/submit-assessment
8. Results displayed (not saved)
```

### Progress Restoration Flow
```
1. User returns to site
2. AuthContext checks session
3. Frontend → Backend: GET /api/user/progress
4. If progress exists: Button shows "Continue Your Journey"
5. On click: Questions loaded with same order
6. Saved responses restored to correct positions
```

## Component Architecture

### Core Components

#### AuthContext
- Global authentication state management
- Supabase client initialization
- Session persistence
- Auth state listeners

#### useResponseSaver Hook
```typescript
- Debounced saving (500ms)
- Queue management for offline scenarios
- Visual feedback integration
- Batch save support
```

#### Header Component
- Responsive navigation
- User avatar display
- Mobile menu support
- Route-based active states

#### SignupModal
- Email/password validation
- Password strength indicator
- Skip option with warning
- Login/Signup toggle

## State Management

### Global State (AuthContext)
```typescript
{
  user: User | null
  session: Session | null
  loading: boolean
  signUp: Function
  signIn: Function
  signOut: Function
  updateProfile: Function
}
```

### Assessment State
```typescript
{
  appState: 'landing' | 'instructions' | 'test' | 'processing' | 'results'
  questions: Question[]
  currentQuestionIndex: number
  responses: QuestionResponse[]
  hasActiveAssessment: boolean
}
```

### Response Saving State
```typescript
{
  saveQueue: Response[]
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
}
```

## Deployment Guide

### Environment Variables

#### Backend (.env)
```
NODE_ENV=production
PORT=8001
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_KEY=[service_key]  # Critical for RLS bypass
FRONTEND_URL=https://yourdomain.com
BACKEND_PIP_URL=http://backend-pip:8000
```

#### Frontend (.env)
```
REACT_APP_API_URL=https://api.yourdomain.com/assessment
REACT_APP_AUTH_API_URL=https://api.yourdomain.com/auth
REACT_APP_SUPABASE_URL=https://[project].supabase.co
REACT_APP_SUPABASE_ANON_KEY=[anon_key]
```

### Docker Deployment
```yaml
version: '3.8'
services:
  frontend:
    build: ./Frontend
    ports: ["3000:3000"]
    
  backend:
    build: ./Backend
    ports: ["8001:8001"]
    env_file: ./Backend/.env
    
  backend-pip:
    build: ./BackendPip
    ports: ["8000:8000"]
```

## Future Expansion Guide

### Adding New Question Types
1. Update `Question` model in both backends
2. Add new response type handling in Frontend components
3. Update validation schemas
4. Extend scoring algorithms

### Adding Social Features
1. Extend database schema for sharing
2. Add API endpoints for social interactions
3. Implement privacy controls
4. Update RLS policies

### Adding Export Functionality
1. Create PDF generation service
2. Add export endpoints
3. Implement result caching (temporary)
4. Add download UI components

### Performance Optimizations
1. Implement Redis for session caching
2. Add CDN for static assets
3. Optimize bundle splitting
4. Add service worker for offline support

## Security Considerations

### Authentication Security
- JWT tokens expire after 1 hour
- Refresh tokens handled automatically
- Service role key never exposed to frontend
- All passwords hashed by Supabase

### Data Security
- RLS policies enforce user isolation
- Admin operations use service role
- No sensitive data in frontend storage
- HTTPS required in production

### API Security
- Rate limiting on auth endpoints (5 requests/15 min)
- CORS configured for specific origins
- Helmet.js for security headers
- Input validation on all endpoints

## Troubleshooting Guide

### Common Issues

#### RLS Policy Violations
- Ensure SUPABASE_SERVICE_KEY is set
- Check that admin client is used for operations
- Verify user_id matches authenticated user

#### Progress Not Loading
- Check cache headers are disabled
- Verify user has active session
- Ensure responses exist in database

#### Question Order Inconsistent
- Verify user_seed is being passed
- Check deterministic shuffle implementation
- Ensure same user ID used across sessions

#### Batch Save Failures
- Check response format matches schema
- Verify no duplicate question IDs
- Ensure user is authenticated