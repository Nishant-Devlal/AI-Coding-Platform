from app.database import SessionLocal
from app.models.problem import Problem
from app.models.test_case import TestCase


db = SessionLocal()


problem = Problem(
    title="Add Two Numbers",

    description="Given two integers, calculate and print their sum.",

    difficulty="Easy",

    topics="Math",

    constraints="-10^9 <= a, b <= 10^9",

    input_format=(
        "The input contains two integers separated by a space."
    ),

    output_format=(
        "Print the sum of the two integers."
    ),

    examples=[
        {
            "input": "5 7",
            "output": "12",
            "explanation": "5 + 7 = 12"
        },
        {
            "input": "10 20",
            "output": "30",
            "explanation": "10 + 20 = 30"
        }
    ],

    starter_code=(
        "a, b = map(int, input().split())\n"
        "\n"
        "# Write your solution here\n"
        "\n"
        "answer = 0\n"
        "\n"
        "print(answer)\n"
    )
)


db.add(problem)
db.commit()
db.refresh(problem)

print(f"Problem added successfully!")
print(f"Problem ID: {problem.id}")

db.close()