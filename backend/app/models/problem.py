from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Problem(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False)
    topics = Column(String(500), nullable=True)
    constraints = Column(Text, nullable=True)
    input_format = Column(Text, nullable=True)
    output_format = Column(Text, nullable=True)
    examples = Column(JSON, nullable=True)
    starter_code = Column(Text, nullable=True)
    
    test_cases = relationship(
    "TestCase",
    back_populates="problem",
    cascade="all, delete-orphan"
)