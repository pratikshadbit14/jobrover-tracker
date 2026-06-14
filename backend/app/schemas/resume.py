from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class ResumeCreate(BaseModel):
    label:    str
    raw_text: str
    file_url: Optional[str] = None


class ResumeUpdate(BaseModel):
    label:    Optional[str] = None
    raw_text: Optional[str] = None
    file_url: Optional[str] = None


class ResumeResponse(BaseModel):
    id:         uuid.UUID
    user_id:    uuid.UUID
    label:      str
    file_url:   Optional[str]
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True