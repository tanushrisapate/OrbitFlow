import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_and_get_workspace():
    """Test creating a workspace and fetching it back."""
    payload = {
        "name": "Test Engineering Workspace",
        "description": "Integration test workspace description",
        "icon": "⚡",
        "color": "#6366f1",
    }
    create_res = client.post("/api/v1/workspaces", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == payload["name"]
    ws_id = created_data["id"]

    # Get workspace by ID
    get_res = client.get(f"/api/v1/workspaces/{ws_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == payload["name"]


def test_list_workspaces():
    """Test retrieving list of workspaces."""
    response = client.get("/api/v1/workspaces")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_update_and_delete_workspace():
    """Test updating and deleting a workspace."""
    payload = {"name": "Temporary WS", "description": "To be deleted"}
    ws = client.post("/api/v1/workspaces", json=payload).json()
    ws_id = ws["id"]

    # Update
    update_res = client.put(f"/api/v1/workspaces/{ws_id}", json={"name": "Updated WS Name"})
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Updated WS Name"

    # Delete
    del_res = client.delete(f"/api/v1/workspaces/{ws_id}")
    assert del_res.status_code == 200

    # Get should 404
    assert client.get(f"/api/v1/workspaces/{ws_id}").status_code == 404
