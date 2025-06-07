# Comprehensive Personality Assessment

A modern, scientifically-grounded personality assessment application that integrates Big Five traits, MBTI preferences, and Jungian depth psychology to provide users with a complete personality profile.

## 🎯 Key Features

### Assessment Structure
- **200 Scientifically-Validated Questions**
  - Primary Layer: 120 Big Five questions (Likert scale)
  - Secondary Layer: 50 MBTI preference questions (forced choice)
  - Tertiary Layer: 30 Jungian depth questions
- **Shuffled Within Layers**: Maintains assessment integrity while reducing order effects
- **Multi-Format Questions**: Likert scales, forced choice, and depth assessments

### Advanced Psychometrics
- **Item Response Theory (IRT)**: Graded Response Model for precise trait measurement
- **Factor Mixture Modeling**: Identifies natural personality clusters
- **Confidence Intervals**: 95% CIs for all trait scores
- **Cross-Loading Analysis**: Questions contribute to multiple dimensions

### Comprehensive Results
- **Big Five Traits**: Scores, percentiles, and facet analysis
- **MBTI Classification**: Type with probability estimates
- **Cognitive Functions**: Jungian function stack with development levels
- **Personality Clusters**: Statistical clustering (Resilient, Overcontrolled, etc.)
- **Depth Psychology**: Shadow integration, archetypes, individuation stage
- **Personalized Development**: Tailored growth suggestions

### Privacy & Architecture
- **Optional Account System**: Create an account to save progress or use anonymously
- **Progress Saving**: Automatic real-time saving for logged-in users
- **Secure Authentication**: Powered by Supabase with industry-standard security
- **GDPR Compliant**: Full control over your data with ability to delete anytime
- **Three-Service Architecture**: 
  - Frontend (React) - User interface
  - Backend (Node.js) - Authentication & data persistence
  - BackendPip (Python) - Assessment processing & scoring

## 🚀 Quick Start

### Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)

2. **Database Setup**: 
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the contents of `supabase_schema.sql`
   - This creates tables with proper RLS policies

3. **Environment Variables**: 
   ```bash
   # Backend/.env
   NODE_ENV=development
   PORT=8001
   SUPABASE_URL=https://[your-project].supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key  # Important: Service role key for RLS bypass
   FRONTEND_URL=http://localhost:3000
   BACKEND_PIP_URL=http://localhost:8000
   
   # Frontend/.env
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_AUTH_API_URL=http://localhost:8001/api
   REACT_APP_SUPABASE_URL=https://[your-project].supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd PersonalitiesTwo

# Configure environment variables
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
# Edit both .env files with your Supabase credentials

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# BackendPip API: http://localhost:8000/docs
# Backend API: http://localhost:8001
```

### Manual Setup

#### Backend Services

**BackendPip (Python/FastAPI) - Assessment Logic:**
```bash
cd BackendPip

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend (Node.js/Express) - Authentication & Data:**
```bash
cd Backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev  # or npm start for production
```

#### Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## 🏗️ Architecture

The application follows a microservices architecture with three main components:

1. **Frontend (React/TypeScript)**: User interface with optional authentication
2. **Backend (Node.js/Express)**: Handles authentication, user management, and data persistence via Supabase
3. **BackendPip (Python/FastAPI)**: Processes assessments and generates results using scientific algorithms

### Data Flow
- **Anonymous users**: Frontend → BackendPip (direct assessment processing)
- **Authenticated users**: 
  - Progress saving: Frontend → Backend → Supabase
  - Assessment loading: Frontend → BackendPip (with user seed for consistent order)
  - Results generation: Backend fetches saved responses → BackendPip for calculation
- **Key Features**:
  - Results are never stored, only raw responses
  - Deterministic question shuffling for returning users
  - Real-time auto-save with visual feedback
  - Resume from any point in the assessment

## 📁 Project Structure

```
PersonalitiesTwo/
├── Backend/                     # Node.js authentication & data service
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.js          # Authentication endpoints
│   │   │   ├── user.js          # User management
│   │   │   └── responses.js     # Response saving/loading
│   │   ├── middleware/          # Express middleware
│   │   ├── services/            # Business logic
│   │   └── index.js             # Server entry point
│   ├── package.json
│   └── Dockerfile
├── BackendPip/                  # Python assessment processing service
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models/              # Pydantic data models
│   │   │   └── assessment.py    # Assessment types
│   │   ├── routers/             # API endpoints
│   │   │   └── assessment.py    # Assessment routes
│   │   └── services/            # Business logic
│   │       ├── scoring.py       # Scoring algorithms
│   │       └── interpretation.py # Result interpretation
│   ├── questions/               # Question bank
│   │   └── questions.json       # 200 assessment items
│   ├── norms/                   # Statistical norms
│   │   └── norm_data.json       # Population statistics
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile
├── Frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── QuestionDisplay.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── results/         # Result visualizations
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utilities
│   │   └── App.tsx              # Main component
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml           # Container orchestration
└── Documentation/
    ├── TECHNICAL_DOCUMENTATION.md # Architecture guide
    ├── API_REFERENCE.md         # API documentation
    ├── SCORING_ALGORITHMS.md    # Scoring details
    └── DEPLOYMENT_GUIDE.md      # Deployment instructions
```

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Scientific Computing**: NumPy, SciPy, scikit-learn
- **Data Validation**: Pydantic
- **ASGI Server**: Uvicorn

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks (no Redux)
- **HTTP Client**: Native Fetch API

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (frontend)
- **Load Balancing**: Nginx (optional)

## 📖 Documentation

- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)**: Complete architecture and implementation guide
- **[API Reference](API_REFERENCE.md)**: Detailed API endpoint documentation
- **[Scoring Algorithms](SCORING_ALGORITHMS.md)**: In-depth scoring methodology
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)**: Production deployment instructions
- **[Framework](Framework.md)**: Theoretical foundation and research basis
- **[MVP Build Plan](MVPBuildPlan.md)**: Original technical specifications

## 🔧 Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- Git

### Environment Setup

```bash
# Backend development
cd Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend development
cd Frontend
npm install
```

### Running Tests

```bash
# Backend tests
cd Backend
pytest tests/

# Frontend tests
cd Frontend
npm test
```

### Code Quality

```bash
# Backend linting
flake8 app/
mypy app/

# Frontend linting
npm run lint
npm run type-check
```

## 🚀 Deployment

### Production Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on:
- AWS ECS deployment
- Google Cloud Run deployment
- Kubernetes deployment
- Traditional VPS deployment

### Environment Variables

**Backend:**
```env
PYTHONUNBUFFERED=1
LOG_LEVEL=INFO
WORKERS=4
CORS_ORIGINS=https://yourdomain.com
```

**Frontend:**
```env
REACT_APP_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 🔒 Security & Privacy

### Core Principles
1. **No Data Storage**: All processing happens in-memory
2. **No User Tracking**: No analytics, cookies, or identification
3. **Stateless Design**: No sessions or persistent state
4. **Open Source**: Full transparency of algorithms

### Security Features
- Input validation on all endpoints
- CORS properly configured
- Rate limiting ready (configure in production)
- No external dependencies for core functionality

## 📊 Scientific Validity

### Psychometric Properties
- **Reliability**: Cronbach's α > 0.80 for Big Five scales
- **Validity**: Based on established research correlations
- **Norms**: Statistical comparison with population data
- **Confidence**: 95% confidence intervals on all scores

### Research Foundation
- Big Five model (Costa & McCrae)
- MBTI correlations (McCrae & Costa, 1989)
- Jungian cognitive functions (theoretical)
- Personality clusters (Robins et al., 2001)

## 🤝 Contributing

While this is primarily an educational project, contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Maintain the privacy-first approach
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure scientific validity

## 📝 License

This project is for educational and personal use. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Big Five research by Costa & McCrae
- MBTI framework by Myers & Briggs
- Jungian psychology concepts
- Open-source psychometric tools
- React and FastAPI communities

## ⚠️ Disclaimer

This assessment tool is for educational and self-reflection purposes only. It is not a diagnostic tool and should not be used for clinical or professional psychological assessment. For professional psychological evaluation, please consult a licensed psychologist or mental health professional.

## 📞 Support

For questions or issues:
- Review the [documentation](TECHNICAL_DOCUMENTATION.md)
- Check [existing issues](https://github.com/yourusername/PersonalitiesTwo/issues)
- Create a new issue with detailed information

---

**Remember**: Your personality is complex and multifaceted. This tool provides one perspective based on established psychological research, but you are more than any test can measure.