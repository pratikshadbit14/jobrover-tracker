from sqlalchemy import Column, Text, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class Application(Base):
    __tablename__ = "applications"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id      = Column(UUID(as_uuid=True), nullable=True)   # soft ref to P2
    job_title       = Column(Text, nullable=False)
    company_name    = Column(Text, nullable=False)
    job_description = Column(Text, nullable=True)
    source          = Column(Text, nullable=True)
    source_url      = Column(Text, nullable=True)
    status          = Column(Text, default="saved", nullable=False)
    applied_date    = Column(Date, nullable=True)
    resume_id       = Column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    cover_letter    = Column(Text, nullable=True)
    salary_expected = Column(Numeric(12, 2), nullable=True)
    salary_offered  = Column(Numeric(12, 2), nullable=True)
    currency        = Column(Text, default="INR")
    location        = Column(Text, nullable=True)
    is_remote       = Column(Boolean, default=False)
    notes           = Column(Text, nullable=True)
    created_at      = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at      = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user           = relationship("User", back_populates="applications")
    resume         = relationship("Resume", back_populates="applications")
    interviews     = relationship("Interview", back_populates="application", cascade="all, delete")
    followups      = relationship("Followup", back_populates="application", cascade="all, delete")
    status_history = relationship("StatusHistory", back_populates="application", cascade="all, delete")
    ai_outputs     = relationship("AIOutput", back_populates="application", cascade="all, delete")