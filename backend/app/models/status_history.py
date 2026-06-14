from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class StatusHistory(Base):
    __tablename__ = "status_history"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    from_status    = Column(Text, nullable=True)
    to_status      = Column(Text, nullable=False)
    changed_at     = Column(TIMESTAMP(timezone=True), server_default=func.now())
    note           = Column(Text, nullable=True)

    application = relationship("Application", back_populates="status_history")