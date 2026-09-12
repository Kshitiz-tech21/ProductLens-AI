#!/bin/bash
set -e

echo "Step 1: Installing Scientific Stack..."
pip install numpy==1.26.4 pandas==2.2.1 scipy==1.12.0 scikit-learn==1.4.1.post1

echo "Step 2: Installing AI Stack without dependencies to break resolver loop..."
pip install --no-deps langchain-core==0.2.43 langgraph==0.0.69 langchain==0.2.0 langchain-openai==0.1.0

echo "Step 3: Installing Web Stack..."
pip install fastapi==0.110.0 uvicorn==0.27.1 sqlalchemy==2.0.27 psycopg2-binary==2.9.9 pydantic==2.6.1 pydantic-settings==2.2.1 python-multipart==0.0.9

echo "Step 4: Installing AI stack dependencies manually (to avoid loop)..."
pip install openai tiktoken aiohttp PyYAML
