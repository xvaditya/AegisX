"""Auto-response action API routes."""

from fastapi import APIRouter

from app.models.action import ActionRequest, ActionResponse
from app.services.action_executor import execute_action

router = APIRouter(prefix="/api/actions", tags=["actions"])


@router.post("/execute", response_model=ActionResponse)
async def execute(request: ActionRequest):
    """Execute an auto-response action."""
    return await execute_action(request)
