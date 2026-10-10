import pytest
from datetime import date, timedelta, datetime
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.project import Project
from app.models.task import Task
from app.models.comment import Comment
from app.models.member import Member
from app.models.activity import Activity

client = TestClient(app)


# -------------------------------------------------------------------
# Phase 2 & Phase 3 & Phase 5: Comprehensive QA Test Suite
# -------------------------------------------------------------------

def test_phase2_fake_data_and_mathematical_analytics():
    """Build fake data (2 workspaces, 3 projects, 10 tasks, comments, members)
    and verify mathematical accuracy of analytics endpoints."""

    # 1. Create 2 Workspaces
    ws1 = client.post("/api/v1/workspaces", json={"name": "QA Workspace Alpha", "description": "Primary QA WS"}).json()
    ws2 = client.post("/api/v1/workspaces", json={"name": "QA Workspace Beta", "description": "Secondary QA WS"}).json()
    ws1_id = ws1["id"]
    ws2_id = ws2["id"]

    # 2. Create 3 Projects (2 in WS1, 1 in WS2)
    p1 = client.post("/api/v1/projects", json={"name": "Frontend App", "workspace_id": ws1_id, "status": "active"}).json()
    p2 = client.post("/api/v1/projects", json={"name": "Backend API", "workspace_id": ws1_id, "status": "active"}).json()
    p3 = client.post("/api/v1/projects", json={"name": "Mobile App", "workspace_id": ws2_id, "status": "planning"}).json()
    p1_id, p2_id, p3_id = p1["id"], p2["id"], p3["id"]

    # 3. Create 10 Tasks with distinct statuses, priorities, due dates
    today = date.today()
    yesterday = today - timedelta(days=2)
    tomorrow = today + timedelta(days=2)

    tasks_def = [
        # Project 1 Tasks (5 tasks)
        {"title": "Task 1", "project_id": p1_id, "status": "todo", "priority": "low", "due_date": str(tomorrow)},
        {"title": "Task 2", "project_id": p1_id, "status": "in-progress", "priority": "medium", "due_date": str(yesterday)}, # Overdue!
        {"title": "Task 3", "project_id": p1_id, "status": "in-review", "priority": "high", "due_date": str(tomorrow)},
        {"title": "Task 4", "project_id": p1_id, "status": "done", "priority": "urgent", "due_date": str(yesterday)}, # Done (not overdue)
        {"title": "Task 5", "project_id": p1_id, "status": "done", "priority": "low", "due_date": str(tomorrow)},

        # Project 2 Tasks (3 tasks)
        {"title": "Task 6", "project_id": p2_id, "status": "todo", "priority": "medium", "due_date": str(yesterday)}, # Overdue!
        {"title": "Task 7", "project_id": p2_id, "status": "in-progress", "priority": "high", "due_date": str(tomorrow)},
        {"title": "Task 8", "project_id": p2_id, "status": "done", "priority": "urgent", "due_date": str(yesterday)},

        # Project 3 Tasks (2 tasks in WS2)
        {"title": "Task 9", "project_id": p3_id, "status": "todo", "priority": "high", "due_date": str(tomorrow)},
        {"title": "Task 10", "project_id": p3_id, "status": "done", "priority": "low", "due_date": str(tomorrow)},
    ]

    created_tasks = []
    for t in tasks_def:
        res = client.post("/api/v1/tasks", json=t)
        assert res.status_code == 201
        created_tasks.append(res.json())

    assert len(created_tasks) == 10

    # 4. Verify mathematical calculations on WS1 Analytics
    # In WS1: 2 Projects (p1, p2), 8 Tasks total (t1-t5 in p1, t6-t8 in p2)
    # Statuses in WS1: todo:2, in-progress:2, in-review:1, done:3. Total=8.
    # Completed in WS1: 3
    # Overdue in WS1: Task 2 (due yesterday, in-progress), Task 6 (due yesterday, todo). Total = 2.
    # Completion rate in WS1: round((3 / 8) * 100, 1) = 37.5%

    ws1_analytics = client.get(f"/api/v1/analytics?workspace_id={ws1_id}").json()
    assert ws1_analytics["totalProjects"] == 2
    assert ws1_analytics["totalTasks"] == 8
    assert ws1_analytics["completedTasks"] == 3
    assert ws1_analytics["overdueTasks"] == 2
    assert ws1_analytics["completionRate"] == 37.5

    assert ws1_analytics["tasksByStatus"]["todo"] == 2
    assert ws1_analytics["tasksByStatus"]["inProgress"] == 2
    assert ws1_analytics["tasksByStatus"]["inReview"] == 1
    assert ws1_analytics["tasksByStatus"]["done"] == 3

    # 5. Verify Per-Project Dynamic Task Counts
    p1_get = client.get(f"/api/v1/projects/{p1_id}").json()
    assert p1_get["total_tasks"] == 5
    assert p1_get["completed_tasks"] == 2

    p2_get = client.get(f"/api/v1/projects/{p2_id}").json()
    assert p2_get["total_tasks"] == 3
    assert p2_get["completed_tasks"] == 1


def test_phase3_crud_validations_and_cascade_delete():
    """Verify input validation, foreign key integrity, and cascade deletion."""
    # 1. Invalid Task Status Validation
    invalid_task_res = client.post("/api/v1/tasks", json={"title": "Invalid Status", "project_id": 1, "status": "not-a-valid-status"})
    assert invalid_task_res.status_code == 422

    # 2. Invalid Task Priority Validation
    invalid_priority_res = client.post("/api/v1/tasks", json={"title": "Invalid Priority", "project_id": 1, "priority": "super-urgent"})
    assert invalid_priority_res.status_code == 422

    # 3. Create isolated workspace with project and tasks
    ws = client.post("/api/v1/workspaces", json={"name": "Cascade Test Workspace"}).json()
    ws_id = ws["id"]
    proj = client.post("/api/v1/projects", json={"name": "Cascade Proj", "workspace_id": ws_id}).json()
    p_id = proj["id"]
    t1 = client.post("/api/v1/tasks", json={"title": "Cascade Task 1", "project_id": p_id}).json()
    t_id = t1["id"]

    # Verify task exists
    assert client.get(f"/api/v1/tasks/{t_id}").status_code == 200

    # Delete Parent Workspace
    del_ws = client.delete(f"/api/v1/workspaces/{ws_id}")
    assert del_ws.status_code == 200

    # Verify Project and Task were cascade-deleted in PostgreSQL
    assert client.get(f"/api/v1/projects/{p_id}").status_code == 404
    assert client.get(f"/api/v1/tasks/{t_id}").status_code == 404


def test_phase4_empty_database_analytics_behavior():
    """Verify system health and empty state analytics return valid defaults without errors."""
    res = client.get("/api/v1/analytics?workspace_id=99999")
    assert res.status_code == 200
    data = res.json()
    assert data["totalProjects"] == 0
    assert data["totalTasks"] == 0
    assert data["completedTasks"] == 0
    assert data["overdueTasks"] == 0
    assert data["completionRate"] == 0.0
    assert data["tasksByStatus"]["todo"] == 0
    assert data["tasksByStatus"]["done"] == 0
