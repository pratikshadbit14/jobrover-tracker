from sqlalchemy import Column, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class Resume(Base):
    __tablename__ = "resumes"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    label      = Column(Text, nullable=False)
    raw_text   = Column(Text, nullable=False)
    file_url   = Column(Text, nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user         = relationship("User", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")