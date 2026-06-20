# JobRover — Application Tracker

JobRover is the tool I built because I was losing track of my own job applications.

A full-stack job application tracker with a Kanban pipeline, interview logging, automated follow-up reminders, and resume management — built to demonstrate production-grade FastAPI + Next.js architecture.

## Features

- **Kanban pipeline** — drag-and-drop applications through saved → applied → screened → interviewing → offer/rejected
- **Status history** — every stage change is logged with a timestamp
- **Interview tracking** — log rounds, outcomes, interviewer details, and prep notes per application
- **Automated follow-ups** — every application gets a follow-up reminder auto-created 7 days after applying
- **Resume management** — store multiple resume versions, mark one as default
- **JWT authentication** — secure, stateless auth with bcrypt password hashing

## Tech Stack

**Backend**
- FastAPI (async)
- SQLAlchemy 2.0 (async) + asyncpg
- PostgreSQL
- Alembic migrations
- JWT auth (python-jose + passlib)

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- TanStack Query (React Query)
- @dnd-kit (drag and drop)

**Infrastructure**
- Docker + Docker Compose

## Architecture

This is **Project 1 of 3** in the JobRover ecosystem:

| Project | Purpose | Status |
|---|---|---|
| **P1 — Application Tracker** | This repo. CRUD for applications, interviews, follow-ups, resumes | ✅ Complete |
| **P2 — Company Intelligence** | Company profiles, role benchmarks, JD parser | 🔜 Next |
| **P3 — AI Resume Analyser** | RAG-powered resume tailoring, cover letters, rejection analysis | 🔜 Planned |

Each project is independently functional. A future integration layer (P4) will unify all three.

## Running locally

### Prerequisites
- Docker Desktop
- Node.js 18+
- Python 3.12+ (for Alembic migrations)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/jobrover-tracker.git
cd jobrover-tracker

# Backend — start the database and API
docker compose up -d

# Run migrations (first time only)
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
alembic upgrade head

# Frontend
cd ../frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API docs: http://localhost:8001/docs

### Environment variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@p1-db:5432/jobrover_tracker
LOCAL_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/jobrover_tracker
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

## License

MIT