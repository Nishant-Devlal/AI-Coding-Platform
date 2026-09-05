from typing import Optional
from pydantic import BaseModel


class RunRequest(BaseModel):
    problem_id: int
    language: str
    code: str


class TestResult(BaseModel):
    test_case: int
    passed: bool
    input: Optional[str] = None
    expected_output: Optional[str] = None
    actual_output: Optional[str] = None


class RunResponse(BaseModel):
    success: bool
    passed: int
    total: int
    results: list[TestResult]