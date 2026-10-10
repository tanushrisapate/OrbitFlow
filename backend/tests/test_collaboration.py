import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_comments_api():
    """Test posting and retrieving comments for a task."""
    # Post comment
    res = client.post("/api/v1/tasks/1/comments", json={"content": "Test integration comment"})
    assert res.status_code == 201
    cmt_data = res.json()
    assert cmt_data["content"] == "Test integration comment"
    assert cmt_data["task_id"] == 1

    # Get comments for task #1
    get_res = client.get("/api/v1/tasks/1/comments")
    assert get_res.status_code == 200
    comments = get_res.json()
    assert isinstance(comments, list)
    assert any(c["content"] == "Test integration comment" for c in comments)


def test_activities_feed_api():
    """Test retrieving activity history feed."""
    res = client.get("/api/v1/activities")
    assert res.status_code == 200
    activities = res.json()
    assert isinstance(activities, list)
    assert len(activities) >= 1


def test_members_crud_api():
    """Test workspace team member operations."""
    # List members
    list_res = client.get("/api/v1/members?workspace_id=1")
    assert list_res.status_code == 200
    members = list_res.json()
    assert isinstance(members, list)

    # Invite member
    invite_res = client.post(
        "/api/v1/members/invite",
        json={"email": "newmember@example.com", "role": "Member", "workspace_id": 1},
    )
    assert invite_res.status_code == 201
    new_member = invite_res.json()
    user_id = new_member["user_id"]
    assert new_member["email"] == "newmember@example.com"

    # Update role
    role_res = client.put(f"/api/v1/members/{user_id}/role", json={"workspace_id": 1, "role": "Admin"})
    assert role_res.status_code == 200
    assert role_res.json()["role"] == "Admin"

    # Delete member
    del_res = client.delete(f"/api/v1/members/{user_id}?workspace_id=1")
    assert del_res.status_code == 200
