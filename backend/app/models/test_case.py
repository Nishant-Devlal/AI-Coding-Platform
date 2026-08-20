from sqlalchemy import Column, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)

    problem_id = Column(
        Integer,
        ForeignKey("problems.id"),
        nullable=False
    )

    input = Column(Text, nullable=False)

    expected_output = Column(Text, nullable=False)

    is_hidden = Column(Boolean, default=False)

    problem = relationship(
        "Problem",
        back_populates="test_cases"
    )