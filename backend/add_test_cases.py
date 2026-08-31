from app.database import SessionLocal
from app.models.problem import Problem
from app.models.test_case import TestCase


db = SessionLocal()


test_cases = [
    TestCase(
    problem_id=4,
    input="5 7",
    expected_output="12",
    is_hidden=False
    ),

    TestCase(
    problem_id=4,
    input="10 20",
    expected_output="30",
    is_hidden=False
    ),

    TestCase(
    problem_id=4,
    input="-5 10",
    expected_output="5",
    is_hidden=True
    ),

    TestCase(
    problem_id=4,
    input="100 200",
    expected_output="300",
    is_hidden=True
    )
]

db.add_all(test_cases)

db.commit()

db.close()

print("Test cases added successfully!")