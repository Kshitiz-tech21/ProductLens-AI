FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir numpy==1.26.4 pandas==2.2.1 scipy==1.12.0 scikit-learn==1.4.1.post1 && \
    pip install --no-cache-dir --no-deps langchain-core==0.2.43 langgraph==0.0.69 langchain==0.2.0 langchain-openai==0.1.0 && \
    pip install --no-cache-dir fastapi==0.110.0 uvicorn==0.27.1 sqlalchemy==2.0.27 psycopg2-binary==2.9.9 pydantic==2.6.1 pydantic-settings==2.2.1 python-multipart==0.0.9

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
