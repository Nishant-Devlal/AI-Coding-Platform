from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemResponse
from app.models.submission import Submission
from app.models.user import User
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/problems", tags=["Problems"])

@router.get("/topics", response_model=list[str])
def get_problem_topics(db: Session = Depends(get_db)):
    all_problems = db.query(Problem.topics).all()
    topics = set()
    for (problem_topics,) in all_problems:
        if not problem_topics:
            continue
        for topic in problem_topics.split(","):
            topic = topic.strip()
            if topic:
                topics.add(topic)
                
    return sorted(topics, key=str.lower)

@router.get("/", response_model=list[ProblemResponse])
def get_problems(topic: str = Query(None), difficulty: str = Query(None), search: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(Problem)
    if difficulty:
        query = query.filter(Problem.difficulty.ilike(difficulty.strip()))
    if search:
        query = query.filter(Problem.title.ilike(f"%{search.strip()}%"))
    problems = query.all()
    
    if topic:
        selected_topic = topic.strip().casefold()
        problems = [problem for problem in problems
                    if selected_topic in {t.strip().casefold() for t in (problem.topics or "").split(",")}]
        
    return problems

@router.get("/solved")
def get_solved_problems(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    solved_problem_ids = (
        db.query(Submission.problem_id)
        .filter(Submission.user_id == current_user.id, Submission.status == "Accepted")
        .distinct()
        .all())
    
    return {"solved_problem_ids": [row[0] for row in solved_problem_ids]}

@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = (db.query(Problem).filter(Problem.id == problem_id).first())
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    return problem