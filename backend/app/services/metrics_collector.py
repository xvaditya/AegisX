"""System metrics collector using psutil."""

import psutil

from app.models.metric import SystemMetrics


def collect_metrics() -> SystemMetrics:
    """Collect current system metrics."""
    cpu = psutil.cpu_percent(interval=0.1)
    cpu_count = psutil.cpu_count(logical=True) or 1

    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()

    try:
        net_connections = len(psutil.net_connections(kind="inet"))
    except (psutil.AccessDenied, PermissionError):
        net_connections = 0

    return SystemMetrics(
        cpu_percent=cpu,
        cpu_count=cpu_count,
        memory_percent=mem.percent,
        memory_used_gb=round(mem.used / (1024**3), 2),
        memory_total_gb=round(mem.total / (1024**3), 2),
        disk_percent=disk.percent,
        disk_used_gb=round(disk.used / (1024**3), 2),
        disk_total_gb=round(disk.total / (1024**3), 2),
        network_bytes_sent=net.bytes_sent,
        network_bytes_recv=net.bytes_recv,
        network_connections=net_connections,
    )
