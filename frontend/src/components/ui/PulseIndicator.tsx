/* ── PulseIndicator Component ── */

import styles from './ui.module.css';

interface PulseIndicatorProps {
  color?: string;
  size?: number;
}

export function PulseIndicator({ color = '#60a5fa', size = 8 }: PulseIndicatorProps) {
  return (
    <span
      className={styles.pulseIndicator}
      style={{
        background: color,
        width: size,
        height: size,
      }}
    />
  );
}
