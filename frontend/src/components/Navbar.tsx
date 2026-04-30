import type { MascotState } from '../types';

interface NavbarProps {
  title: string;
  status: string;
  mascotState: MascotState;
  query: string;
  onQueryChange: (value: string) => void;
}

export function Navbar({ title, status, mascotState, query, onQueryChange }: NavbarProps) {
  return (
    <header className="aegis-topbar">
      <div>
        <p className="aegis-eyebrow">Autonomous Incident Analyst</p>
        <h1>{title}</h1>
      </div>
      <div className="aegis-topbar__tools">
        <label className="aegis-search">
          <span className="material-symbols-outlined" aria-hidden="true">search</span>
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search telemetry..." />
        </label>
        <div className="aegis-status-pill">
          <span className={`aegis-live-dot ${mascotState}`} />
          <div>
            <span>System</span>
            <strong>{status}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
