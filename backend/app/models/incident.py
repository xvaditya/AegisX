"""Incident data models."""

from datetime import datetime
from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, Field


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentType(str, Enum):
    BRUTE_FORCE = "brute_force"
    API_500 = "api_500"
    CPU_OVERLOAD = "cpu_overload"
    SUSPICIOUS_TRAFFIC = "suspicious_traffic"
    SERVICE_CRASH = "service_crash"


class Incident(BaseModel):
    """Represents a security/observability incident."""

    id: str = Field(default_factory=lambda: uuid4().hex[:12])
    type: IncidentType
    severity: Severity
    timestamp: datetime = Field(default_factory=datetime.now)
    source_ip: str = ""
    affected_service: str = ""
    description: str = ""
    is_resolved: bool = False


class AIAnalysis(BaseModel):
    """AI-generated analysis for an incident."""

    incident_id: str
    what_happened: str
    why_it_happened: str
    affected_service: str
    severity_assessment: str
    suggested_action: str
    responsible_team: str
    confidence: float = 0.0
