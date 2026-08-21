# Gym Management SaaS

A production-ready, multi-tenant Gym Management platform built with React, TypeScript, FastAPI, and Supabase.

## Architecture

```
React + TypeScript Frontend
         │
         │ HTTPS / REST API
         ▼
     FastAPI Backend
         │
    ┌────┴────┐
    │         │
Supabase Auth  PostgreSQL
    │         │
    └────┬────┘
         │
    Gym/Tenant Data
```

## Features

### Core Business Features
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Multi-Tenant Architecture**: Complete gym isolation with IDOR protection
- **Member Management**: CRUD operations for gym members
- **Membership Plans**: Create and manage subscription plans
- **Subscriptions**: Member subscription management with auto-renewal
- **Payments**: Track and manage member payments
- **Attendance**: Check-in/check-out tracking
- **Body Measurements**: Track member fitness metrics
- **Staff Management**: Staff creation and management
- **Dashboard**: Real-time gym metrics and analytics
- **Gym Management**: Platform-level gym administration (super admin)

### Security Features
- Role-based access control (super_admin, gym_admin, staff, owner)
- Multi-tenant data isolation
- Input validation on all endpoints
- CORS protection
- Health check endpoint
- Secure error handling (no stack traces exposed)

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy 2.x** - ORM for database operations
- **Supabase** - PostgreSQL database and authentication
- **Pydantic v2** - Data validation
- **Uvicorn** - ASGI server
- **Pytest** - Testing framework
- **Ruff** - Linting

### Frontend
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Vite 8** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router v7** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development
- **GitHub Actions** - CI/CD

## Project Structure

```
.
├── gym-saas-backend/
│   ├── app/
│   │   ├── api/v1/          # API routes
│   │   ├── core/            # Configuration, security, dependencies
│   │   ├── db/              # Database setup
│   │   ├── models/          # SQLAlchemy models
│   │   ├── repositories/    # Data access layer
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI application
│   ├── tests/               # Backend tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             # API client modules
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── main.tsx         # React entrypoint
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── .github/workflows/       # CI/CD pipelines
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- pnpm (for frontend)
- Docker & Docker Compose (optional)
- Supabase account

### Local Development

#### 1. Clone the repository

```bash
git clone <repository-url>
cd first-sAAs
```

#### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Backend
DATABASE_URL=postgresql://username:password@localhost:5432/gym_saas
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ENVIRONMENT=development
DEBUG=true

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

#### 3. Start with Docker Compose (Recommended)

```bash
docker compose up --build
```

This starts:
- Backend: http://localhost:8000
- Frontend: http://localhost
- API docs: http://localhost:8000/docs

#### 4. Or run manually

**Backend:**
```bash
cd gym-saas-backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Once the backend is running, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication

All protected endpoints require a Bearer token obtained via `/auth/login` or `/auth/register`.

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -X GET "http://localhost:8000/api/v1/members" \
  -H "Authorization: Bearer <your-token>"
```

## User Roles

| Role | Access |
|------|--------|
| super_admin | Full platform access, gym management |
| gym_admin | Full gym access, member/plan/staff management |
| staff | Member management, attendance, measurements |
| owner | Similar to gym_admin |

## Testing

### Backend Tests

```bash
cd gym-saas-backend
pytest tests/ -v
```

### Frontend TypeScript Check

```bash
cd frontend
npm run typecheck
```

### Frontend Lint

```bash
cd frontend
npm run lint
```

## CI/CD

GitHub Actions workflows run automatically on push/PR:

- **Backend CI**: Lint, tests, Docker build
- **Frontend CI**: Lint, TypeScript check, build, Docker build
- **Docker CI**: Verify all Docker images build successfully

## Deployment

### Environment Variables

Never commit `.env` files. Use the following production environment variables:

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- `SUPABASE_SECRET_KEY` - Supabase service role key (backend only)
- `CORS_ORIGINS` - Allowed frontend origins
- `ENVIRONMENT` - Set to `production`
- `DEBUG` - Set to `false`

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL

### Docker Production Deployment

```bash
# Build and start
docker compose -f docker-compose.prod.yml up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Security Considerations

- Never expose Supabase service-role key to frontend
- Always use HTTPS in production
- Rotate secrets regularly
- Use environment variables for all configuration
- Backend enforces all authorization (frontend is not a security boundary)
- Multi-tenant isolation prevents cross-gym data access

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.