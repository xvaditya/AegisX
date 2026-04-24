"""AI Analysis panel widget for the terminal UI."""

from textual.widgets import Static
from rich.text import Text
from rich.panel import Panel


class AnalysisPanelWidget(Static):
    """Displays AI analysis of the selected incident."""

    DEFAULT_CSS = """
    AnalysisPanelWidget {
        height: 100%;
        padding: 1;
    }
    """

    def __init__(self) -> None:
        super().__init__()
        self._analysis: dict | None = None

    def show_analysis(self, analysis: dict) -> None:
        """Update the panel with new analysis data."""
        self._analysis = analysis
        self._render()

    def show_loading(self) -> None:
        """Show loading state."""
        text = Text()
        text.append("\n  ⏳ ", style="yellow")
        text.append("Aegis is analyzing...\n", style="yellow italic")
        self.update(text)

    def show_empty(self) -> None:
        """Show empty state."""
        text = Text()
        text.append("\n  🔍 ", style="dim")
        text.append("Select an incident to analyze\n", style="dim")
        text.append("  AI-powered root cause analysis\n", style="dim italic")
        self.update(text)

    def _render(self) -> None:
        if not self._analysis:
            self.show_empty()
            return

        a = self._analysis
        text = Text()

        # Confidence
        conf = int(float(a.get("confidence", 0)) * 100)
        text.append(f"  🧠 AI Analysis ", style="bold white")
        text.append(f"({conf}% confidence)\n\n", style="dim")

        # What happened
        text.append("  WHAT HAPPENED\n", style="bold cyan")
        text.append(f"  {a.get('what_happened', 'N/A')}\n\n", style="white")

        # Why
        text.append("  ROOT CAUSE\n", style="bold yellow")
        text.append(f"  {a.get('why_it_happened', 'N/A')}\n\n", style="white")

        # Severity
        text.append("  SEVERITY\n", style="bold red")
        text.append(f"  {a.get('severity_assessment', 'N/A')}\n\n", style="white")

        # Team
        text.append("  TEAM: ", style="bold blue")
        text.append(f"{a.get('responsible_team', 'N/A')}\n\n", style="blue")

        # Action
        text.append("  💡 SUGGESTED ACTION\n", style="bold green")
        text.append(f"  {a.get('suggested_action', 'N/A')}\n", style="green")

        self.update(text)
