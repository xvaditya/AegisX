"""Action executor — simulated for MVP.

Simulates executing auto-response actions with realistic delays.
Designed to be replaced with real system commands in production.
"""

import asyncio
import random
from datetime import datetime

from app.models.action import ActionRequest, ActionResponse, ActionStatus, ActionType


# Simulated action details
_ACTION_DETAILS: dict[ActionType, dict] = {
    ActionType.BLOCK_IP: {
        "messages": [
            "Successfully blocked IP {target} via iptables rule.",
            "IP {target} added to firewall blocklist. Rule ID: FW-{rand}.",
            "Blocked all inbound/outbound traffic from {target}. Duration: 24h.",
        ],
        "duration_range": (800, 2500),
        "fail_rate": 0.05,
    },
    ActionType.RESTART_SERVICE: {
        "messages": [
            "Service {target} restarted successfully. Uptime: 0s, PID: {rand}.",
            "{target} gracefully stopped and restarted. Health check passed.",
            "Rolling restart of {target} completed. All instances healthy.",
        ],
        "duration_range": (2000, 8000),
        "fail_rate": 0.10,
    },
    ActionType.RUN_SCAN: {
        "messages": [
            "Security scan completed on {target}. No additional threats found.",
            "Vulnerability scan of {target} finished. 0 critical, 2 medium findings.",
            "Full system scan completed. {target} infrastructure shows no compromise.",
        ],
        "duration_range": (5000, 15000),
        "fail_rate": 0.02,
    },
    ActionType.KILL_PROCESS: {
        "messages": [
            "Process {target} (PID) terminated with SIGKILL.",
            "Successfully killed process {target}. Resources freed.",
            "Process {target} terminated. CPU usage dropped to normal levels.",
        ],
        "duration_range": (200, 1000),
        "fail_rate": 0.08,
    },
    ActionType.VIEW_LOGS: {
        "messages": [
            "Fetched last 100 lines from {target} logs. Analysis available.",
            "Log stream for {target} captured. Forwarded to analysis engine.",
            "Retrieved {target} logs for the last 30 minutes.",
        ],
        "duration_range": (500, 2000),
        "fail_rate": 0.01,
    },
}

_FAIL_MESSAGES = [
    "Action failed: insufficient permissions to execute on {target}.",
    "Execution timeout while processing action for {target}.",
    "Connection refused — {target} agent is unresponsive.",
]


async def execute_action(request: ActionRequest) -> ActionResponse:
    """Execute a simulated auto-response action.

    In production, this would shell out to actual system commands
    or call infrastructure APIs (Kubernetes, AWS, etc.).
    """
    details = _ACTION_DETAILS[request.action_type]
    duration_ms = random.randint(*details["duration_range"])

    # Simulate execution time
    await asyncio.sleep(duration_ms / 1000.0)

    # Simulate occasional failures
    if random.random() < details["fail_rate"]:
        return ActionResponse(
            action_type=request.action_type,
            target=request.target,
            status=ActionStatus.FAILED,
            message=random.choice(_FAIL_MESSAGES).format(target=request.target),
            timestamp=datetime.now(),
            duration_ms=duration_ms,
        )

    msg = random.choice(details["messages"]).format(
        target=request.target,
        rand=random.randint(10000, 99999),
    )

    return ActionResponse(
        action_type=request.action_type,
        target=request.target,
        status=ActionStatus.SUCCESS,
        message=msg,
        timestamp=datetime.now(),
        duration_ms=duration_ms,
    )
