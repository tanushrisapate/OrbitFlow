from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TasksByStatus(BaseModel):
    todo: int = 0
    inProgress: int = 0
    inReview: int = 0
    done: int = 0


class TasksByPriority(BaseModel):
    low: int = 0
    medium: int = 0
    high: int = 0
    urgent: int = 0


class WeeklyTrendDay(BaseModel):
    day: str
    created: int = 0
    completed: int = 0


class TeamWorkloadItem(BaseModel):
    name: str
    userId: str
    user_id: str
    total: int = 0
    tasks: int = 0
    completed: int = 0


class ProjectProgressItem(BaseModel):
    id: int
    name: str
    progress: int
    total_tasks: int = 0
    completed_tasks: int = 0


class AnalyticsSummaryOut(BaseModel):
    totalProjects: int = 0
    totalTasks: int = 0
    completedTasks: int = 0
    overdueTasks: int = 0
    completionRate: float = 0.0
    avgTaskDuration: float = 4.2
    tasksByStatus: TasksByStatus
    tasksByPriority: TasksByPriority
    taskCompletionWeekly: List[WeeklyTrendDay]
    teamWorkload: List[TeamWorkloadItem]
    projectProgress: List[ProjectProgressItem]

    model_config = ConfigDict(from_attributes=True)
