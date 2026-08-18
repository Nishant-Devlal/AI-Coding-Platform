from app.database import SessionLocal
from app.models.problem import Problem


db = SessionLocal()


problems = [
    Problem(
        title="Two Sum",
        description="Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
        difficulty="Easy",
        topics="Array, Hash Map"
    ),

    Problem(
        title="Valid Parentheses",
        description="Given a string containing brackets, determine if the input string is valid.",
        difficulty="Easy",
        topics="String, Stack"
    ),

    Problem(
        title="Binary Tree Traversal",
        description="Given the root of a binary tree, return its traversal.",
        difficulty="Medium",
        topics="Tree, DFS"
    )
]


db.add_all(problems)
db.commit()

db.close()

print("Problems added successfully!")