from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.test_case import TestCase
from app.schemas.submission import RunRequest, RunResponse


router = APIRouter(
    prefix="/api",
    tags=["Execution"]
)


@router.post("/run", response_model=RunResponse)
def run_code(
    request: RunRequest,
    db: Session = Depends(get_db)
):

    test_cases = (
        db.query(TestCase)
        .filter(TestCase.problem_id == request.problem_id)
        .all()
    )

    results = []

    for index, test_case in enumerate(test_cases, start=1):

        # Temporary result.
        # Actual code execution comes next.
        actual_output = "Execution not implemented"

        results.append({
            "test_case": index,
            "passed": False,
            "input": test_case.input,
            "expected_output": test_case.expected_output,
            "actual_output": actual_output
        })

    return {
        "success": False,
        "passed": 0,
        "total": len(test_cases),
        "results": results
    }