import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add backend to path so we can import from app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app
from app.core.db import Base, get_db
from app.analytics.seed import generate_synthetic_data

# Test Database - Using a unique filename for each test session to avoid IntegrityErrors
import uuid
test_db_name = f"test_{uuid.uuid4().hex}.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{test_db_name}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    generate_synthetic_data(db, scale_factor=0.1)
    db.close()

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    assert "MAU" in response.json()

def test_anomaly_detection():
    response = client.get("/api/analytics/anomalies")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_ab_analysis():
    response = client.get("/api/analytics/experiments/1/analysis")
    assert response.status_code == 200
    assert "p_value" in response.json()
