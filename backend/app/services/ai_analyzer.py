"""AI Analysis Engine — simulated for MVP.

Generates structured incident analysis based on templates.
Designed to be swappable with a real LLM (OpenAI/Gemini) later.
"""

import random

from app.models.incident import AIAnalysis, Incident, IncidentType, Severity


# Analysis templates per incident type
_ANALYSIS_DB: dict[IncidentType, dict] = {
    IncidentType.BRUTE_FORCE: {
        "what": [
            "A sustained brute-force attack was detected targeting the {service} authentication endpoint.",
            "Multiple credential-stuffing attempts were observed against {service} from {ip}.",
            "An automated attack tool is systematically trying username/password combinations on {service}.",
        ],
        "why": [
            "The attacker is likely using a leaked credential database to gain unauthorized access.",
            "This appears to be an automated bot network testing stolen credentials from a recent data breach.",
            "The source IP {ip} is associated with known threat actor infrastructure.",
        ],
        "actions": [
            "Block source IP {ip} at the firewall and enable rate limiting on the auth endpoint.",
            "Immediately block {ip}, enforce MFA for all users on {service}, and rotate compromised credentials.",
            "Add {ip} to the blocklist, enable CAPTCHA on login, and alert the security team.",
        ],
        "teams": ["Security", "Security", "Backend"],
    },
    IncidentType.API_500: {
        "what": [
            "A surge of HTTP 500 errors was detected on {service}, indicating an internal server failure.",
            "{service} is experiencing cascading failures due to an upstream dependency timeout.",
            "The {service} application is crashing repeatedly — likely an out-of-memory condition.",
        ],
        "why": [
            "Database connection pool exhaustion caused by a sudden traffic spike or connection leak.",
            "An upstream service dependency became unresponsive, causing timeout cascades across the stack.",
            "A memory leak in recent deployment caused the application to exceed its container memory limit.",
        ],
        "actions": [
            "Restart {service} pods, increase connection pool size, and investigate the traffic source.",
            "Restart {service}, check upstream dependencies, and enable circuit breakers.",
            "Roll back the last deployment on {service} and investigate the memory leak.",
        ],
        "teams": ["Backend", "DevOps", "Backend"],
    },
    IncidentType.CPU_OVERLOAD: {
        "what": [
            "CPU utilization on {service} has exceeded safe thresholds, causing performance degradation.",
            "A runaway process on {service} is consuming excessive CPU resources.",
            "{service} compute nodes are overloaded, causing request queue backlog.",
        ],
        "why": [
            "An inefficient query or computation is monopolizing CPU cores without yielding.",
            "A background job or cron task is running unthrottled during peak hours.",
            "Insufficient horizontal scaling combined with a traffic surge is overwhelming the nodes.",
        ],
        "actions": [
            "Identify and kill the runaway process, then scale up {service} instances.",
            "Throttle the background job, add CPU limits to the container, and scale horizontally.",
            "Auto-scale {service} immediately and investigate the root cause of the CPU spike.",
        ],
        "teams": ["DevOps", "Backend", "DevOps"],
    },
    IncidentType.SUSPICIOUS_TRAFFIC: {
        "what": [
            "Unusual network traffic patterns were detected from {ip} targeting {service}.",
            "Port scanning activity from {ip} suggests reconnaissance for vulnerability exploitation.",
            "Anomalous outbound traffic from {service} to a known command-and-control server was detected.",
        ],
        "why": [
            "This is likely a precursor to a larger attack — the attacker is mapping the network topology.",
            "The traffic pattern matches known DDoS reconnaissance signatures from botnet infrastructure.",
            "A compromised container or process may be communicating with external threat actors.",
        ],
        "actions": [
            "Block {ip} immediately, capture traffic logs for forensic analysis, and alert the SOC.",
            "Enable DDoS protection, block {ip} at the edge, and increase logging verbosity.",
            "Isolate {service} immediately, run a malware scan, and initiate incident response protocol.",
        ],
        "teams": ["Security", "Security", "Security"],
    },
    IncidentType.SERVICE_CRASH: {
        "what": [
            "{service} has terminated unexpectedly and failed consecutive health checks.",
            "A segmentation fault in {service} caused the process to crash and generate a core dump.",
            "{service} was killed by the OS OOM killer due to excessive memory consumption.",
        ],
        "why": [
            "A null pointer dereference or buffer overflow in {service} triggered a fatal crash.",
            "Memory usage grew unbounded due to a leak, eventually exceeding the system's capacity.",
            "A corrupted configuration or dependency update caused {service} to enter a crash loop.",
        ],
        "actions": [
            "Restart {service} immediately, collect the core dump for analysis, and page on-call.",
            "Restart {service} with increased memory limits, investigate the OOM event, and roll back if needed.",
            "Restore {service} from last known good config, restart, and validate dependencies.",
        ],
        "teams": ["DevOps", "Backend", "DevOps"],
    },
}

# Confidence ranges by severity
_CONFIDENCE_RANGES: dict[Severity, tuple[float, float]] = {
    Severity.LOW: (0.80, 0.95),
    Severity.MEDIUM: (0.75, 0.90),
    Severity.HIGH: (0.70, 0.88),
    Severity.CRITICAL: (0.65, 0.85),
}


def analyze_incident(incident: Incident) -> AIAnalysis:
    """Generate AI analysis for a given incident.

    Uses template-based generation for MVP. Swap this function body
    with an LLM API call for production use.
    """
    db = _ANALYSIS_DB[incident.type]
    idx = random.randint(0, len(db["what"]) - 1)

    fmt = {"service": incident.affected_service, "ip": incident.source_ip}

    confidence_range = _CONFIDENCE_RANGES.get(incident.severity, (0.70, 0.90))
    confidence = round(random.uniform(*confidence_range), 2)

    severity_descriptions = {
        Severity.LOW: f"Low severity — monitoring recommended. {incident.affected_service} is still operational.",
        Severity.MEDIUM: f"Medium severity — investigation needed. {incident.affected_service} may be degraded.",
        Severity.HIGH: f"High severity — immediate action required. {incident.affected_service} is impacted.",
        Severity.CRITICAL: f"CRITICAL — emergency response required. {incident.affected_service} is DOWN or compromised.",
    }

    return AIAnalysis(
        incident_id=incident.id,
        what_happened=db["what"][idx].format(**fmt),
        why_it_happened=db["why"][idx].format(**fmt),
        affected_service=incident.affected_service,
        severity_assessment=severity_descriptions[incident.severity],
        suggested_action=db["actions"][idx].format(**fmt),
        responsible_team=db["teams"][idx],
        confidence=confidence,
    )
