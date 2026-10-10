import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_general_health_check():
    """Verify GET /api/v1/health returns HTTP 200 and healthy status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] in ["OrbitFlow", "DevTrack API"]
    assert "version" in data


def test_db_health_check():
    """Verify GET /api/v1/health/db successfully executes query against PostgreSQL."""
    response = client.get("/api/v1/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "PostgreSQL" in data["engine"]
    assert "latency_ms" in data
    assert isinstance(data["latency_ms"], float)
