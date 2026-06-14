from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.followup import Followup
from app.models.application import Application
from app.schemas.followup import FollowupUpdate, FollowupResponse
from app.routers.auth import get_current_user
from app.models.user import User
from datetime import date
import uuid

router = APIRouter(prefix="/api/v1/followups", tags=["followups"])


@router.get("", response_model=list[FollowupResponse])
async def list_followups(
    db:   AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Followup)
        .join(Application, Followup.application_id == Application.id)
        .where(Application.user_id == user.id)
        .order_by(Followup.due_date)
    )
    return result.scalars().all()


@router.get("/overdue", response_model=list[FollowupResponse])
async def overdue_followups(
    db:   AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Followup)
        .join(Application, Followup.application_id == Application.id)
        .where(
            Application.user_id == user.id,
            Followup.status == "pending",
            Followup.due_date < date.today()
        )
    )
    return result.scalars().all()


@router.patch("/{followup_id}", response_model=FollowupResponse)
async def update_followup(
    followup_id: uuid.UUID,
    body:        FollowupUpdate,
    db:          AsyncSession = Depends(get_db),
    user:        User = Depends(get_current_user)
):
    result = await db.execute(
        select(Followup)
        .join(Application, Followup.application_id == Application.id)
        .where(
            Followup.id == followup_id,
            Application.user_id == user.id
        )
    )
    followup = result.scalar_one_or_none()
    if not followup:
        raise HTTPException(404, "Follow-up not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(followup, field, value)

    await db.commit()
    await db.refresh(followup)
    return followup