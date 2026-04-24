/* ── StatusBadge Component ── */

import type { Severity } from '../../types';
import { SEVERITY_COLORS, SEVERITY_LABELS } from '../../utils/constants';
import styles from './ui.module.css';

interface StatusBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export function StatusBadge({ severity, size = 'sm' }: StatusBadgeProps) {
  const color = SEVERITY_COLORS[severity];

  return (
    <span
      className={styles.badge}
      style={{
        background: `${color}18`,
        color: color,
        border: `1px solid ${color}40`,
        fontSize: size === 'sm' ? '10px' : '12px',
      }}
    >
      <span
        className={styles.pulseIndicator}
        style={{ background: color }}
      />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
