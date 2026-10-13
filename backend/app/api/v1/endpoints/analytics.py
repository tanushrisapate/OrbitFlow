from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db.session import get_db
from app.models.project import Project
from app.models.task import Task
from app.models.member import Member
from app.schemas.analytics import (
    AnalyticsSummaryOut,
    TasksByStatus,
    TasksByPriority,
    WeeklyTrendDay,
    TeamWorkloadItem,
    ProjectProgressItem,
)
from app.db.init_db import init_db

router = APIRouter()


@router.get("", response_model=AnalyticsSummaryOut, summary="Get Dashboard & Project Analytics")
def get_analytics(
    workspace_id: Optional[str] = None,
    period: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve comprehensive project analytics, task distributions, team workload, and completion KPIs."""
    init_db(db)

    # Base project query
    proj_query = db.query(Project)
    task_query = db.query(Task)

    if workspace_id:
        try:
            clean_ws_id = int(str(workspace_id).replace("ws-", "").strip())
            proj_query = proj_query.filter(Project.workspace_id == clean_ws_id)
            task_query = task_query.join(Project).filter(Project.workspace_id == clean_ws_id)
        except ValueError:
            pass

    # 1. Total counts
    total_projects = proj_query.count()
    total_tasks = task_query.count()

    completed_tasks = task_query.filter(Task.status == "done").count()
    
    # Overdue calculation: due_date < today AND status != 'done'
    today = date.today()
    overdue_tasks = task_query.filter(
        Task.due_date < today,
        Task.status != "done"
    ).count()

    # Completion Rate calculation
    completion_rate = (
        round((completed_tasks / total_tasks) * 100, 1) if total_tasks > 0 else 0.0
    )

    # 2. Status Breakdown
    status_counts = (
        db.query(Task.status, func.count(Task.id))
        .filter(Task.id.in_(task_query.with_entities(Task.id)))
        .group_by(Task.status)
        .all()
    )
    status_dict = {status_name.lower(): count for status_name, count in status_counts}
    
    tasks_by_status = TasksByStatus(
        todo=status_dict.get("todo", 0),
        inProgress=status_dict.get("in-progress", 0),
        inReview=status_dict.get("in-review", 0),
        done=status_dict.get("done", 0),
    )

    # 3. Priority Breakdown
    priority_counts = (
        db.query(Task.priority, func.count(Task.id))
        .filter(Task.id.in_(task_query.with_entities(Task.id)))
        .group_by(Task.priority)
        .all()
    )
    priority_dict = {p_name.lower(): count for p_name, count in priority_counts}
    
    tasks_by_priority = TasksByPriority(
        low=priority_dict.get("low", 0),
        medium=priority_dict.get("medium", 0),
        high=priority_dict.get("high", 0),
        urgent=priority_dict.get("urgent", 0),
    )

    # 4. Weekly Trend (Last 7 Days)
    days_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_trend = []
    
    # Generate past 7 days
    start_of_week = today - timedelta(days=6)
    for i in range(7):
        current_day = start_of_week + timedelta(days=i)
        day_name = days_map[current_day.weekday()]
        
        created_count = task_query.filter(
            func.date(Task.created_at) == current_day
        ).count()
        
        completed_count = task_query.filter(
            Task.status == "done",
            func.date(Task.completed_at) == current_day
        ).count()
        
        weekly_trend.append(WeeklyTrendDay(
            day=day_name,
            created=created_count,
            completed=completed_count
        ))

    # 5. Team Workload
    members = db.query(Member).all()
    team_workload = []
    for m in members:
        m_total = task_query.filter(Task.assignee_id == m.user_id).count()
        m_done = task_query.filter(Task.assignee_id == m.user_id, Task.status == "done").count()
        team_workload.append(TeamWorkloadItem(
            name=m.name,
            userId=m.user_id,
            user_id=m.user_id,
            total=m_total,
            tasks=m_total,
            completed=m_done
        ))

    # 6. Project Progress Breakdown
    projects = proj_query.all()
    project_progress = []
    for p in projects:
        p_tasks_total = db.query(Task).filter(Task.project_id == p.id).count()
        p_tasks_done = db.query(Task).filter(Task.project_id == p.id, Task.status == "done").count()
        
        calculated_progress = (
            round((p_tasks_done / p_tasks_total) * 100) if p_tasks_total > 0 else (p.progress or 0)
        )
        
        project_progress.append(ProjectProgressItem(
            id=p.id,
            name=p.name,
            progress=calculated_progress,
            total_tasks=p_tasks_total,
            completed_tasks=p_tasks_done
        ))

    # 7. Average Task Duration (in days) derived from real completed tasks
    completed_with_dates = [
        t for t in task_query.filter(
            Task.status == "done",
            Task.completed_at.isnot(None),
            Task.created_at.isnot(None)
        ).all()
    ]
    if completed_with_dates:
        total_duration_days = sum(
            max(0.0, (t.completed_at - t.created_at).total_seconds() / 86400.0)
            for t in completed_with_dates
        )
        avg_task_duration = round(total_duration_days / len(completed_with_dates), 1)
    else:
        avg_task_duration = 0.0

    return AnalyticsSummaryOut(
        totalProjects=total_projects,
        totalTasks=total_tasks,
        completedTasks=completed_tasks,
        overdueTasks=overdue_tasks,
        completionRate=completion_rate,
        avgTaskDuration=avg_task_duration,
        tasksByStatus=tasks_by_status,
        tasksByPriority=tasks_by_priority,
        taskCompletionWeekly=weekly_trend,
        teamWorkload=team_workload,
        projectProgress=project_progress
    )
