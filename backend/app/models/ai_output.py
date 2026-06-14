from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class AIOutput(Base):
    __tablename__ = "ai_outputs"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    output_type    = Column(Text, nullable=False)
    content        = Column(Text, nullable=False)
    model_used     = Column(Text, default="llama3-8b-8192")
    created_at     = Column(TIMESTAMP(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="ai_outputs")