from app.database import SessionLocal
from app.models.problem import Problem


db = SessionLocal()


problems = [
    Problem(
        title="Two Sum",

        description=(
            "Given an array of integers nums and an integer target, "
            "return the indices of the two numbers such that they add up "
            "to target."
        ),

        difficulty="Easy",

        topics="Array, Hash Map",

        constraints=(
            "2 <= nums.length <= 10^4\n"
            "-10^9 <= nums[i] <= 10^9\n"
            "-10^9 <= target <= 10^9\n"
            "Each input has exactly one solution."
        ),

        input_format=(
            "The first line contains an array of integers nums. "
            "The second value is the target integer."
        ),

        output_format=(
            "Return the indices of the two numbers that add up to target."
        ),

        examples=[
            {
                "input": "nums = [2,7,11,15], target = 9",
                "output": "[0,1]",
                "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
            },
            {
                "input": "nums = [3,2,4], target = 6",
                "output": "[1,2]",
                "explanation": "nums[1] + nums[2] = 2 + 4 = 6"
            }
        ],

        starter_code=(
            "def two_sum(nums, target):\n"
            "    # Write your solution here\n"
            "    pass\n"
        )
    ),

    Problem(
        title="Valid Parentheses",

        description=(
            "Given a string containing brackets '(', ')', '{', '}', '[' "
            "and ']', determine if the input string is valid."
        ),

        difficulty="Easy",

        topics="String, Stack",

        constraints=(
            "1 <= s.length <= 10^4\n"
            "s consists of parentheses only: '()[]{}'."
        ),

        input_format=(
            "A string s containing brackets."
        ),

        output_format=(
            "Return true if the brackets are valid, otherwise return false."
        ),

        examples=[
            {
                "input": 's = "()"',
                "output": "true",
                "explanation": "The parentheses are correctly matched."
            },
            {
                "input": 's = "([)]"',
                "output": "false",
                "explanation": "The brackets are not correctly nested."
            }
        ],

        starter_code=(
            "def is_valid(s):\n"
            "    # Write your solution here\n"
            "    pass\n"
        )
    ),

    Problem(
        title="Binary Tree Traversal",

        description=(
            "Given the root of a binary tree, return the preorder "
            "traversal of its nodes."
        ),

        difficulty="Medium",

        topics="Tree, DFS",

        constraints=(
            "The number of nodes in the tree is in the range [0, 100].\n"
            "-100 <= Node.val <= 100"
        ),

        input_format=(
            "The root of a binary tree."
        ),

        output_format=(
            "Return the preorder traversal of the tree."
        ),

        examples=[
            {
                "input": "root = [1,null,2,3]",
                "output": "[1,2,3]",
                "explanation": "Visit root, left subtree, then right subtree."
            }
        ],

        starter_code=(
            "def preorder_traversal(root):\n"
            "    # Write your solution here\n"
            "    pass\n"
        )
    )
]


db.add_all(problems)
db.commit()
db.close()

print("Problems added successfully!")