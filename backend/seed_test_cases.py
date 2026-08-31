from app.database import SessionLocal
from app.models.problem import Problem
from app.models.test_case import TestCase


db = SessionLocal()


test_cases = [

    # =========================
    # TWO SUM
    # =========================

    TestCase(
        problem_id=1,
        input="[2,7,11,15]\n9",
        expected_output="[0,1]",
        is_hidden=False
    ),

    TestCase(
        problem_id=1,
        input="[3,2,4]\n6",
        expected_output="[1,2]",
        is_hidden=False
    ),

    TestCase(
        problem_id=1,
        input="[3,3]\n6",
        expected_output="[0,1]",
        is_hidden=True
    ),

    TestCase(
        problem_id=1,
        input="[1,5,8,12]\n13",
        expected_output="[0,3]",
        is_hidden=True
    ),


    # =========================
    # VALID PARENTHESES
    # =========================

    TestCase(
        problem_id=2,
        input="()",
        expected_output="true",
        is_hidden=False
    ),

    TestCase(
        problem_id=2,
        input="()[]{}",
        expected_output="true",
        is_hidden=False
    ),

    TestCase(
        problem_id=2,
        input="([)]",
        expected_output="false",
        is_hidden=True
    ),

    TestCase(
        problem_id=2,
        input="{[]}",
        expected_output="true",
        is_hidden=True
    )
    
]


db.add_all(test_cases)

db.commit()

db.close()

print("Test cases added successfully!")