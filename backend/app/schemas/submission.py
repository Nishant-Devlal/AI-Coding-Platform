from pydantic import BaseModel


class RunRequest(BaseModel):
    problem_id: int
    language: str
    code: str


class TestResult(BaseModel):
    test_case: int
    passed: bool
    input: str
    expected_output: str
    actual_output: str


class RunResponse(BaseModel):
    success: bool
    passed: int
    total: int
    results: list[TestResult]