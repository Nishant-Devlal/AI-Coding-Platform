import subprocess

data = """a, b = map(int, input().split())
print(a + b)
---INPUT---
5 7
"""

print("=== DATA REPR ===")
print(repr(data))

print("\n=== CHECK ===")
print("\n---INPUT---\n" in data)

result = subprocess.run(
    ["docker", "run", "--rm", "-i", "ai-code-python"],
    input=data.encode("utf-8"),
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

print("\n=== RESULT ===")
print("Return code:", result.returncode)
print("STDOUT:", repr(result.stdout))
print("STDERR:", repr(result.stderr))