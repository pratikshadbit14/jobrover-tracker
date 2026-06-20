from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, applications, interviews, followups, resumes
import os

app = FastAPI(
    title="JobRover — Application Tracker",
    version="1.0.0",
    description="P1: Track every job application, interview, and follow-up."
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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