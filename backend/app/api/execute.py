import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.test_case import TestCase
from app.models.submission import Submission
from app.schemas.submission import (
    RunRequest,
    RunResponse,
    SubmitRequest,
    SubmitResponse,
)
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

    if request.language.lower() != "python":
        return {
            "success": False,
            "passed": 0,
            "total": 0,
            "results": []
        }

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

        execution = execute_python(
            request.code,
            test_case.input
        )

        actual_output = execution["stdout"].strip()
        expected_output = test_case.expected_output.strip()

        test_passed = (
            execution["success"]
            and actual_output == expected_output
        )

        if test_passed:
            passed += 1

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
    
    
@router.post("/submit", response_model=SubmitResponse)
def submit_code(
    request: SubmitRequest,
    db: Session = Depends(get_db)
):

    # Only Python is supported for now
    if request.language.lower() != "python":
        return {
            "success": False,
            "status": "Language Not Supported",
            "passed": 0,
            "total": 0,
            "runtime": 0
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

    if not test_cases:
        raise HTTPException(
            status_code=404,
            detail="No test cases found for this problem"
        )

    passed = 0
    status = "Accepted"

    start_time = time.perf_counter()

    for test_case in test_cases:

        execution = execute_python(
            request.code,
            test_case.input
        )

        # Code execution failed
        if not execution["success"]:

            if "Time Limit Exceeded" in execution["stderr"]:
                status = "Time Limit Exceeded"
            else:
                status = "Runtime Error"

            break

        # Compare output
        actual_output = execution["stdout"].strip()
        expected_output = test_case.expected_output.strip()

        if actual_output == expected_output:
            passed += 1
        else:
            status = "Wrong Answer"

    runtime = time.perf_counter() - start_time

    # If every test passed
    if passed == len(test_cases):
        status = "Accepted"

    # Save submission
    submission = Submission(
        problem_id=request.problem_id,
        language=request.language,
        code=request.code,
        status=status,
        passed=passed,
        total=len(test_cases),
        runtime=f"{runtime:.3f}s"
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "success": status == "Accepted",
        "status": status,
        "passed": passed,
        "total": len(test_cases),
        "runtime": runtime
    }