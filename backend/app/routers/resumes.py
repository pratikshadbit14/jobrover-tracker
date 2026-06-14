from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.db.session import get_db
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from app.routers.auth import get_current_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/api/v1/resumes", tags=["resumes"])


@router.get("", response_model=list[ResumeResponse])
async def list_resumes(
    db:   AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume)
        .where(Resume.user_id == user.id)
        .order_by(Resume.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=ResumeResponse, status_code=201)
async def create_resume(
    body: ResumeCreate,
    db:   AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    resume = Resume(**body.model_dump(), user_id=user.id)
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: uuid.UUID,
    db:        AsyncSession = Depends(get_db),
    user:      User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == user.id
        )
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(404, "Resume not found")
    return resume


@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: uuid.UUID,
    body:      ResumeUpdate,
    db:        AsyncSession = Depends(get_db),
    user:      User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == user.id
        )
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(404, "Resume not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(resume, field, value)

    await db.commit()
    await db.refresh(resume)
    return resume


@router.patch("/{resume_id}/set-default", response_model=ResumeResponse)
async def set_default_resume(
    resume_id: uuid.UUID,
    db:        AsyncSession = Depends(get_db),
    user:      User = Depends(get_current_user)
):
    # Unset all existing defaults for this user
    await db.execute(
        update(Resume)
        .where(Resume.user_id == user.id)
        .values(is_default=False)
    )

    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == user.id
        )
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(404, "Resume not found")

    resume.is_default = True
    await db.commit()
    await db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=204)
async def delete_resume(
    resume_id: uuid.UUID,
    db:        AsyncSession = Depends(get_db),
    user:      User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == user.id
        )
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(404, "Resume not found")
    await db.delete(resume)
    await db.commit()