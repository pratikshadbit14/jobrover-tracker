from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.application import Application
from app.models.followup import Followup
from app.models.status_history import StatusHistory
from app.models.ai_output import AIOutput
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ApplicationDetail
from app.routers.auth import get_current_user
from app.models.user import User
from datetime import date, timedelta
from typing import Optional
import uuid

router = APIRouter(prefix="/api/v1/applications", tags=["applications"])


@router.get("", response_model=list[ApplicationResponse])
async def list_applications(
    status: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    skip:   int = Query(0, ge=0),
    limit:  int = Query(50, le=100),
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    q = select(Application).where(Application.user_id == user.id)
    if status:
        q = q.where(Application.status == status)
    if source:
        q = q.where(Application.source == source)
    q = q.offset(skip).limit(limit).order_by(Application.updated_at.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=ApplicationDetail, status_code=201)
async def create_application(
    body: ApplicationCreate,
    db:   AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    app = Application(**body.model_dump(), user_id=user.id)
    db.add(app)
    await db.flush()

    # Auto-create follow-up 7 days from today
    followup = Followup(
        application_id=app.id,
        due_date=date.today() + timedelta(days=7),
        status="pending"
    )
    db.add(followup)

    # Log initial status
    db.add(StatusHistory(
        application_id=app.id,
        from_status=None,
        to_status=app.status
    ))

    await db.commit()
    await db.refresh(app)
    return app


@router.get("/{app_id}", response_model=ApplicationDetail)
async def get_application(
    app_id: uuid.UUID,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user.id
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")
    return app


@router.patch("/{app_id}", response_model=ApplicationDetail)
async def update_application(
    app_id: uuid.UUID,
    body:   ApplicationUpdate,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user.id
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")

    old_status = app.status
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(app, field, value)

    if body.status and body.status != old_status:
        db.add(StatusHistory(
            application_id=app.id,
            from_status=old_status,
            to_status=body.status
        ))

    await db.commit()
    await db.refresh(app)
    return app


@router.delete("/{app_id}", status_code=204)
async def delete_application(
    app_id: uuid.UUID,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user.id
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")
    await db.delete(app)
    await db.commit()


@router.get("/{app_id}/history")
async def get_status_history(
    app_id: uuid.UUID,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    # Verify ownership
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Application not found")

    history = await db.execute(
        select(StatusHistory)
        .where(StatusHistory.application_id == app_id)
        .order_by(StatusHistory.changed_at)
    )
    return history.scalars().all()


@router.get("/{app_id}/ai-outputs")
async def get_ai_outputs(
    app_id: uuid.UUID,
    db:     AsyncSession = Depends(get_db),
    user:   User = Depends(get_current_user)
):
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Application not found")

    outputs = await db.execute(
        select(AIOutput)
        .where(AIOutput.application_id == app_id)
        .order_by(AIOutput.created_at.desc())
    )
    return outputs.scalars().all()


@router.post("/{app_id}/ai-outputs", status_code=201)
async def save_ai_output(
    app_id:      uuid.UUID,
    output_type: str,
    content:     str,
    db:          AsyncSession = Depends(get_db),
    user:        User = Depends(get_current_user)
):
    result = await db.execute(
        select(Application).where(
            Application.id == app_id,
            Application.user_id == user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Application not found")

    output = AIOutput(
        application_id=app_id,
        output_type=output_type,
        content=content
    )
    db.add(output)
    await db.commit()
    await db.refresh(output)
    return output