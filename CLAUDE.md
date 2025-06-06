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
- NO user authentication or account management
- NO data persistence beyond the current session  
- NO social features, sharing, or networking
- NO unnecessary UI complexity
- ONLY: Take test → Get results

### Assessment Structure
- 200 total questions divided into three layers:
  - Primary: 120 Big Five questions (Likert scale)
  - Secondary: 50 MBTI preference questions (forced choice)
  - Tertiary: 30 Jungian depth questions
- Questions must be shuffled within layers but maintain layer order
- Scoring uses Item Response Theory (IRT) and factor mixture modeling

## Common Development Tasks

Since this is currently a design document repository with no implementation yet, there are no build or test commands. When implementation begins:

1. Backend setup will likely involve:
   - `pip install -r requirements.txt`
   - `uvicorn main:app --reload` for running the FastAPI server

2. Frontend setup will likely involve:
   - `npm install`
   - `npm start` for development server

3. Testing approach should follow the specifications in MVPBuildPlan.md

## Project Structure

- `Framework.md` - Comprehensive theoretical foundation and research backing
- `MVPBuildPlan.md` - Detailed technical implementation specifications
- Future implementation will follow the structure outlined in MVPBuildPlan.md

## Important Implementation Notes

1. **Scoring Algorithms**: All scoring must follow the exact specifications in MVPBuildPlan.md, including IRT-based scoring, factor mixture modeling, and confidence interval calculations

2. **Question Structure**: Each question must follow the JSON structure specified, including factor loadings and proper categorization

3. **No Data Persistence**: Results are calculated and returned to the frontend but never stored. Page refresh loses all data by design.

4. **Statistical Validity**: Use double precision floats, bootstrap confidence intervals with 1000 iterations, and Bonferroni correction for multiple comparisons