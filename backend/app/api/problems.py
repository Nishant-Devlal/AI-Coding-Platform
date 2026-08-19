from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemResponse

router = APIRouter(
    prefix="/api/problems",
    tags=["Problems"]
)


@router.get("/", response_model=list[ProblemResponse])
def get_problems(db: Session = Depends(get_db)):
    problems = db.query(Problem).all()

    return problems


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(
    problem_id: int,
    db: Session = Depends(get_db)
):
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return problem