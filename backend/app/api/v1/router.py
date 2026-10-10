from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    workspaces,
    projects,
    tasks,
    comments,
    activities,
    members,
    analytics,
)

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(comments.router, tags=["Comments"])
api_router.include_router(activities.router, prefix="/activities", tags=["Activities"])
api_router.include_router(members.router, prefix="/members", tags=["Members"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
