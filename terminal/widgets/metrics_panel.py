"""System metrics panel widget for the terminal UI."""

from textual.widgets import Static
from rich.text import Text


def _bar(percent: float, width: int = 20) -> str:
    """Create a text-based progress bar."""
    filled = int(percent / 100 * width)
    empty = width - filled

    if percent < 50:
        color = "green"
    elif percent < 75:
        color = "yellow"
    elif percent < 90:
        color = "dark_orange"
    else:
        color = "red"

    return f"[{color}]{'█' * filled}[/{color}][grey42]{'░' * empty}[/grey42]"


def _format_bytes(b: int) -> str:
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if abs(b) < 1024.0:
            return f"{b:.1f}{unit}"
        b /= 1024
    return f"{b:.1f}PB"


class MetricsPanelWidget(Static):
    """Displays real-time system metrics."""

    DEFAULT_CSS = """
    MetricsPanelWidget {
        height: 100%;
        padding: 1;
    }
    """

    def __init__(self) -> None:
        super().__init__()
        self._metrics: dict | None = None

    def update_metrics(self, metrics: dict) -> None:
        """Update with new metrics data."""
        self._metrics = metrics
        self._render()

    def _render(self) -> None:
        if not self._metrics:
            self.update(Text("  Loading metrics...", style="dim"))
            return

        m = self._metrics
        cpu = m.get("cpu_percent", 0)
        mem = m.get("memory_percent", 0)
        disk = m.get("disk_percent", 0)
        sent = m.get("network_bytes_sent", 0)
        recv = m.get("network_bytes_recv", 0)
        conns = m.get("network_connections", 0)

        lines = [
            f"  CPU   {_bar(cpu)} {cpu:5.1f}%",
            f"  MEM   {_bar(mem)} {mem:5.1f}%",
            f"  DISK  {_bar(disk)} {disk:5.1f}%",
            "",
            f"  [dim]↑ Sent:[/dim] {_format_bytes(sent)}",
            f"  [dim]↓ Recv:[/dim] {_format_bytes(recv)}",
            f"  [dim]Conns:[/dim]  {conns}",
        ]

        from rich.markup import escape
        text = "\n".join(lines)
        self.update(Text.from_markup(text))
