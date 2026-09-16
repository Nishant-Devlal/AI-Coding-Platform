import sys
import subprocess
import tempfile
import os


def main():

    # Read the complete execution request
    data = sys.stdin.read()

    # Handle Windows CRLF line endings
    data = data.replace("\r\n", "\n")

    separator = "\n---INPUT---\n"

    if separator not in data:
        print(
            "Invalid execution request",
            file=sys.stderr
        )
        sys.exit(1)

    code, input_data = data.split(
        separator,
        1
    )

    with tempfile.TemporaryDirectory() as temp_dir:

        code_file = os.path.join(
            temp_dir,
            "main.cpp"
        )

        executable = os.path.join(
            temp_dir,
            "main"
        )

        # Write C++ source code
        with open(
            code_file,
            "w",
            encoding="utf-8"
        ) as f:
            f.write(code)

        # Compile
        compile_result = subprocess.run(
            [
                "g++",
                "-std=c++17",
                code_file,
                "-O2",
                "-o",
                executable
            ],
            capture_output=True,
            text=True
        )

        # Compilation error
        if compile_result.returncode != 0:

            print(
                compile_result.stderr,
                file=sys.stderr
            )

            sys.exit(1)

        # Execute
        try:

            result = subprocess.run(
                [executable],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=3
            )

            # Program output
            print(
                result.stdout,
                end=""
            )

            # Runtime errors
            if result.stderr:
                print(
                    result.stderr,
                    file=sys.stderr
                )

            sys.exit(
                result.returncode
            )

        except subprocess.TimeoutExpired:

            print(
                "Time Limit Exceeded",
                file=sys.stderr
            )

            sys.exit(124)


if __name__ == "__main__":
    main()