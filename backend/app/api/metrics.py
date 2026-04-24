"""System metrics API routes."""

from fastapi import APIRouter

from app.models.metric import SystemMetrics
from app.services.metrics_collector import collect_metrics

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("/", response_model=SystemMetrics)
async def get_metrics():
    """Get current system metrics."""
    return collect_metrics()
