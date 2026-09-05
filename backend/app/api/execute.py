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

    # Only Python is supported for now
    if request.language.lower() != "python":
        return {
            "success": False,
            "passed": 0,
            "total": 0,
            "results": []
        }

    # Get all test cases for this problem
    test_cases = (
        db.query(TestCase)
        .filter(
            TestCase.problem_id == request.problem_id
        )
        .order_by(TestCase.id)
        .all()
    )

    results = []
    passed = 0

    for index, test_case in enumerate(
        test_cases,
        start=1
    ):

        # Execute user's code
        execution = execute_python(
            request.code,
            test_case.input
        )

        actual_output = execution["stdout"].strip()
        expected_output = test_case.expected_output.strip()

        # Compare output
        test_passed = (
            execution["success"]
            and actual_output == expected_output
        )

        if test_passed:
            passed += 1

        # -----------------------------
        # VISIBLE TEST CASE
        # -----------------------------
        if not test_case.is_hidden:

            results.append({
                "test_case": index,
                "passed": test_passed,
                "input": test_case.input,
                "expected_output": expected_output,
                "actual_output": (
                    actual_output
                    if execution["success"]
                    else execution["stderr"]
                )
            })

        # -----------------------------
        # HIDDEN TEST CASE
        # -----------------------------
        else:

            results.append({
                "test_case": index,
                "passed": test_passed
            })

    return {
        "success": passed == len(test_cases),
        "passed": passed,
        "total": len(test_cases),
        "results": results
    }