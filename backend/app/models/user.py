from sqlalchemy import Column, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP
from app.db.base import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email           = Column(Text, unique=True, nullable=False, index=True)
    full_name       = Column(Text, nullable=False)
    hashed_password = Column(Text, nullable=False)
    current_title   = Column(Text, nullable=True)
    created_at      = Column(TIMESTAMP(timezone=True), server_default=func.now())

    applications    = relationship("Application", back_populates="user", cascade="all, delete")
    resumes         = relationship("Resume", back_populates="user", cascade="all, delete")