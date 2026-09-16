FROM gcc:latest

WORKDIR /app

COPY runner.py /app/runner.py

RUN apt-get update && \
    apt-get install -y python3 && \
    rm -rf /var/lib/apt/lists/*

CMD ["python3", "/app/runner.py"]