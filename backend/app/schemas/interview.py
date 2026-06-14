from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class InterviewCreate(BaseModel):
    round_type:   str
    scheduled_at: Optional[datetime] = None
    interviewer:  Optional[str]      = None
    prep_notes:   Optional[str]      = None


class InterviewUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    interviewer:  Optional[str]      = None
    outcome:      Optional[str]      = None
    feedback:     Optional[str]      = None
    prep_notes:   Optional[str]      = None


class InterviewResponse(BaseModel):
    id:             uuid.UUID
    application_id: uuid.UUID
    round_type:     str
    scheduled_at:   Optional[datetime]
    completed_at:   Optional[datetime]
    interviewer:    Optional[str]
    outcome:        str
    feedback:       Optional[str]
    prep_notes:     Optional[str]
    created_at:     datetime

    class Config:
        from_attributes = True