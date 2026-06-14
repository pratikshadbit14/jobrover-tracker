from sqlalchemy import Column, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class Followup(Base):
    __tablename__ = "followups"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    due_date       = Column(Date, nullable=False)
    status         = Column(Text, default="pending")
    draft_body     = Column(Text, nullable=True)
    sent_at        = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at     = Column(TIMESTAMP(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="followups")