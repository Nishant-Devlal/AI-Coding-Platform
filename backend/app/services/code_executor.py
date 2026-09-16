import subprocess


LANGUAGE_IMAGES = {
    "python": "ai-code-python",
    "c++": "ai-code-cpp",
}


def execute_code(
    language: str,
    code: str,
    input_data: str,
    timeout: int = 5
):

    language = language.lower()

    # Check if language is supported
    if language not in LANGUAGE_IMAGES:
        return {
            "success": False,
            "stdout": "",
            "stderr": "Language not supported"
        }

    image = LANGUAGE_IMAGES[language]

    execution_request = (
        code.rstrip()
        + "\n---INPUT---\n"
        + input_data.strip()
        + "\n"
    )

    print("EXECUTION REQUEST:")
    print(repr(execution_request))

    try:

        result = subprocess.run(
            [
                "docker",
                "run",
                "--rm",
                "-i",
                image
            ],
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

    except subprocess.TimeoutExpired:

        return {
            "success": False,
            "stdout": "",
            "stderr": "Time Limit Exceeded"
        }