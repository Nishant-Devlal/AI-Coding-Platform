from fastapi import APIRouter, Depends
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