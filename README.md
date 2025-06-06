# Comprehensive Personality Assessment

A modern, scientifically-grounded personality assessment application that integrates Big Five traits, MBTI preferences, and Jungian depth psychology to provide users with a complete personality profile.

## Features

- **200 Question Assessment**: Carefully crafted questions across three layers:
  - Primary: Big Five personality traits (120 questions)
  - Secondary: MBTI-style preferences (50 questions)  
  - Tertiary: Jungian depth psychology (30 questions)

- **Advanced Scoring**: Uses Item Response Theory (IRT) and factor mixture modeling for accurate results

- **Beautiful Visualizations**: Modern, mobile-first design with interactive charts and insights

- **Comprehensive Results**: Includes Big Five scores, MBTI type, cognitive functions, personality clusters, and personalized development suggestions

- **Privacy-First**: No user accounts or data storage - all processing happens in real-time

## Technology Stack

- **Backend**: Python/FastAPI with NumPy, SciPy, scikit-learn
- **Frontend**: React/TypeScript with Tailwind CSS
- **Deployment**: Docker & Docker Compose

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Personalities

# Start the application
docker-compose up

# Access the app at http://localhost:3000
```

### Manual Setup

#### Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd Frontend
npm install
npm start
```

## Project Structure

```
Personalities/
├── Backend/                # FastAPI backend
│   ├── app/               # Application code
│   ├── questions/         # Question bank (200 questions)
│   └── norms/            # Pre-computed norm data
├── Frontend/              # React frontend
│   ├── src/              # Source code
│   └── public/           # Static assets
└── docker-compose.yml    # Docker configuration
```

## Key Constraints

- No user authentication or accounts
- No data persistence beyond the current session
- No social features or sharing
- Minimal, focused UI - just take test → get results

## Development

See `CLAUDE.md` for detailed development guidelines and architecture decisions.

## License

This project is for educational and personal use only.