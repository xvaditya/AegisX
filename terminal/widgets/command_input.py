"""Command input widget for the terminal UI."""

from textual.widgets import Input
from textual.message import Message


class CommandExecuted(Message):
    """Emitted when a command is entered."""

    def __init__(self, command: str) -> None:
        super().__init__()
        self.command = command


class CommandInputWidget(Input):
    """Command input with history."""

    DEFAULT_CSS = """
    CommandInputWidget {
        dock: bottom;
        height: 3;
        border: tall $accent;
        background: $surface;
    }
    """

    def __init__(self) -> None:
        super().__init__(
            placeholder="Type command: block <ip> | restart <svc> | scan | kill <pid> | help",
        )
        self.history: list[str] = []
        self._history_idx = -1

    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle command submission."""
        cmd = event.value.strip()
        if cmd:
            self.history.insert(0, cmd)
            self.post_message(CommandExecuted(cmd))
        self.value = ""
        self._history_idx = -1

    def key_up(self) -> None:
        """Navigate command history up."""
        if self.history and self._history_idx < len(self.history) - 1:
            self._history_idx += 1
            self.value = self.history[self._history_idx]

    def key_down(self) -> None:
        """Navigate command history down."""
        if self._history_idx > 0:
            self._history_idx -= 1
            self.value = self.history[self._history_idx]
        elif self._history_idx == 0:
            self._history_idx = -1
            self.value = ""
