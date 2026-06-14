from pydantic import BaseModel, EmailStr
import uuid


class RegisterRequest(BaseModel):
    email:         EmailStr
    full_name:     str
    password:      str
    current_title: str | None = None


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"


class UserResponse(BaseModel):
    id:            uuid.UUID
    email:         str
    full_name:     str
    current_title: str | None

    class Config:
        from_attributes = True