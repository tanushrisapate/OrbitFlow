import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_and_get_project():
    """Test creating a project under workspace #1 and retrieving it."""
    payload = {
        "name": "Integration Test Project",
        "description": "Testing project creation",
        "workspace_id": 1,
        "status": "active",
        "progress": 40,
        "icon": "🔧",
        "color": "#8b5cf6",
    }
    create_res = client.post("/api/v1/projects", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == payload["name"]
    proj_id = created_data["id"]

    # Get project by ID
    get_res = client.get(f"/api/v1/projects/{proj_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == payload["name"]


def test_list_projects_filter():
    """Test listing projects filtered by workspace_id."""
    response = client.get("/api/v1/projects?workspace_id=1")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for p in data:
        assert p["workspace_id"] == 1


def test_update_and_delete_project():
    """Test updating and deleting a project."""
    payload = {
        "name": "Temp Project",
        "workspace_id": 1,
        "status": "active",
        "progress": 10,
    }
    proj = client.post("/api/v1/projects", json=payload).json()
    proj_id = proj["id"]

    # Update progress & status
    up_res = client.put(f"/api/v1/projects/{proj_id}", json={"progress": 100, "status": "completed"})
    assert up_res.status_code == 200
    assert up_res.json()["progress"] == 100
    assert up_res.json()["status"] == "completed"

    # Delete
    del_res = client.delete(f"/api/v1/projects/{proj_id}")
    assert del_res.status_code == 200


def test_project_dynamic_task_counts():
    """Test that project total_tasks and completed_tasks dynamically compute from database tasks."""
    proj = client.post(
        "/api/v1/projects",
        json={"name": "Counts Test Proj", "workspace_id": 1, "status": "active"},
    ).json()
    p_id = proj["id"]

    # Initially 0 tasks
    get_res = client.get(f"/api/v1/projects/{p_id}")
    assert get_res.status_code == 200
    p_data = get_res.json()
    assert p_data["total_tasks"] == 0
    assert p_data["completed_tasks"] == 0

    # Add 1 todo task and 1 done task
    client.post("/api/v1/tasks", json={"title": "T1", "project_id": p_id, "status": "todo"})
    client.post("/api/v1/tasks", json={"title": "T2", "project_id": p_id, "status": "done"})

    # Check updated counts
    updated_res = client.get(f"/api/v1/projects/{p_id}")
    assert updated_res.status_code == 200
    updated_data = updated_res.json()
    assert updated_data["total_tasks"] == 2
    assert updated_data["completed_tasks"] == 1

    # Delete
    del_res = client.delete(f"/api/v1/projects/{p_id}")
    assert del_res.status_code == 200
