from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.interview import Interview
from app.models.application import Application
from app.schemas.interview import InterviewCreate, InterviewUpdate, InterviewResponse
from app.routers.auth import get_current_user
from app.models.user import User
import uuid

router = APIRouter(tags=["interviews"])


@router.get("/api/v1/applications/{app_id}/interviews", response_model=list[InterviewResponse])
async def list_interviews(
    app_id: uuid.UUID,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    await _verify_ownership(app_id, user.id, db)
    result = await db.execute(
        select(Interview)
        .where(Interview.application_id == app_id)
        .order_by(Interview.scheduled_at)
    )
    return result.scalars().all()


@router.post("/api/v1/applications/{app_id}/interviews", response_model=InterviewResponse, status_code=201)
async def create_interview(
    app_id: uuid.UUID,
    body:   InterviewCreate,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    await _verify_ownership(app_id, user.id, db)
    interview = Interview(**body.model_dump(), application_id=app_id)
    db.add(interview)
    await db.commit()
    await db.refresh(interview)
    return interview


@router.patch("/api/v1/interviews/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: uuid.UUID,
    body:         InterviewUpdate,
    db:           AsyncSession = Depends(get_db),
    user:         User = Depends(get_current_user)
):
    result = await db.execute(select(Interview).where(Interview.id == interview_id))
    interview = result.scalar_one_or_none()
    if not interview:
        raise HTTPException(404, "Interview not found")

    await _verify_ownership(interview.application_id, user.id, db)

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(interview, field, value)

    await db.commit()
    await db.refresh(interview)
    return interview


@router.delete("/api/v1/interviews/{interview_id}", status_code=204)
async def delete_interview(
    interview_id: uuid.UUID,
    db:           AsyncSession = Depends(get_db),
    user:         User = Depends(get_current_user)
):
    result = await db.execute(select(Interview).where(Interview.id == interview_id))
    interview = result.scalar_one_or_none()
    if not interview:
        raise HTTPException(404, "Interview not found")
    await _verify_ownership(interview.application_id, user.id, db)
    await db.delete(interview)
    await db.commit()


async def _verify_ownership(app_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession):
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user_id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Application not found")