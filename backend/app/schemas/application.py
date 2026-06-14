from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import uuid


class ApplicationCreate(BaseModel):
    job_title:       str
    company_name:    str
    company_id:      Optional[uuid.UUID] = None
    job_description: Optional[str]       = None
    source:          Optional[str]       = None
    source_url:      Optional[str]       = None
    applied_date:    Optional[date]      = None
    resume_id:       Optional[uuid.UUID] = None
    cover_letter:    Optional[str]       = None
    salary_expected: Optional[float]     = None
    location:        Optional[str]       = None
    is_remote:       bool                = False
    notes:           Optional[str]       = None


class ApplicationUpdate(BaseModel):
    job_title:       Optional[str]   = None
    company_name:    Optional[str]   = None
    job_description: Optional[str]   = None
    status:          Optional[str]   = None
    applied_date:    Optional[date]  = None
    cover_letter:    Optional[str]   = None
    salary_expected: Optional[float] = None
    salary_offered:  Optional[float] = None
    location:        Optional[str]   = None
    is_remote:       Optional[bool]  = None
    notes:           Optional[str]   = None


class ApplicationResponse(BaseModel):
    id:           uuid.UUID
    job_title:    str
    company_name: str
    company_id:   Optional[uuid.UUID]
    status:       str
    applied_date: Optional[date]
    source:       Optional[str]
    is_remote:    bool
    created_at:   datetime
    updated_at:   datetime

    class Config:
        from_attributes = True


class ApplicationDetail(ApplicationResponse):
    job_description: Optional[str]
    cover_letter:    Optional[str]
    salary_expected: Optional[float]
    salary_offered:  Optional[float]
    location:        Optional[str]
    notes:           Optional[str]
    resume_id:       Optional[uuid.UUID]