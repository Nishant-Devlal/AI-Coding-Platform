from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.submission import Submission
from app.models.problem import Problem
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_submissions = (db.query(func.count(Submission.id))
        .filter(Submission.user_id == current_user.id)
        .scalar()) or 0

    accepted_submissions = (
        db.query(func.count(Submission.id))
        .filter(Submission.user_id == current_user.id,
            Submission.status == "Accepted")
        .scalar()) or 0

    problems_solved = (db.query(func.count(func.distinct(Submission.problem_id)))
        .filter(Submission.user_id == current_user.id,
                Submission.status == "Accepted")
        .scalar()) or 0

    if total_submissions > 0:
        acceptance_rate = round((accepted_submissions / total_submissions) * 100, 2)
    else:
        acceptance_rate = 0

    difficulty_results = (
        db.query(Problem.difficulty, func.count(func.distinct(Problem.id)))
        .join(Submission, Submission.problem_id == Problem.id)
        .filter(Submission.user_id == current_user.id, Submission.status == "Accepted")
        .group_by(Problem.difficulty)
        .all()
    )

    difficulty_stats = {
        "Easy": 0,
        "Medium": 0,
        "Hard": 0
    }

    for difficulty, count in difficulty_results:
        if difficulty in difficulty_stats:
            difficulty_stats[difficulty] = count

    recent_submissions = (
        db.query(Submission, Problem.title)
        .join(Problem, Submission.problem_id == Problem.id)
        .filter(Submission.user_id == current_user.id)
        .order_by(Submission.created_at.desc())
        .limit(5)
        .all()
    )

    recent_data = []

    for submission, problem_title in recent_submissions:

        recent_data.append({
            "id": submission.id,
            "problem_id": submission.problem_id,
            "problem_title": problem_title,
            "language": submission.language,
            "status": submission.status,
            "passed": submission.passed,
            "total": submission.total,
            "runtime": submission.runtime,
            "created_at": submission.created_at
        })

    return {
        "user_name": current_user.name,
        "stats": {
            "total_submissions": total_submissions,
            "accepted_submissions": accepted_submissions,
            "problems_solved": problems_solved,
            "acceptance_rate": acceptance_rate
        },
        "difficulty_stats": difficulty_stats,
        "recent_submissions": recent_data
    }