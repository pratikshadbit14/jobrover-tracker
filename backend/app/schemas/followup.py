from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import uuid


class FollowupUpdate(BaseModel):
    status:     Optional[str]  = None
    draft_body: Optional[str]  = None
    due_date:   Optional[date] = None


class FollowupResponse(BaseModel):
    id:             uuid.UUID
    application_id: uuid.UUID
    due_date:       date
    status:         str
    draft_body:     Optional[str]
    sent_at:        Optional[datetime]
    created_at:     datetime

    class Config:
        from_attributes = True