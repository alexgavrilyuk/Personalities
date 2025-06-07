# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the design and implementation plan for a personality assessment application that integrates Big Five, MBTI, and Jungian depth psychology. The application provides users with a scientifically-grounded personality assessment without any user accounts, data persistence, or social features.

## Key Architecture Decisions

### Technology Stack
- **Backend**: Python 3.10+ with FastAPI
- **Frontend**: React with Tailwind CSS (minimal setup, no Redux)
- **Key Libraries**: NumPy, SciPy, scikit-learn for statistical calculations and IRT models
- **No Database**: All processing is in-memory during the session only

### Critical Constraints
- Optional user authentication (works for both anonymous and authenticated users)
- Response data persisted for authenticated users only
- NO social features, sharing, or networking
- NO unnecessary UI complexity
- Simple flow: Take test → Get results (with optional progress saving)

### Assessment Structure
- 200 total questions divided into three layers:
  - Primary: 120 Big Five questions (Likert scale)
  - Secondary: 50 MBTI preference questions (forced choice)
  - Tertiary: 30 Jungian depth questions
- Questions must be shuffled within layers but maintain layer order
- Scoring uses Item Response Theory (IRT) and factor mixture modeling

## Common Development Tasks

### Backend Development

1. **Setup and Running:**
   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Testing:**
   ```bash
   pytest tests/
   pytest tests/ -v --cov=app  # With coverage
   ```

3. **Code Quality:**
   ```bash
   flake8 app/
   mypy app/
   black app/  # Format code
   ```

### Frontend Development

1. **Setup and Running:**
   ```bash
   cd Frontend
   npm install
   npm start  # Development server on http://localhost:3000
   ```

2. **Building:**
   ```bash
   npm run build  # Production build
   npm run analyze  # Bundle analysis
   ```

3. **Testing and Linting:**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

### Docker Operations

1. **Development:**
   ```bash
   docker-compose up -d  # Start services
   docker-compose logs -f  # View logs
   docker-compose down  # Stop services
   ```

2. **Production Build:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Project Structure

### Documentation
- `Framework.md` - Comprehensive theoretical foundation and research backing
- `MVPBuildPlan.md` - Original technical implementation specifications
- `TECHNICAL_DOCUMENTATION.md` - Complete architecture and implementation guide
- `API_REFERENCE.md` - Detailed API endpoint documentation
- `SCORING_ALGORITHMS.md` - In-depth scoring methodology
- `DEPLOYMENT_GUIDE.md` - Production deployment instructions

### Implementation
- `Backend/` - FastAPI application with scoring algorithms
  - `app/main.py` - Application entry point
  - `app/models/` - Pydantic data models
  - `app/routers/` - API endpoints
  - `app/services/` - Business logic (scoring, interpretation)
  - `questions/` - 200-question assessment bank
  - `norms/` - Statistical norm data
- `Frontend/` - React TypeScript application
  - `src/components/` - UI components
  - `src/types/` - TypeScript definitions
  - `src/utils/` - API client and helpers

## Important Implementation Notes

1. **Scoring Algorithms**: All scoring must follow the exact specifications in MVPBuildPlan.md, including IRT-based scoring, factor mixture modeling, and confidence interval calculations

2. **Question Structure**: Each question must follow the JSON structure specified, including factor loadings and proper categorization

3. **No Data Persistence**: Results are calculated and returned to the frontend but never stored. Page refresh loses all data by design.

4. **Statistical Validity**: Use double precision floats, bootstrap confidence intervals with 1000 iterations, and Bonferroni correction for multiple comparisons

## Current Implementation Status

### ✅ Completed Features
- Full 200-question assessment system
- Big Five scoring with IRT implementation
- MBTI type classification with probabilities
- Cognitive function stack determination
- Personality cluster analysis
- Jungian depth assessment
- Comprehensive result interpretation
- Mobile-responsive UI with multiple question display
- Docker containerization
- Complete API implementation
- User authentication with Supabase
- Progress saving and restoration
- Multiple assessment type support (future-proofed)
- Simple completion tracking system

### 🚧 Future Enhancements (Not Implemented)
- Additional assessment types (relationships, career, etc.)
- Integrated reports combining multiple assessments
- Export functionality (PDF/JSON)
- Multi-language support
- Advanced visualizations
- Accessibility improvements (WCAG compliance)

## API Endpoints

### BackendPip (Python)
1. **POST /api/start-assessment**
   - Returns shuffled questions
   - Accepts optional user_seed for deterministic ordering

2. **POST /api/submit-assessment**
   - Processes responses
   - Returns complete results
   - Minimum 160 responses required

### Backend (Node.js)
1. **GET /api/user/progress?assessmentType=core**
   - Returns current progress for specified assessment type

2. **GET /api/user/completions**
   - Returns list of completed assessments

3. **GET /api/user/report/:assessmentType**
   - Generates report for completed assessment

4. **POST /api/responses/batch**
   - Saves multiple responses with assessment_type

## Environment Variables

**Backend:**
- `PYTHONUNBUFFERED=1` (always set)
- `LOG_LEVEL=INFO` (default)
- `WORKERS=1` (development) or `4` (production)

**Frontend:**
- `REACT_APP_API_URL=http://localhost:8000/api` (default)
- Update for production deployment