from pydantic import BaseModel
from typing import Optional

class StudentCreate(BaseModel):
    full_name: str
    email: str
    gender: str
    dob: str
    enrolled_year: int

class MarkCreate(BaseModel):
    student_id: int
    subject_id: int
    exam_type: str
    marks_scored: int
    exam_date: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"