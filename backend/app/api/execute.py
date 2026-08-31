from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.test_case import TestCase
from app.schemas.submission import RunRequest, RunResponse
from app.services.code_executor import execute_python


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
        .filter(
            TestCase.problem_id == request.problem_id
        )
        .all()
    )

    results = []

    passed = 0

    for index, test_case in enumerate(
        test_cases,
        start=1
    ):

        if request.language.lower() != "python":

            results.append({
                "test_case": index,
                "passed": False,
                "input": test_case.input,
                "expected_output": test_case.expected_output,
                "actual_output": "Language not supported yet"
            })

            continue

        execution = execute_python(
            request.code,
            test_case.input
        )

        actual_output = execution["stdout"]

        expected_output = (
            test_case.expected_output.strip()
        )

        test_passed = (
            execution["success"]
            and actual_output == expected_output
        )

        if test_passed:
            passed += 1

        results.append({
            "test_case": index,
            "passed": test_passed,
            "input": test_case.input,
            "expected_output": expected_output,
            "actual_output": actual_output
                if execution["success"]
                else execution["stderr"]
        })

    return {
        "success": passed == len(test_cases),
        "passed": passed,
        "total": len(test_cases),
        "results": results
    }