from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers import auth, applications, interviews, followups, resumes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations on startup
    import subprocess
    subprocess.run(["alembic", "upgrade", "head"], check=True)
    yield


app = FastAPI(
    title="JobRover — Application Tracker",
    version="1.0.0",
    description="P1: Track every job application, interview, and follow-up.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(interviews.router)
app.include_router(followups.router)
app.include_router(resumes.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "p1-tracker"}