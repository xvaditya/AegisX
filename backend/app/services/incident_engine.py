"""Simulated incident generator.

Generates realistic cybersecurity/observability incidents at random intervals.
"""

import asyncio
import random
from datetime import datetime

from app.models.incident import Incident, IncidentType, Severity


# Incident templates for realistic simulation
INCIDENT_TEMPLATES: list[dict] = [
    {
        "type": IncidentType.BRUTE_FORCE,
        "severity_weights": {Severity.HIGH: 0.5, Severity.CRITICAL: 0.3, Severity.MEDIUM: 0.2},
        "services": ["auth-api", "ssh-gateway", "admin-portal", "vpn-gateway"],
        "descriptions": [
            "Multiple failed login attempts detected from {ip} — {count} attempts in {window}",
            "Brute-force attack targeting {service} from {ip} — rate limit exceeded",
            "Credential stuffing attack detected on {service} — {count} unique passwords tried",
            "Dictionary attack on {service} admin panel from {ip}",
        ],
    },
    {
        "type": IncidentType.API_500,
        "severity_weights": {Severity.HIGH: 0.4, Severity.MEDIUM: 0.4, Severity.CRITICAL: 0.2},
        "services": ["payment-api", "user-service", "order-service", "notification-api", "search-api"],
        "descriptions": [
            "Spike in 500 errors on {service} — {count} errors in last {window}",
            "{service} returning HTTP 500 — database connection pool exhausted",
            "Internal server error cascade on {service} — upstream dependency timeout",
            "{service} crash loop detected — OOM killer triggered",
        ],
    },
    {
        "type": IncidentType.CPU_OVERLOAD,
        "severity_weights": {Severity.MEDIUM: 0.3, Severity.HIGH: 0.4, Severity.CRITICAL: 0.3},
        "services": ["ml-pipeline", "data-processor", "cache-server", "web-server", "worker-node"],
        "descriptions": [
            "CPU usage at {cpu}% on {service} — sustained for {window}",
            "Runaway process on {service} consuming {cpu}% CPU",
            "{service} compute node overloaded — {cpu}% utilization, queue backing up",
            "CPU thermal throttling detected on {service} — {cpu}% load",
        ],
    },
    {
        "type": IncidentType.SUSPICIOUS_TRAFFIC,
        "severity_weights": {Severity.MEDIUM: 0.3, Severity.HIGH: 0.4, Severity.CRITICAL: 0.2, Severity.LOW: 0.1},
        "services": ["edge-proxy", "load-balancer", "cdn-node", "firewall", "dns-server"],
        "descriptions": [
            "Unusual traffic pattern from {ip} — potential DDoS reconnaissance",
            "Port scanning detected from {ip} targeting {service}",
            "Suspicious outbound traffic from {service} to known C2 server",
            "Anomalous DNS queries from {ip} — possible data exfiltration",
        ],
    },
    {
        "type": IncidentType.SERVICE_CRASH,
        "severity_weights": {Severity.HIGH: 0.4, Severity.CRITICAL: 0.5, Severity.MEDIUM: 0.1},
        "services": ["postgres-primary", "redis-cluster", "kafka-broker", "nginx-ingress", "vault-server"],
        "descriptions": [
            "{service} process terminated unexpectedly — exit code {exit_code}",
            "{service} failed health check {count} consecutive times",
            "Segmentation fault in {service} — core dump generated",
            "{service} out of memory — killed by OOM with {mem}GB RSS",
        ],
    },
]

# Random IPs for simulation
FAKE_IPS = [
    "192.168.1.105", "10.0.0.47", "203.0.113.42", "198.51.100.73",
    "172.16.0.89", "45.33.32.156", "91.198.174.192", "185.220.101.34",
    "104.244.72.115", "23.129.64.200", "178.62.196.12", "159.65.41.78",
]


def _weighted_choice(weights: dict) -> str:
    """Pick a random item based on weights."""
    items = list(weights.keys())
    probs = list(weights.values())
    return random.choices(items, weights=probs, k=1)[0]


def generate_incident() -> Incident:
    """Generate a single random incident."""
    template = random.choice(INCIDENT_TEMPLATES)
    severity = _weighted_choice(template["severity_weights"])
    service = random.choice(template["services"])
    ip = random.choice(FAKE_IPS)
    desc_template = random.choice(template["descriptions"])

    description = desc_template.format(
        ip=ip,
        service=service,
        count=random.randint(50, 5000),
        window=random.choice(["30s", "1m", "5m", "10m", "15m"]),
        cpu=random.randint(85, 99),
        exit_code=random.choice([1, 2, 11, 137, 139, 143]),
        mem=round(random.uniform(2.0, 32.0), 1),
    )

    return Incident(
        type=template["type"],
        severity=severity,
        source_ip=ip,
        affected_service=service,
        description=description,
        timestamp=datetime.now(),
    )


class IncidentEngine:
    """Background service that generates incidents on a timer."""

    def __init__(self, min_interval: float = 5.0, max_interval: float = 15.0):
        self.min_interval = min_interval
        self.max_interval = max_interval
        self.incidents: list[Incident] = []
        self._running = False
        self._task: asyncio.Task | None = None
        self._subscribers: list[asyncio.Queue] = []

    def subscribe(self) -> asyncio.Queue:
        """Subscribe to new incidents. Returns a queue that receives new incidents."""
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers.append(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue) -> None:
        """Unsubscribe from incident notifications."""
        if queue in self._subscribers:
            self._subscribers.remove(queue)

    async def _broadcast(self, incident: Incident) -> None:
        """Broadcast an incident to all subscribers."""
        for queue in self._subscribers:
            await queue.put(incident)

    async def _run_loop(self) -> None:
        """Main generation loop."""
        while self._running:
            interval = random.uniform(self.min_interval, self.max_interval)
            await asyncio.sleep(interval)

            if not self._running:
                break

            incident = generate_incident()
            self.incidents.append(incident)

            # Keep only last 100 incidents in memory
            if len(self.incidents) > 100:
                self.incidents = self.incidents[-100:]

            await self._broadcast(incident)

    async def start(self) -> None:
        """Start generating incidents."""
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._run_loop())

    async def stop(self) -> None:
        """Stop generating incidents."""
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

    def get_recent(self, limit: int = 20) -> list[Incident]:
        """Get the most recent incidents."""
        return list(reversed(self.incidents[-limit:]))

    def get_by_id(self, incident_id: str) -> Incident | None:
        """Get a specific incident by ID."""
        for incident in self.incidents:
            if incident.id == incident_id:
                return incident
        return None


# Singleton instance
incident_engine = IncidentEngine()
