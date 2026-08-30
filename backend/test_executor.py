from app.services.code_executor import execute_python


code = """
print("Hello from AI Coding Platform")
print(10 + 20)
"""


result = execute_python(code)

print(result)