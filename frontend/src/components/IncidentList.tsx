import type { Incident, Severity } from '../types';

interface IncidentListProps {
  incidents: Incident[];
  selectedId?: string;
  filter: Severity | 'all';
  onFilterChange: (filter: Severity | 'all') => void;
  onSelect: (incident: Incident) => void;
}

const filters: Array<Severity | 'all'> = ['all', 'critical', 'high', 'medium', 'low'];

export function IncidentList({ incidents, selectedId, filter, onFilterChange, onSelect }: IncidentListProps) {
  const visible = filter === 'all' ? incidents : incidents.filter((incident) => incident.severity === filter);

  return (
    <div className="incident-list">
      <div className="aegis-segmented" role="tablist" aria-label="Incident severity filter">
        {filters.map((item) => (
          <button key={item} className={`motion-tab ${filter === item ? 'is-active' : ''}`} onClick={() => onFilterChange(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="incident-list__stack">
        {visible.map((incident) => (
          <button
            key={incident.id}
            className={`incident-row motion-card ${incident.severity} ${selectedId === incident.id ? 'is-selected' : ''}`}
            onClick={() => onSelect(incident)}
          >
            <span className="incident-row__top">
              <strong>{incident.affected_service}</strong>
              <em>{incident.severity}</em>
            </span>
            <span>{incident.description}</span>
            <small>{incident.id} / {incident.source_ip}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
