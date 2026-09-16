import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.test_case import TestCase
from app.models.submission import Submission
from app.models.problem import Problem
from app.schemas.submission import (
    RunRequest,
    RunResponse,
    SubmitRequest,
    SubmitResponse,
)
from app.services.code_executor import execute_code


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
        .order_by(TestCase.id)
        .all()
    )

    results = []
    passed = 0

    for index, test_case in enumerate(
        test_cases,
        start=1
    ):

        execution = execute_code(
            request.language,
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

        execution = execute_code(
            request.language,
            request.code,
            test_case.input
        )

        if not execution["success"]:

            if "Time Limit Exceeded" in execution["stderr"]:
                status = "Time Limit Exceeded"
            else:
                status = "Runtime Error"

            break

        actual_output = execution["stdout"].strip()
        expected_output = test_case.expected_output.strip()

        if actual_output == expected_output:
            passed += 1
        else:
            status = "Wrong Answer"

    runtime = time.perf_counter() - start_time

    if passed == len(test_cases):
        status = "Accepted"

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
    
@router.get("/submissions")
def get_submissions(
    db: Session = Depends(get_db)
):
    submissions = (
        db.query(Submission, Problem.title)
        .join(
            Problem,
            Submission.problem_id == Problem.id
        )
        .order_by(Submission.created_at.desc())
        .all()
    )

    return [
        {
            "id": submission.id,
            "problem_id": submission.problem_id,
            "problem_title": problem_title,
            "language": submission.language,
            "code": submission.code,
            "status": submission.status,
            "passed": submission.passed,
            "total": submission.total,
            "runtime": submission.runtime,
            "created_at": submission.created_at
        }
        for submission, problem_title in submissions
    ]