from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import assessment, teams, premium
import uvicorn

app = FastAPI(
    title="Personality Assessment API",
    description="Comprehensive personality assessment integrating Big Five, MBTI, and Jungian psychology with premium features",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for network access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(assessment.router, prefix="/api", tags=["assessment"])
app.include_router(teams.router, prefix="/api", tags=["teams"])
app.include_router(premium.router, prefix="/api/premium", tags=["premium"])

@app.get("/")
async def root():
    return {"message": "Personality Assessment API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)