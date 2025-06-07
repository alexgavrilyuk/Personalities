# Deployment and Operations Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Supabase Setup](#supabase-setup)
3. [Development Environment](#development-environment)
4. [Docker Configuration](#docker-configuration)
5. [Production Deployment](#production-deployment)
6. [Environment Variables](#environment-variables)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Performance Optimization](#performance-optimization)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

## Quick Start

### Prerequisites

1. Docker and Docker Compose installed
2. Supabase account (free tier works)
3. Git

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd PersonalitiesTwo

# Copy environment files
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env

# Edit .env files with your Supabase credentials
# See Environment Variables section for details

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8001
# BackendPip API: http://localhost:8000
```

### Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (caution: removes any cached data)
docker-compose down -v
```

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Save your project URL and keys

### 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Copy contents of `supabase_schema.sql`
4. Run query

### 3. Get Required Keys

From Settings → API:
- `anon` public key - for Frontend
- `service_role` secret key - for Backend (keeps this secure!)

### 4. Configure Authentication

1. Go to Authentication → Settings
2. Enable Email provider
3. Configure email templates (optional)
4. Set site URL to your domain

## Development Environment

### BackendPip Setup (Python - Without Docker)

```bash
cd BackendPip

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Backend Setup (Node.js - Without Docker)

```bash
cd Backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Setup (Without Docker)

```bash
cd Frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URLs and Supabase credentials

# Run development server
npm start

# Build for production
npm run build
```

## Docker Configuration

### docker-compose.yml Structure

```yaml
version: '3.8'

services:
  backend-pip:
    build: ./BackendPip
    container_name: personality-backend-pip
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./BackendPip/questions:/app/questions:ro
      - ./BackendPip/norms:/app/norms:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]

  backend:
    build: ./Backend
    container_name: personality-backend-node
    ports:
      - "8001:8001"
    environment:
      - NODE_ENV=development
      # Supabase vars loaded from .env file
    depends_on:
      - backend-pip
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]

  frontend:
    build: ./Frontend
    container_name: personality-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
      - backend-pip
    environment:
      # React app vars loaded from .env file
```

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build frontend

# Build with no cache
docker-compose build --no-cache
```

## Production Deployment

### Option 1: Single Server Deployment

1. **Server Requirements**
   - 2GB+ RAM
   - 2+ CPU cores
   - 20GB+ storage
   - Ubuntu 20.04+ or similar

2. **Setup Steps**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com | sh
   
   # Install Docker Compose
   sudo apt install docker-compose
   
   # Clone repository
   git clone <repository-url>
   cd PersonalitiesTwo
   
   # Configure production environment
   cp Backend/.env.example Backend/.env.production
   cp Frontend/.env.example Frontend/.env.production
   # Edit with production values
   
   # Use production docker-compose
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 2: Cloud Platform Deployment

#### AWS ECS/Fargate

1. **Create ECR repositories**
   ```bash
   aws ecr create-repository --repository-name personality/frontend
   aws ecr create-repository --repository-name personality/backend
   aws ecr create-repository --repository-name personality/backend-pip
   ```

2. **Push images**
   ```bash
   # Build and tag
   docker build -t personality/frontend ./Frontend
   
   # Push to ECR
   docker tag personality/frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/personality/frontend:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/personality/frontend:latest
   ```

3. **Deploy with ECS**
   - Create task definitions for each service
   - Configure service discovery
   - Set up Application Load Balancer

#### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT-ID/personality-frontend ./Frontend
gcloud builds submit --tag gcr.io/PROJECT-ID/personality-backend ./Backend
gcloud builds submit --tag gcr.io/PROJECT-ID/personality-backend-pip ./BackendPip

# Deploy services
gcloud run deploy personality-frontend --image gcr.io/PROJECT-ID/personality-frontend
gcloud run deploy personality-backend --image gcr.io/PROJECT-ID/personality-backend
gcloud run deploy personality-backend-pip --image gcr.io/PROJECT-ID/personality-backend-pip
```

### Option 3: Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (if available).

## Environment Variables

### Backend (Node.js) Environment Variables

```bash
# Backend/.env

# Server Configuration
NODE_ENV=production
PORT=8001

# Supabase Configuration
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=eyJ...  # Your anon key
SUPABASE_SERVICE_KEY=eyJ...  # Your service role key (KEEP SECRET!)

# Service URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_PIP_URL=http://backend-pip:8000  # Use container name in Docker

# Optional
LOG_LEVEL=info
```

### Frontend Environment Variables

```bash
# Frontend/.env

# API URLs
REACT_APP_API_URL=https://api.yourdomain.com/assessment
REACT_APP_AUTH_API_URL=https://api.yourdomain.com/auth

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://[your-project].supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...  # Your anon key

# Optional
REACT_APP_ENVIRONMENT=production
```

### BackendPip Environment Variables

```bash
# BackendPip/.env (if needed)

# Server Configuration
PYTHONUNBUFFERED=1
LOG_LEVEL=INFO
WORKERS=4  # For production
```

## Monitoring and Logging

### Docker Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f

# Tail last 100 lines
docker-compose logs --tail=100
```

### Production Logging

1. **Centralized Logging**
   ```yaml
   # docker-compose.prod.yml addition
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

2. **External Logging Services**
   - CloudWatch (AWS)
   - Stackdriver (GCP)
   - ELK Stack
   - Datadog

### Health Checks

All services expose health endpoints:
- Frontend: `http://localhost:3000/` (200 OK)
- Backend: `http://localhost:8001/health`
- BackendPip: `http://localhost:8000/health`

## Performance Optimization

### Frontend Optimization

1. **Build Optimization**
   ```bash
   # Analyze bundle size
   npm run build
   npm run analyze
   ```

2. **Nginx Configuration**
   ```nginx
   # Enable gzip compression
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   
   # Cache static assets
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

### Backend Optimization

1. **Node.js Backend**
   ```javascript
   // Use PM2 for production
   pm2 start src/index.js -i max
   ```

2. **Python Backend**
   ```bash
   # Use Gunicorn with Uvicorn workers
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Database Optimization

1. **Connection Pooling**
   - Supabase handles this automatically
   - Monitor connection count in dashboard

2. **Query Optimization**
   - Use indexes (already configured)
   - Monitor slow queries in Supabase dashboard

## Security Considerations

### HTTPS Configuration

1. **Using Certbot**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. **Using Cloudflare**
   - Add domain to Cloudflare
   - Enable SSL/TLS
   - Set encryption mode to "Full (strict)"

### Security Headers

Add to Nginx configuration:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
```

### API Security

1. **Rate Limiting** (already configured)
2. **CORS Configuration** (update for production domains)
3. **Environment Variables** (never commit secrets)
4. **Service Role Key** (keep secure, never expose to frontend)

## Troubleshooting

### Common Issues

#### 1. Services Not Starting

```bash
# Check logs
docker-compose logs [service-name]

# Check if ports are in use
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :8001

# Restart services
docker-compose restart
```

#### 2. Database Connection Issues

- Verify Supabase URL and keys
- Check if service role key is set for Backend
- Ensure RLS policies are correct

#### 3. CORS Errors

- Update CORS origins in Backend services
- Ensure Frontend URLs are whitelisted

#### 4. Memory Issues

```bash
# Check memory usage
docker stats

# Increase memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
```

### Debug Mode

Enable debug logging:
```bash
# Backend
LOG_LEVEL=debug npm start

# BackendPip
LOG_LEVEL=DEBUG uvicorn app.main:app
```

## Maintenance

### Regular Tasks

1. **Update Dependencies**
   ```bash
   # Backend
   npm update
   npm audit fix
   
   # Frontend
   npm update
   npm audit fix
   
   # BackendPip
   pip install --upgrade -r requirements.txt
   ```

2. **Database Maintenance**
   - Monitor table sizes in Supabase
   - Archive old sessions if needed
   - Review slow query logs

3. **Backup Procedures**
   - Supabase provides automatic backups
   - Download backups regularly for critical data

### Scaling Considerations

1. **Horizontal Scaling**
   - Add more Backend/BackendPip instances
   - Use load balancer
   - Ensure session affinity if needed

2. **Vertical Scaling**
   - Increase container resources
   - Upgrade Supabase plan if needed

3. **CDN Integration**
   - Serve Frontend through CDN
   - Cache API responses where appropriate

### Monitoring Checklist

- [ ] All services healthy
- [ ] Response times < 500ms
- [ ] Error rate < 1%
- [ ] Database connections stable
- [ ] Disk usage < 80%
- [ ] Memory usage < 80%
- [ ] SSL certificates valid