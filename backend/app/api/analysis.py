"""AI analysis API routes."""

from fastapi import APIRouter, HTTPException

from app.models.incident import AIAnalysis
from app.services.ai_analyzer import analyze_incident
from app.services.incident_engine import incident_engine

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("/", response_model=AIAnalysis)
async def get_analysis(incident_id: str):
    """Generate AI analysis for a specific incident."""
    incident = incident_engine.get_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return analyze_incident(incident)


@router.post("/analyze", response_model=AIAnalysis)
async def analyze_by_id(incident_id: str):
    """Alias endpoint for incident analysis."""
    incident = incident_engine.get_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return analyze_incident(incident)
