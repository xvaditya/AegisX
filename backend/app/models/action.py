"""Action data models."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ActionType(str, Enum):
    BLOCK_IP = "block_ip"
    RESTART_SERVICE = "restart_service"
    RUN_SCAN = "run_scan"
    KILL_PROCESS = "kill_process"
    VIEW_LOGS = "view_logs"


class ActionStatus(str, Enum):
    PENDING = "pending"
    EXECUTING = "executing"
    SUCCESS = "success"
    FAILED = "failed"


class ActionRequest(BaseModel):
    """Request to execute an auto-response action."""

    action_type: ActionType
    target: str = ""  # IP, service name, PID, etc.
    incident_id: str = ""
    confirmed: bool = False


class ActionResponse(BaseModel):
    """Response after executing an action."""

    action_type: ActionType
    target: str
    status: ActionStatus
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)
    duration_ms: int = 0
