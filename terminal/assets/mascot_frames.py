"""ASCII art frames for the Aegis mascot in various states.

Each state has multiple frames for animation cycling.
The mascot is a cute rock-like creature with a sprout on top.
"""

IDLE_FRAMES = [
    r"""
  [green]  ,~.[/green]
  [green] /  |[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [white]◕  ◕[/white] [grey62]│[/grey62]
 [grey62]│[/grey62]  [white]‿[/white]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
    r"""
  [green]  ,~.[/green]
  [green] /  |[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [white]◕  ◕[/white] [grey62]│[/grey62]
 [grey62]│[/grey62]  [white]‿[/white]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
    r"""
  [green]  ,~.[/green]
  [green] /  |[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [white]─  ─[/white] [grey62]│[/grey62]
 [grey62]│[/grey62]  [white]‿[/white]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
]

SCANNING_FRAMES = [
    r"""
  [blue]  ,~.[/blue]
  [blue] /  |[/blue]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [dodger_blue1]◉  ◕[/dodger_blue1] [grey62]│[/grey62]
 [grey62]│[/grey62]  [white]─[/white]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
   [blue]▓▓▓[/blue]
""",
    r"""
  [blue]  ,~.[/blue]
  [blue] /  |[/blue]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [dodger_blue1]◕  ◉[/dodger_blue1] [grey62]│[/grey62]
 [grey62]│[/grey62]  [white]─[/white]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
   [blue]░▓░[/blue]
""",
    r"""
  [blue]  .~,[/blue]
  [blue] |  \[/blue]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [dodger_blue1]◉  ◕[/dodger_blue1] [grey62]│[/grey62]
 [grey62]│[/grey62]  [white]─[/white]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
   [blue]▓░▓[/blue]
""",
]

THINKING_FRAMES = [
    r"""
  [yellow]  ,~.  [/yellow][yellow]?[/yellow]
  [yellow] /  |[/yellow]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [yellow]◑  ◑[/yellow] [grey62]│[/grey62]
 [grey62]│[/grey62]  [yellow]~[/yellow]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
    r"""
  [yellow]  ,~. [/yellow][yellow]??[/yellow]
  [yellow] /  |[/yellow]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [yellow]◑  ◑[/yellow] [grey62]│[/grey62]
 [grey62]│[/grey62]  [yellow]=[/yellow]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
    r"""
  [yellow]  .~,[/yellow] [yellow]💡[/yellow]
  [yellow] |  \[/yellow]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [yellow]◑  ◑[/yellow] [grey62]│[/grey62]
 [grey62]│[/grey62]  [yellow]o[/yellow]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
]

ALERT_FRAMES = [
    r"""
  [red bold]  ⚠️ !![/red bold]
  [orange1]  ,~.[/orange1]
  [orange1] /  |[/orange1]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [red]●  ●[/red] [grey62]│[/grey62]
 [grey62]│[/grey62]  [red]○[/red]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
    r"""
  [red bold]  ⚡ !![/red bold]
  [orange1]  .~,[/orange1]
  [orange1] |  \[/orange1]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [red]◉  ◉[/red] [grey62]│[/grey62]
 [grey62]│[/grey62]  [red]o[/red]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
""",
]

CRITICAL_FRAMES = [
    r"""
 [red bold] 🚨 CRITICAL 🚨[/red bold]
  [red]  ,~.[/red]
  [red] /  |[/red]
 [red]╭──────╮[/red]
 [red]│[/red] [white bold]◎  ◎[/white bold] [red]│[/red]
 [red]│[/red]  [white bold]▢[/white bold]  [red]│[/red]
 [red]╰──────╯[/red]
  [red]▓▓▓▓▓▓[/red]
""",
    r"""
 [red bold] 🔴 CRITICAL 🔴[/red bold]
  [red]  .~,[/red]
  [red] |  \[/red]
 [red]╭──────╮[/red]
 [red]│[/red] [white bold]◉  ◉[/white bold] [red]│[/red]
 [red]│[/red]  [white bold]□[/white bold]  [red]│[/red]
 [red]╰──────╯[/red]
  [red]░░░░░░[/red]
""",
]

HEALING_FRAMES = [
    r"""
  [green]  ,~.  ✨[/green]
  [green] /  |[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [green]◕  ◕[/green] [grey62]│[/grey62]
 [grey62]│[/grey62]  [green]‿[/green]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
  [green] 🔧[/green]
""",
    r"""
  [green]  .~, ✨[/green]
  [green] |  \[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [green]◕  ◕[/green] [grey62]│[/grey62]
 [grey62]│[/grey62]  [green]‿[/green]  [grey62]│[/grey62]
 [grey62]╰──────╯[/grey62]
  [green]  🔧[/green]
""",
]

SUCCESS_FRAMES = [
    r"""
   [green bold]  ⭐[/green bold]
  [green]  ,~.[/green]
  [green] /  |[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [green]◕  ◕[/green] [grey62]│[/grey62]
 [grey62]│[/grey62]  [green]▽[/green]  [grey62]│[/grey62]
 [grey62]╰──╮╭──╯[/grey62]
    [grey62]╰╯[/grey62] [green]🎉[/green]
""",
    r"""
  [green bold] ✨  ⭐[/green bold]
  [green]  .~,[/green]
  [green] |  \[/green]
 [grey62]╭──────╮[/grey62]
 [grey62]│[/grey62] [green]^  ^[/green] [grey62]│[/grey62]
 [grey62]│[/grey62]  [green]▽[/green]  [grey62]│[/grey62]
 [grey62]╰─╮──╭─╯[/grey62]
  [grey62]╰──╯[/grey62] [green]💚[/green]
""",
]

SLEEPING_FRAMES = [
    r"""
  [grey50]  ,~.[/grey50]
  [grey50] /  |[/grey50]    [grey50]z[/grey50]
 [grey42]╭──────╮[/grey42]
 [grey42]│[/grey42] [grey50]─  ─[/grey50] [grey42]│[/grey42]  [grey50]z[/grey50]
 [grey42]│[/grey42]  [grey50]‿[/grey50]  [grey42]│[/grey42]
 [grey42]╰──────╯[/grey42] [grey50]z[/grey50]
""",
    r"""
  [grey50]  ,~.[/grey50]
  [grey50] /  |[/grey50]     [grey50]z[/grey50]
 [grey42]╭──────╮[/grey42]
 [grey42]│[/grey42] [grey50]─  ─[/grey50] [grey42]│[/grey42]   [grey50]z[/grey50]
 [grey42]│[/grey42]  [grey50]‿[/grey50]  [grey42]│[/grey42]
 [grey42]╰──────╯[/grey42]  [grey50]z[/grey50]
""",
]

MONITORING_FRAMES = IDLE_FRAMES  # reuse idle for monitoring

# Master frame map
MASCOT_FRAMES: dict[str, list[str]] = {
    "idle": IDLE_FRAMES,
    "monitoring": MONITORING_FRAMES,
    "scanning": SCANNING_FRAMES,
    "thinking": THINKING_FRAMES,
    "alert": ALERT_FRAMES,
    "critical": CRITICAL_FRAMES,
    "healing": HEALING_FRAMES,
    "success": SUCCESS_FRAMES,
    "sleeping": SLEEPING_FRAMES,
}
