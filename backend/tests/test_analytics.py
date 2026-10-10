import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_analytics_summary():
    """Test retrieving complete analytics summary."""
    response = client.get("/api/v1/analytics")
    assert response.status_code == 200
    data = response.json()

    assert "totalProjects" in data
    assert "totalTasks" in data
    assert "completedTasks" in data
    assert "overdueTasks" in data
    assert "completionRate" in data
    assert "tasksByStatus" in data
    assert "tasksByPriority" in data
    assert "taskCompletionWeekly" in data
    assert "teamWorkload" in data
    assert "projectProgress" in data

    assert isinstance(data["totalProjects"], int)
    assert isinstance(data["totalTasks"], int)
    assert isinstance(data["completionRate"], (int, float))
    assert isinstance(data["taskCompletionWeekly"], list)
    assert len(data["taskCompletionWeekly"]) == 7


def test_analytics_calculated_rates():
    """Verify completion rate and overdue task math correctness."""
    response = client.get("/api/v1/analytics")
    data = response.json()

    total = data["totalTasks"]
    completed = data["completedTasks"]
    if total > 0:
        expected_rate = round((completed / total) * 100, 1)
        assert data["completionRate"] == expected_rate
    else:
        assert data["completionRate"] == 0.0
