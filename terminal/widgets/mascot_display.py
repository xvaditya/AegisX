"""ASCII Aegis mascot display widget for the terminal UI."""

from textual.widgets import Static
from rich.text import Text

from assets.mascot_frames import MASCOT_FRAMES


class MascotDisplayWidget(Static):
    """Displays the animated ASCII Aegis mascot."""

    DEFAULT_CSS = """
    MascotDisplayWidget {
        height: 100%;
        content-align: center middle;
        padding: 1;
    }
    """

    def __init__(self) -> None:
        super().__init__()
        self._state = "idle"
        self._frame_idx = 0

    @property
    def state(self) -> str:
        return self._state

    def set_state(self, state: str) -> None:
        """Change the mascot state."""
        if state != self._state:
            self._state = state
            self._frame_idx = 0
        self._render()

    def next_frame(self) -> None:
        """Advance to the next animation frame."""
        frames = MASCOT_FRAMES.get(self._state, MASCOT_FRAMES["idle"])
        self._frame_idx = (self._frame_idx + 1) % len(frames)
        self._render()

    def _render(self) -> None:
        """Render current frame."""
        frames = MASCOT_FRAMES.get(self._state, MASCOT_FRAMES["idle"])
        frame = frames[self._frame_idx % len(frames)]
        self.update(Text.from_markup(frame))

    def on_mount(self) -> None:
        """Start the animation timer."""
        self._render()
        self.set_interval(0.8, self.next_frame)
