import sys
import subprocess
import tempfile
import os


def main():

    data = sys.stdin.read()

    separator = "\n---INPUT---\n"

    if separator not in data:
        print("Invalid execution request", file=sys.stderr)
        sys.exit(1)

    code, input_data = data.split(separator, 1)

    with tempfile.TemporaryDirectory() as temp_dir:

        code_file = os.path.join(
            temp_dir,
            "main.py"
        )

        with open(
            code_file,
            "w",
            encoding="utf-8"
        ) as f:
            f.write(code)

        try:

            result = subprocess.run(
                ["python", code_file],

                input=input_data,

                capture_output=True,

                text=True,

                timeout=3
            )

            print(result.stdout, end="")

            if result.stderr:
                print(
                    result.stderr,
                    file=sys.stderr
                )

            sys.exit(result.returncode)

        except subprocess.TimeoutExpired:

            print(
                "Time Limit Exceeded",
                file=sys.stderr
            )

            sys.exit(124)


if __name__ == "__main__":
    main()