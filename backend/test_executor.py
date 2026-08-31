from app.services.code_executor import execute_python


code = """a, b = map(int, input().split())
print(a + b)
"""

input_data = "5 7"

result = execute_python(code, input_data)

print("FINAL RESULT:")
print(result)