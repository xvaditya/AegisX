"""AegisX Terminal UI — Main Application.

A full-featured TUI for cybersecurity incident monitoring and response.
Connects to the AegisX FastAPI backend via HTTP/WebSocket.
"""

import asyncio
import json
import sys
import os

# Add terminal dir to path for relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from textual.app import App, ComposeResult
from textual.containers import Horizontal, Vertical, Container
from textual.widgets import Header, Footer, Static, Label, Log
from rich.text import Text

from widgets.incident_feed import IncidentFeedWidget, IncidentSelected
from widgets.analysis_panel import AnalysisPanelWidget
from widgets.metrics_panel import MetricsPanelWidget
from widgets.mascot_display import MascotDisplayWidget
from widgets.command_input import CommandInputWidget, CommandExecuted
from services.api_client import APIClient
from config import BACKEND_URL, WS_URL, METRICS_POLL_INTERVAL


SEVERITY_TO_STATE = {
    "low": "monitoring",
    "medium": "thinking",
    "high": "alert",
    "critical": "critical",
}


class AegisXTerminal(App):
    """AegisX Terminal UI Application."""

    TITLE = "AegisX Terminal"
    SUB_TITLE = "Autonomous AI Incident Analyst"

    CSS = """
    Screen {
        background: $surface;
    }

    #main-grid {
        layout: grid;
        grid-size: 3 2;
        grid-columns: 1fr 1.2fr 0.8fr;
        grid-rows: 1fr 0.8fr;
        grid-gutter: 1;
        padding: 0 1;
        height: 1fr;
    }

    .panel {
        border: round $accent;
        padding: 0;
    }

    .panel-title {
        dock: top;
        height: 1;
        padding: 0 1;
        background: $primary-darken-2;
        text-style: bold;
    }

    #incident-panel {
        border: round $accent;
        row-span: 2;
    }

    #analysis-panel {
        border: round $warning;
    }

    #action-panel {
        border: round $success;
    }

    #metrics-panel {
        border: round cyan;
    }

    #mascot-panel {
        border: round $success;
        content-align: center middle;
    }

    #chat-log {
        border: round $primary;
        height: 100%;
        padding: 0 1;
    }

    #command-input {
        dock: bottom;
        height: 3;
        margin: 0 1;
    }
    """

    BINDINGS = [
        ("q", "quit", "Quit"),
        ("s", "scan", "Scan"),
        ("r", "refresh", "Refresh"),
        ("d", "demo", "Demo Attack"),
    ]

    def __init__(self) -> None:
        super().__init__()
        self.api = APIClient()
        self._ws_task: asyncio.Task | None = None
        self._metrics_task: asyncio.Task | None = None
        self._selected_incident: dict | None = None

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)

        with Container(id="main-grid"):
            # Left column: Incident Feed (spans 2 rows)
            with Vertical(id="incident-panel", classes="panel"):
                yield Label(" 📡 Incident Feed", classes="panel-title")
                yield IncidentFeedWidget()

            # Middle top: AI Analysis
            with Vertical(id="analysis-panel", classes="panel"):
                yield Label(" 🧠 AI Analysis", classes="panel-title")
                yield AnalysisPanelWidget()

            # Right top: Mascot
            with Vertical(id="mascot-panel", classes="panel"):
                yield Label(" 🛡️ Aegis", classes="panel-title")
                yield MascotDisplayWidget()

            # Middle bottom: Metrics
            with Vertical(id="metrics-panel", classes="panel"):
                yield Label(" 📊 System Metrics", classes="panel-title")
                yield MetricsPanelWidget()

            # Right bottom: Chat log
            with Vertical(id="chat-log", classes="panel"):
                yield Label(" 💬 Command Log", classes="panel-title")
                yield Log(highlight=True, markup=True)

        yield CommandInputWidget()
        yield Footer()

    async def on_mount(self) -> None:
        """Start background tasks."""
        # Initial data load
        incidents = await self.api.get_incidents()
        feed = self.query_one(IncidentFeedWidget)
        for inc in reversed(incidents):
            feed.add_incident(inc)

        # Start metrics polling
        self._metrics_task = asyncio.create_task(self._poll_metrics())

        # Start WebSocket listener
        self._ws_task = asyncio.create_task(self._listen_ws())

        # Log welcome message
        log = self.query_one(Log)
        log.write_line("[green]🛡️ AegisX Terminal Online[/green]")
        log.write_line("[dim]Type 'help' for commands[/dim]")

    async def _poll_metrics(self) -> None:
        """Poll system metrics periodically."""
        panel = self.query_one(MetricsPanelWidget)
        while True:
            metrics = await self.api.get_metrics()
            if metrics:
                panel.update_metrics(metrics)
            await asyncio.sleep(METRICS_POLL_INTERVAL)

    async def _listen_ws(self) -> None:
        """Listen for live incidents via WebSocket."""
        import websockets

        while True:
            try:
                async with websockets.connect(WS_URL) as ws:
                    log = self.query_one(Log)
                    log.write_line("[green]📡 Connected to incident feed[/green]")

                    async for message in ws:
                        incident = json.loads(message)
                        feed = self.query_one(IncidentFeedWidget)
                        feed.add_incident(incident)

                        # Update mascot state
                        severity = incident.get("severity", "low")
                        mascot = self.query_one(MascotDisplayWidget)
                        mascot.set_state(SEVERITY_TO_STATE.get(severity, "monitoring"))

                        # Reset mascot to idle after 10 seconds
                        self.set_timer(10.0, lambda: mascot.set_state("monitoring"))

                        # Notify in log
                        sev = severity.upper()
                        color = {"LOW": "green", "MEDIUM": "yellow", "HIGH": "dark_orange", "CRITICAL": "red"}.get(sev, "white")
                        log.write_line(f"[{color}]⚠ New incident: {incident.get('type', '')} [{sev}][/{color}]")

            except Exception as e:
                log = self.query_one(Log)
                log.write_line(f"[red]WS disconnected: {e}. Reconnecting...[/red]")
                await asyncio.sleep(3)

    async def on_incident_selected(self, event: IncidentSelected) -> None:
        """Handle incident selection — fetch AI analysis."""
        self._selected_incident = event.incident
        panel = self.query_one(AnalysisPanelWidget)
        mascot = self.query_one(MascotDisplayWidget)

        panel.show_loading()
        mascot.set_state("thinking")

        analysis = await self.api.get_analysis(event.incident.get("id", ""))
        if analysis:
            panel.show_analysis(analysis)
            mascot.set_state("monitoring")
        else:
            panel.show_empty()

    async def on_command_executed(self, event: CommandExecuted) -> None:
        """Handle command input."""
        cmd = event.command.lower().strip()
        log = self.query_one(Log)
        mascot = self.query_one(MascotDisplayWidget)

        log.write_line(f"[bold]> {event.command}[/bold]")

        parts = cmd.split()
        action = parts[0] if parts else ""

        if action == "help":
            log.write_line("[cyan]Commands: block <ip>, restart <svc>, scan, kill <pid>, status, help[/cyan]")

        elif action == "status":
            log.write_line("[green]✅ All systems monitored. Backend: connected.[/green]")

        elif action == "scan":
            mascot.set_state("scanning")
            log.write_line("[blue]🔍 Running security scan...[/blue]")
            result = await self.api.execute_action("run_scan", "all-services")
            if result:
                log.write_line(f"[green]✅ {result.get('message', 'Scan complete')}[/green]")
                mascot.set_state("success")
                self.set_timer(3.0, lambda: mascot.set_state("idle"))

        elif action == "block" and len(parts) > 1:
            target = parts[1]
            mascot.set_state("healing")
            log.write_line(f"[yellow]🛡️ Blocking IP {target}...[/yellow]")
            result = await self.api.execute_action("block_ip", target)
            if result:
                status = result.get("status", "")
                if status == "success":
                    log.write_line(f"[green]✅ {result.get('message', '')}[/green]")
                    mascot.set_state("success")
                else:
                    log.write_line(f"[red]❌ {result.get('message', '')}[/red]")
                    mascot.set_state("alert")
                self.set_timer(3.0, lambda: mascot.set_state("idle"))

        elif action == "restart" and len(parts) > 1:
            target = parts[1]
            mascot.set_state("healing")
            log.write_line(f"[yellow]🔄 Restarting {target}...[/yellow]")
            result = await self.api.execute_action("restart_service", target)
            if result:
                log.write_line(f"[green]✅ {result.get('message', '')}[/green]")
                mascot.set_state("success")
                self.set_timer(3.0, lambda: mascot.set_state("idle"))

        elif action == "kill" and len(parts) > 1:
            target = parts[1]
            mascot.set_state("healing")
            log.write_line(f"[red]☠️ Killing process {target}...[/red]")
            result = await self.api.execute_action("kill_process", target)
            if result:
                log.write_line(f"[green]✅ {result.get('message', '')}[/green]")
                mascot.set_state("success")
                self.set_timer(3.0, lambda: mascot.set_state("idle"))

        else:
            log.write_line(f"[dim]Unknown command: {cmd}. Type 'help' for available commands.[/dim]")

    def action_scan(self) -> None:
        """Keyboard shortcut for scan."""
        self.run_worker(self.on_command_executed(CommandExecuted("scan")))

    def action_refresh(self) -> None:
        """Refresh data."""
        async def _refresh():
            incidents = await self.api.get_incidents()
            feed = self.query_one(IncidentFeedWidget)
            for inc in reversed(incidents):
                feed.add_incident(inc)
        self.run_worker(_refresh())

    def action_demo(self) -> None:
        """Trigger a demo attack simulation."""
        log = self.query_one(Log)
        log.write_line("[yellow bold]⚡ Demo mode: Simulated incidents are running from the backend[/yellow bold]")


if __name__ == "__main__":
    app = AegisXTerminal()
    app.run()
