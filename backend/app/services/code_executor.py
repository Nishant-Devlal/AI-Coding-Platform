import subprocess


def execute_python(code: str, input_data: str, timeout: int = 5):

    execution_request = (
        code.rstrip()
        + "\n---INPUT---\n"
        + input_data.strip()
        + "\n"
    )

    print("EXECUTION REQUEST:")
    print(repr(execution_request))

    result = subprocess.run(
        ["docker", "run", "--rm", "-i", "ai-code-python"],
        input=execution_request.encode("utf-8"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        timeout=timeout + 2
    )

    print("RETURN CODE:", result.returncode)
    print("STDOUT:", repr(result.stdout))
    print("STDERR:", repr(result.stderr))

    return {
        "success": result.returncode == 0,
        "stdout": result.stdout.decode("utf-8").strip(),
        "stderr": result.stderr.decode("utf-8").strip()
    }