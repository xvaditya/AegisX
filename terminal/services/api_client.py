"""API client for communicating with the AegisX backend."""

import httpx

from config import BACKEND_URL


class APIClient:
    """HTTP client for the FastAPI backend."""

    def __init__(self, base_url: str = BACKEND_URL):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=base_url, timeout=10.0)

    async def get_incidents(self, limit: int = 20) -> list[dict]:
        """Fetch recent incidents."""
        try:
            resp = await self.client.get(f"/api/incidents/?limit={limit}")
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return []

    async def get_metrics(self) -> dict | None:
        """Fetch system metrics."""
        try:
            resp = await self.client.get("/api/metrics/")
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return None

    async def get_analysis(self, incident_id: str) -> dict | None:
        """Get AI analysis for an incident."""
        try:
            resp = await self.client.post(
                f"/api/analysis/?incident_id={incident_id}"
            )
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return None

    async def execute_action(self, action_type: str, target: str, incident_id: str = "") -> dict | None:
        """Execute an auto-response action."""
        try:
            resp = await self.client.post(
                "/api/actions/execute",
                json={
                    "action_type": action_type,
                    "target": target,
                    "incident_id": incident_id,
                    "confirmed": True,
                },
            )
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return None

    async def close(self):
        await self.client.aclose()
