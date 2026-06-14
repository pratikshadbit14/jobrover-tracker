from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class Interview(Base):
    __tablename__ = "interviews"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    round_type     = Column(Text, nullable=False)
    scheduled_at   = Column(TIMESTAMP(timezone=True), nullable=True)
    completed_at   = Column(TIMESTAMP(timezone=True), nullable=True)
    interviewer    = Column(Text, nullable=True)
    outcome        = Column(Text, default="pending")
    feedback       = Column(Text, nullable=True)
    prep_notes     = Column(Text, nullable=True)
    created_at     = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at     = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    application = relationship("Application", back_populates="interviews")