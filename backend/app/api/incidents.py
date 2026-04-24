"""Incident API routes — REST + WebSocket."""

import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.models.incident import Incident
from app.services.incident_engine import incident_engine

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("/", response_model=list[Incident])
async def list_incidents(limit: int = 20):
    """Get the most recent incidents."""
    return incident_engine.get_recent(limit=limit)


@router.get("/{incident_id}", response_model=Incident | None)
async def get_incident(incident_id: str):
    """Get a specific incident by ID."""
    return incident_engine.get_by_id(incident_id)


@router.websocket("/ws")
async def incident_websocket(websocket: WebSocket):
    """WebSocket endpoint for live incident streaming."""
    await websocket.accept()
    queue = incident_engine.subscribe()

    try:
        while True:
            incident: Incident = await queue.get()
            await websocket.send_text(
                json.dumps(incident.model_dump(), default=str)
            )
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        incident_engine.unsubscribe(queue)
