# Deployment and Operations Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Environment](#development-environment)
3. [Docker Configuration](#docker-configuration)
4. [Production Deployment](#production-deployment)
5. [Environment Variables](#environment-variables)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Performance Optimization](#performance-optimization)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd PersonalitiesTwo

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
```

### Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (caution: removes any cached data)
docker-compose down -v
```

## Development Environment

### Backend Setup (Without Docker)

```bash
cd Backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup (Without Docker)

```bash
cd Frontend

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

### Development Tools

**Backend:**
- Python 3.10+
- pip for package management
- Virtual environment recommended

**Frontend:**
- Node.js 18+
- npm or yarn
- React Developer Tools (browser extension)

## Docker Configuration

### Backend Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./Backend
      dockerfile: Dockerfile
    container_name: personality-backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
      - LOG_LEVEL=INFO
    volumes:
      - ./Backend/questions:/app/questions:ro
      - ./Backend/norms:/app/norms:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: personality-frontend
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api
    restart: unless-stopped

networks:
  default:
    name: personality-network
    driver: bridge
```

### Nginx Configuration

```nginx
server {
    listen 3000;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Production Deployment

### Cloud Deployment Options

#### AWS Deployment

**Using ECS (Elastic Container Service):**

```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ECR_URI]

docker build -t personality-backend ./Backend
docker tag personality-backend:latest [ECR_URI]/personality-backend:latest
docker push [ECR_URI]/personality-backend:latest

docker build -t personality-frontend ./Frontend
docker tag personality-frontend:latest [ECR_URI]/personality-frontend:latest
docker push [ECR_URI]/personality-frontend:latest
```

**Task Definition Example:**
```json
{
  "family": "personality-app",
  "taskRoleArn": "arn:aws:iam::123456789:role/ecsTaskRole",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsExecutionRole",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "[ECR_URI]/personality-backend:latest",
      "memory": 512,
      "cpu": 256,
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PYTHONUNBUFFERED",
          "value": "1"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    },
    {
      "name": "frontend",
      "image": "[ECR_URI]/personality-frontend:latest",
      "memory": 256,
      "cpu": 128,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "REACT_APP_API_URL",
          "value": "https://api.yourdomain.com"
        }
      ]
    }
  ]
}
```

#### Google Cloud Run Deployment

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/[PROJECT_ID]/personality-backend ./Backend
gcloud builds submit --tag gcr.io/[PROJECT_ID]/personality-frontend ./Frontend

# Deploy backend
gcloud run deploy personality-backend \
  --image gcr.io/[PROJECT_ID]/personality-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="PYTHONUNBUFFERED=1"

# Deploy frontend
gcloud run deploy personality-frontend \
  --image gcr.io/[PROJECT_ID]/personality-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="REACT_APP_API_URL=https://personality-backend-xyz.run.app/api"
```

#### Kubernetes Deployment

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: personality-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: personality-backend
  template:
    metadata:
      labels:
        app: personality-backend
    spec:
      containers:
      - name: backend
        image: personality-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: PYTHONUNBUFFERED
          value: "1"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: personality-backend
spec:
  selector:
    app: personality-backend
  ports:
    - protocol: TCP
      port: 8000
      targetPort: 8000
  type: ClusterIP
```

### Load Balancing

**Nginx Load Balancer Configuration:**

```nginx
upstream backend {
    least_conn;
    server backend1:8000 weight=1 max_fails=3 fail_timeout=30s;
    server backend2:8000 weight=1 max_fails=3 fail_timeout=30s;
    server backend3:8000 weight=1 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Production |
|----------|-------------|---------|------------|
| PYTHONUNBUFFERED | Disable output buffering | 1 | 1 |
| LOG_LEVEL | Logging level | INFO | WARNING |
| WORKERS | Number of Uvicorn workers | 1 | 4-8 |
| HOST | Bind host | 0.0.0.0 | 0.0.0.0 |
| PORT | Bind port | 8000 | 8000 |
| CORS_ORIGINS | Allowed CORS origins | * | https://yourdomain.com |

### Frontend Environment Variables

| Variable | Description | Default | Production |
|----------|-------------|---------|------------|
| REACT_APP_API_URL | Backend API URL | http://localhost:8000/api | https://api.yourdomain.com/api |
| NODE_ENV | Node environment | development | production |
| GENERATE_SOURCEMAP | Generate source maps | true | false |

## Monitoring and Logging

### Application Metrics

**Backend Metrics to Monitor:**
- Request rate and latency
- Error rate (4xx, 5xx)
- CPU and memory usage
- Question loading time
- Scoring calculation time

**Frontend Metrics to Monitor:**
- Page load time
- API response times
- JavaScript errors
- Bundle size
- User completion rate

### Logging Configuration

**Backend Logging:**

```python
# app/utils/logging.py
import logging
import sys
from logging.handlers import RotatingFileHandler

def setup_logging(log_level="INFO"):
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, log_level))
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(
        logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    )
    logger.addHandler(console_handler)
    
    # File handler for production
    if os.getenv("ENV") == "production":
        file_handler = RotatingFileHandler(
            'app.log',
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(
            logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
        )
        logger.addHandler(file_handler)
```

### Health Checks

**Backend Health Check Endpoint:**

```python
@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    try:
        # Check if questions are loaded
        questions_loaded = len(scoring_service.questions) > 0
        
        # Check if norms are loaded
        norms_loaded = len(scoring_service.norms) > 0
        
        if questions_loaded and norms_loaded:
            return {
                "status": "healthy",
                "questions_loaded": questions_loaded,
                "norms_loaded": norms_loaded,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            return JSONResponse(
                status_code=503,
                content={"status": "unhealthy", "reason": "Data not loaded"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )
```

## Performance Optimization

### Backend Optimization

**1. Caching Static Data:**

```python
from functools import lru_cache

@lru_cache(maxsize=1)
def load_questions():
    """Cache questions in memory"""
    with open('questions/questions.json', 'r') as f:
        return json.load(f)

@lru_cache(maxsize=1)
def load_norms():
    """Cache norm data in memory"""
    with open('norms/norm_data.json', 'r') as f:
        return json.load(f)
```

**2. Async Processing:**

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)

async def process_assessment_async(responses):
    loop = asyncio.get_event_loop()
    
    # Run CPU-intensive tasks in thread pool
    tasks = [
        loop.run_in_executor(executor, calculate_big_five_scores, responses),
        loop.run_in_executor(executor, calculate_mbti_type, responses),
        loop.run_in_executor(executor, calculate_cognitive_functions, responses)
    ]
    
    results = await asyncio.gather(*tasks)
    return combine_results(results)
```

**3. Response Compression:**

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### Frontend Optimization

**1. Code Splitting:**

```typescript
// Lazy load result components
const ResultsDisplay = React.lazy(() => import('./components/ResultsDisplay'));

// Use with Suspense
<Suspense fallback={<LoadingScreen />}>
  <ResultsDisplay results={results} />
</Suspense>
```

**2. Bundle Optimization:**

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
```

**3. Asset Optimization:**

```bash
# Optimize images
find ./public -name "*.png" -exec pngquant --quality=80-90 {} \;

# Enable Brotli compression in nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/javascript application/json;
```

### Database Optimization (Future)

If persistence is added:

```sql
-- Indexes for common queries
CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_results_created_at ON results(created_at);

-- Partitioning for large tables
CREATE TABLE responses_2024 PARTITION OF responses
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

## Security Considerations

### API Security

**1. Rate Limiting:**

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per minute"]
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/submit-assessment")
@limiter.limit("10 per minute")
async def submit_assessment(request: Request, submission: AssessmentSubmission):
    # Process assessment
```

**2. Input Validation:**

```python
from pydantic import validator

class QuestionResponse(BaseModel):
    question_id: str
    response_value: Optional[int] = None
    selected_option: Optional[str] = None
    
    @validator('response_value')
    def validate_response_value(cls, v):
        if v is not None and not 1 <= v <= 7:
            raise ValueError('Response value must be between 1 and 7')
        return v
    
    @validator('selected_option')
    def validate_selected_option(cls, v):
        if v is not None and v not in ['a', 'b']:
            raise ValueError('Selected option must be "a" or "b"')
        return v
```

**3. CORS Configuration:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins only
    allow_credentials=False,  # No credentials needed
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
    max_age=3600
)
```

### Infrastructure Security

**1. Container Security:**

```dockerfile
# Run as non-root user
RUN adduser -D appuser
USER appuser

# Scan for vulnerabilities
# docker scan personality-backend
```

**2. Network Security:**

```yaml
# docker-compose.yml
services:
  backend:
    networks:
      - internal
      - public
  
  frontend:
    networks:
      - public

networks:
  internal:
    internal: true
  public:
    external: true
```

**3. Secret Management:**

```bash
# Use Docker secrets for sensitive data
docker secret create api_key api_key.txt

# Reference in compose
services:
  backend:
    secrets:
      - api_key
    environment:
      - API_KEY_FILE=/run/secrets/api_key
```

## Troubleshooting

### Common Issues

**1. Backend Won't Start**

```bash
# Check logs
docker logs personality-backend

# Common solutions:
# - Ensure Python 3.10+ is installed
# - Check file permissions on questions/norms directories
# - Verify all dependencies in requirements.txt
```

**2. Frontend Can't Connect to Backend**

```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS settings
# Ensure REACT_APP_API_URL is set correctly
# Check network connectivity between containers
```

**3. High Memory Usage**

```python
# Monitor memory usage
import psutil

@app.get("/metrics")
async def get_metrics():
    process = psutil.Process()
    return {
        "memory_mb": process.memory_info().rss / 1024 / 1024,
        "cpu_percent": process.cpu_percent(),
        "threads": process.num_threads()
    }
```

### Debug Mode

**Enable Debug Logging:**

```python
# Backend
LOG_LEVEL=DEBUG uvicorn app.main:app --reload

# Frontend
REACT_APP_DEBUG=true npm start
```

**API Request Logging:**

```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response
```

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check health endpoints
- Review performance metrics

**Weekly:**
- Update dependencies (security patches)
- Backup question/norm data
- Review resource usage

**Monthly:**
- Full system test
- Performance benchmarking
- Security audit

### Update Procedures

**1. Zero-Downtime Deployment:**

```bash
# Blue-Green deployment
docker-compose -f docker-compose.blue.yml up -d
# Test blue environment
# Switch traffic to blue
docker-compose -f docker-compose.green.yml down
```

**2. Database Migrations (Future):**

```python
# Using Alembic
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

**3. Dependency Updates:**

```bash
# Backend
pip list --outdated
pip-compile --upgrade requirements.in

# Frontend
npm outdated
npm update --save
```

### Backup Procedures

**Static Data Backup:**

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/${DATE}"

mkdir -p ${BACKUP_DIR}

# Backup questions and norms
cp -r Backend/questions ${BACKUP_DIR}/
cp -r Backend/norms ${BACKUP_DIR}/

# Compress
tar -czf ${BACKUP_DIR}.tar.gz ${BACKUP_DIR}
rm -rf ${BACKUP_DIR}

# Keep last 30 days of backups
find /backups -name "*.tar.gz" -mtime +30 -delete
```

This deployment guide provides comprehensive instructions for deploying, monitoring, and maintaining the personality assessment application in various environments while ensuring optimal performance and security.