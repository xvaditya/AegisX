/* ── IncidentCard Component ── */

import type { Incident } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { INCIDENT_TYPE_LABELS, INCIDENT_TYPE_ICONS, SEVERITY_COLORS } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';
import { GlowCard } from '../ui/GlowCard';
import styles from './incidents.module.css';

interface IncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}

export function IncidentCard({ incident, isSelected, onClick }: IncidentCardProps) {
  const color = SEVERITY_COLORS[incident.severity];

  return (
    <GlowCard
      onClick={onClick}
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      style={{ borderLeftColor: isSelected ? color : 'transparent', color }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardType}>
          <span>{INCIDENT_TYPE_ICONS[incident.type]}</span>
          {INCIDENT_TYPE_LABELS[incident.type]}
        </span>
        <StatusBadge severity={incident.severity} />
      </div>

      <p className={styles.cardDesc}>{incident.description}</p>

      <div className={styles.cardMeta}>
        <span>🌐 {incident.source_ip}</span>
        <span>⚙️ {incident.affected_service}</span>
        <span className={styles.cardTime}>{timeAgo(incident.timestamp)}</span>
      </div>
    </GlowCard>
  );
}
