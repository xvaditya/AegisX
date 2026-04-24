"""Incident feed widget for the terminal UI."""

from textual.widgets import Static, ListView, ListItem, Label
from textual.message import Message
from rich.text import Text


SEVERITY_COLORS = {
    "low": "green",
    "medium": "yellow",
    "high": "dark_orange",
    "critical": "red bold",
}

TYPE_ICONS = {
    "brute_force": "🔐",
    "api_500": "🔥",
    "cpu_overload": "⚡",
    "suspicious_traffic": "🕵️",
    "service_crash": "💀",
}

TYPE_LABELS = {
    "brute_force": "Brute Force",
    "api_500": "API 500",
    "cpu_overload": "CPU Overload",
    "suspicious_traffic": "Suspicious Traffic",
    "service_crash": "Service Crash",
}


class IncidentSelected(Message):
    """Emitted when an incident is selected."""

    def __init__(self, incident: dict) -> None:
        super().__init__()
        self.incident = incident


class IncidentItem(ListItem):
    """A single incident in the list."""

    def __init__(self, incident: dict) -> None:
        super().__init__()
        self.incident = incident

    def compose(self):
        severity = self.incident.get("severity", "low")
        inc_type = self.incident.get("type", "")
        color = SEVERITY_COLORS.get(severity, "white")
        icon = TYPE_ICONS.get(inc_type, "❓")
        label = TYPE_LABELS.get(inc_type, inc_type)
        service = self.incident.get("affected_service", "")
        sev_label = severity.upper()

        text = Text()
        text.append(f" {icon} ", style="bold")
        text.append(f"{label}", style="bold")
        text.append(f"  [{sev_label}]", style=color)
        text.append(f"\n   {service}", style="dim")

        yield Static(text)


class IncidentFeedWidget(Static):
    """Live incident feed panel."""

    DEFAULT_CSS = """
    IncidentFeedWidget {
        height: 100%;
    }
    IncidentFeedWidget ListView {
        height: 100%;
        background: transparent;
    }
    IncidentFeedWidget ListItem {
        padding: 0 1;
        height: auto;
        background: transparent;
    }
    IncidentFeedWidget ListItem:hover {
        background: $surface-lighten-1;
    }
    """

    def __init__(self) -> None:
        super().__init__()
        self.incidents: list[dict] = []
        self._list_view: ListView | None = None

    def compose(self):
        self._list_view = ListView()
        yield self._list_view

    def add_incident(self, incident: dict) -> None:
        """Add a new incident to the top of the feed."""
        self.incidents.insert(0, incident)
        if len(self.incidents) > 50:
            self.incidents = self.incidents[:50]

        if self._list_view is not None:
            item = IncidentItem(incident)
            self._list_view.insert(0, item)

    def on_list_view_selected(self, event: ListView.Selected) -> None:
        """Handle incident selection."""
        item = event.item
        if isinstance(item, IncidentItem):
            self.post_message(IncidentSelected(item.incident))
