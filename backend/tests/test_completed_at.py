import pytest
from datetime import date, datetime, timezone
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_status_transition_rules_and_completed_at():
    """Verify status transition rules for completed_at timestamp:
    - non-done -> done: sets completed_at to current UTC time.
    - done -> done (editing other fields): preserves completed_at.
    - done -> non-done: clears completed_at (None).
    - reopening -> done: records new completion timestamp.
    """
    # 1. Create task in 'todo' status
    task_res = client.post(
        "/api/v1/tasks",
        json={"title": "Transition Task", "project_id": 1, "status": "todo"},
    )
    assert task_res.status_code == 201
    task_data = task_res.json()
    task_id = task_data["id"]
    assert task_data["completed_at"] is None

    # 2. Non-done -> done: sets completed_at
    done_res = client.patch(f"/api/v1/tasks/{task_id}/status", json={"status": "done"})
    assert done_res.status_code == 200
    first_completed_at = done_res.json()["completed_at"]
    assert first_completed_at is not None

    # 3. Done -> done while editing other fields (e.g. priority & description): preserves completed_at
    edit_res = client.put(
        f"/api/v1/tasks/{task_id}",
        json={"priority": "urgent", "description": "Editing completed task description"},
    )
    assert edit_res.status_code == 200
    assert edit_res.json()["completed_at"] == first_completed_at

    # 4. Done -> non-done ('in-progress'): clears completed_at
    reopen_res = client.patch(f"/api/v1/tasks/{task_id}/status", json={"status": "in-progress"})
    assert reopen_res.status_code == 200
    assert reopen_res.json()["completed_at"] is None

    # 5. Reopening and completing again: records new completion time
    recomplete_res = client.patch(f"/api/v1/tasks/{task_id}/status", json={"status": "done"})
    assert recomplete_res.status_code == 200
    second_completed_at = recomplete_res.json()["completed_at"]
    assert second_completed_at is not None

    # Clean up
    client.delete(f"/api/v1/tasks/{task_id}")


def test_editing_completed_task_does_not_shift_weekly_analytics():
    """Verify that editing a completed task does not shift historical completion dates in analytics."""
    # Create project and task in done status
    proj = client.post("/api/v1/projects", json={"name": "Analytics Preservation Proj", "workspace_id": 1}).json()
    p_id = proj["id"]

    task_res = client.post(
        "/api/v1/tasks",
        json={"title": "Weekly Analytics Task", "project_id": p_id, "status": "done"},
    ).json()
    t_id = task_res["id"]
    initial_completed_at = task_res["completed_at"]
    assert initial_completed_at is not None

    # Get initial analytics for workspace 1
    initial_analytics = client.get("/api/v1/analytics?workspace_id=1").json()
    today_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][date.today().weekday()]
    
    today_trend = next((item for item in initial_analytics["taskCompletionWeekly"] if item["day"] == today_name), None)
    initial_today_completed = today_trend["completed"] if today_trend else 0

    # Edit task priority/description without changing status
    client.put(f"/api/v1/tasks/{t_id}", json={"priority": "urgent", "description": "Updated detail"})

    # Re-query analytics
    updated_analytics = client.get("/api/v1/analytics?workspace_id=1").json()
    updated_today_trend = next((item for item in updated_analytics["taskCompletionWeekly"] if item["day"] == today_name), None)
    updated_today_completed = updated_today_trend["completed"] if updated_today_trend else 0

    # Weekly trend completion count for today should be unchanged!
    assert updated_today_completed == initial_today_completed

    # Clean up
    client.delete(f"/api/v1/tasks/{t_id}")
    client.delete(f"/api/v1/projects/{p_id}")


def test_legacy_null_completed_at_handling():
    """Verify legacy tasks with completed_at = NULL are included in overall completedTasks total,
    but excluded from dated weekly completion trend charts.
    """
    # Get baseline analytics
    base_analytics = client.get("/api/v1/analytics?workspace_id=1").json()
    base_total_completed = base_analytics["completedTasks"]

    today_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][date.today().weekday()]
    base_today_trend = next((item for item in base_analytics["taskCompletionWeekly"] if item["day"] == today_name), None)
    base_today_completed = base_today_trend["completed"] if base_today_trend else 0

    # Create a task in 'todo' status, then set status = 'done' with completed_at = None manually in DB (simulating legacy record)
    task_res = client.post("/api/v1/tasks", json={"title": "Legacy Null Task", "project_id": 1, "status": "todo"}).json()
    t_id = task_res["id"]

    # Directly set completed_at = None and status = 'done' via session
    from tests.conftest import TestingSessionLocal
    from app.models.task import Task
    db = TestingSessionLocal()
    try:
        t = db.query(Task).filter(Task.id == t_id).first()
        t.status = "done"
        t.completed_at = None
        db.commit()
    finally:
        db.close()

    # Re-query analytics
    new_analytics = client.get("/api/v1/analytics?workspace_id=1").json()
    new_total_completed = new_analytics["completedTasks"]
    new_today_trend = next((item for item in new_analytics["taskCompletionWeekly"] if item["day"] == today_name), None)
    new_today_completed = new_today_trend["completed"] if new_today_trend else 0

    # Total completed should increment by 1 (legacy task included in total KPI)
    assert new_total_completed == base_total_completed + 1

    # Weekly dated trend completion for today should NOT increment (legacy task excluded from dated chart)
    assert new_today_completed == base_today_completed

    # Clean up
    client.delete(f"/api/v1/tasks/{t_id}")
