"""System metrics data models."""

from datetime import datetime

from pydantic import BaseModel, Field


class SystemMetrics(BaseModel):
    """Current system resource metrics."""

    timestamp: datetime = Field(default_factory=datetime.now)
    cpu_percent: float = 0.0
    cpu_count: int = 1
    memory_percent: float = 0.0
    memory_used_gb: float = 0.0
    memory_total_gb: float = 0.0
    disk_percent: float = 0.0
    disk_used_gb: float = 0.0
    disk_total_gb: float = 0.0
    network_bytes_sent: int = 0
    network_bytes_recv: int = 0
    network_connections: int = 0
