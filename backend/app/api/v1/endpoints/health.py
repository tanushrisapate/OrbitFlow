import time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get("", summary="General Health Check")
def health_check():
    """Verify backend API operational readiness."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


@router.get("/db", summary="Database Health Check")
def db_health_check(db: Session = Depends(get_db)):
    """Verify PostgreSQL database connectivity and measure query execution latency."""
    start_time = time.perf_counter()
    try:
        # Execute test query against PostgreSQL engine
        result = db.execute(text("SELECT 1")).scalar()
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

        if result == 1:
            return {
                "status": "healthy",
                "database": "connected",
                "engine": "PostgreSQL 17",
                "latency_ms": latency_ms,
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unexpected response from database query",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection failed: {str(e)}",
        )
