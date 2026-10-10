import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_and_get_task():
    """Test creating a task under project #1 and retrieving it."""
    payload = {
        "title": "Build Test Feature",
        "description": "Task creation test",
        "project_id": 1,
        "status": "todo",
        "priority": "high",
        "assignee_id": "user-1",
    }
    create_res = client.post("/api/v1/tasks", json=payload)
    assert create_res.status_code == 201
    task_data = create_res.json()
    assert task_data["title"] == payload["title"]
    assert task_data["status"] == "todo"
    task_id = task_data["id"]

    # Get details
    get_res = client.get(f"/api/v1/tasks/{task_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == payload["title"]


def test_list_tasks_and_filter():
    """Test listing tasks and filtering by project_id and status."""
    res = client.get("/api/v1/tasks?project_id=1")
    assert res.status_code == 200
    tasks = res.json()
    assert isinstance(tasks, list)
    assert len(tasks) >= 1
    for t in tasks:
        assert t["project_id"] == 1


def test_update_task_and_status_patch():
    """Test updating task attributes and patching task workflow status."""
    payload = {
        "title": "Kanban Drag Task",
        "project_id": 1,
        "status": "todo",
        "priority": "medium",
    }
    task = client.post("/api/v1/tasks", json=payload).json()
    task_id = task["id"]

    # Patch status (dragging to in-progress)
    patch_res = client.patch(f"/api/v1/tasks/{task_id}/status", json={"status": "in-progress"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "in-progress"

    # Put update
    put_res = client.put(f"/api/v1/tasks/{task_id}", json={"priority": "urgent"})
    assert put_res.status_code == 200
    assert put_res.json()["priority"] == "urgent"


def test_delete_task():
    """Test deleting a task."""
    payload = {"title": "Temp Delete Task", "project_id": 1, "status": "todo"}
    task = client.post("/api/v1/tasks", json=payload).json()
    task_id = task["id"]

    del_res = client.delete(f"/api/v1/tasks/{task_id}")
    assert del_res.status_code == 200

    # Retrieve should 404
    assert client.get(f"/api/v1/tasks/{task_id}").status_code == 404


def test_invalid_task_status_validation():
    """Test invalid status validation returns 422 Unprocessable Entity."""
    payload = {
        "title": "Invalid Status Task",
        "project_id": 1,
        "status": "invalid-status-xyz",
    }
    res = client.post("/api/v1/tasks", json=payload)
    assert res.status_code == 422


def test_missing_resource_errors():
    """Test 404 errors for non-existent tasks or missing target projects."""
    # Missing project
    payload = {"title": "No Project Task", "project_id": 999999, "status": "todo"}
    res = client.post("/api/v1/tasks", json=payload)
    assert res.status_code == 404

    # Missing task
    assert client.get("/api/v1/tasks/999999").status_code == 404


def test_task_activity_logging():
    """Test that task creation, status update, and deletion log activity records."""
    task_res = client.post(
        "/api/v1/tasks",
        json={"title": "Audit Task", "project_id": 1, "status": "todo"},
    )
    assert task_res.status_code == 201
    t_id = task_res.json()["id"]

    # Patch status
    client.patch(f"/api/v1/tasks/{t_id}/status", json={"status": "done"})

    # Delete task
    client.delete(f"/api/v1/tasks/{t_id}")

    # Fetch activities
    act_res = client.get("/api/v1/activities")
    assert act_res.status_code == 200
    activities = act_res.json()
    targets = [a["target"] for a in activities]
    assert "Audit Task" in targets
