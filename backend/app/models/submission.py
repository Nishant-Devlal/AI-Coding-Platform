from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime

from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    problem_id = Column(
        Integer,
        ForeignKey("problems.id"),
        nullable=False
    )

    language = Column(
        String(50),
        nullable=False
    )

    code = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False
    )

    passed = Column(
        Integer,
        nullable=False,
        default=0
    )

    total = Column(
        Integer,
        nullable=False,
        default=0
    )

    runtime = Column(
        String(50),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )