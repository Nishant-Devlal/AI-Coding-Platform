from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.execute import router as execute_router
from app.database import Base, engine
from app.models.problem import Problem
from app.models.test_case import TestCase
from app.api.problems import router as problems_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Coding Platform API",
    description="Backend API for the AI Coding Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(problems_router)
app.include_router(execute_router)

@app.get("/")
def root():
    return {
        "message": "AI Coding Platform API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }