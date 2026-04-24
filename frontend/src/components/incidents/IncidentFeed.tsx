/* ── IncidentFeed Component ── */

import { useRef, useEffect } from 'react';
import type { Incident } from '../../types';
import { IncidentCard } from './IncidentCard';
import styles from './incidents.module.css';

interface IncidentFeedProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (incident: Incident) => void;
}

export function IncidentFeed({ incidents, selectedId, onSelect }: IncidentFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top on new incident
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [incidents.length]);

  if (incidents.length === 0) {
    return (
      <div className={styles.emptyFeed}>
        <span style={{ fontSize: 28 }}>🛡️</span>
        <span>No incidents detected</span>
        <span style={{ fontSize: 11 }}>Watching for threats...</span>
      </div>
    );
  }

  return (
    <div className={styles.feed} ref={feedRef}>
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          isSelected={incident.id === selectedId}
          onClick={() => onSelect(incident)}
        />
      ))}
    </div>
  );
}
