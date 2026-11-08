from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
from app.api.auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/progress", tags=["Progress"])

@router.get("/stats")
def get_progress_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id

    total_submissions = (
        db.query(func.count(Submission.id)).
        filter(Submission.user_id == user_id).
        scalar()
    )

    accepted_submissions = (
        db.query(func.count(Submission.id))
        .filter(Submission.user_id == user_id, Submission.status == "Accepted")
        .scalar()
    )

    problems_solved = (
        db.query(func.count(func.distinct(Submission.problem_id)))
        .filter(Submission.user_id == user_id, Submission.status == "Accepted")
        .scalar()
    )

    acceptance_rate = 0

    if total_submissions > 0:
        acceptance_rate = round((accepted_submissions / total_submissions) * 100, 2)

    difficulty_results = (
        db.query(func.lower(Problem.difficulty), func.count(func.distinct(Submission.problem_id)))
        .join(Submission, Submission.problem_id == Problem.id)
        .filter(Submission.user_id == user_id, Submission.status == "Accepted")
        .group_by(func.lower(Problem.difficulty))
        .all()
    )

    difficulty_stats = {
        "easy": 0,
        "medium": 0,
        "hard": 0
    }

    for difficulty, count in difficulty_results:

        if difficulty in difficulty_stats:
            difficulty_stats[difficulty] = count

    total_problems = db.query(func.count(Problem.id)).scalar()

    recent_results = (
        db.query(Submission, Problem.title)
        .join(Problem, Submission.problem_id == Problem.id)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .limit(5)
        .all()
    )

    recent_submissions = []

    for submission, problem_title in recent_results:
        recent_submissions.append({
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
        "problems_solved": problems_solved,
        "total_submissions": total_submissions,
        "accepted_submissions": accepted_submissions,
        "acceptance_rate": acceptance_rate,
        "total_problems": total_problems,
        "difficulty": difficulty_stats,
        "recent_submissions": recent_submissions
    }
    
@router.get("/activity")
def get_submission_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id

    today = datetime.utcnow().date()
    start_date = today - timedelta(days=364)

    results = (
        db.query(func.date(Submission.created_at).label("date"), func.count(Submission.id).label("count"))
        .filter(
            Submission.user_id == user_id,
            Submission.created_at >= datetime.combine(start_date, datetime.min.time())
        )
        .group_by(func.date(Submission.created_at))
        .order_by(func.date(Submission.created_at))
        .all()
    )

    activity = []

    for date, count in results:
        activity.append({"date": str(date), "count": count})

    return {"activity": activity}