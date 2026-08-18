from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False)
    topics = Column(String(500), nullable=True)