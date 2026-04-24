/* ── MetricGauge Component ── */

import styles from './metrics.module.css';

interface MetricGaugeProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  detail?: string;
}

function getGaugeColor(percent: number): string {
  if (percent < 50) return '#4ade80';
  if (percent < 75) return '#facc15';
  if (percent < 90) return '#f97316';
  return '#ef4444';
}

export function MetricGauge({ label, value, max = 100, unit = '%', detail }: MetricGaugeProps) {
  const percent = Math.min((value / max) * 100, 100);
  const color = getGaugeColor(percent);

  return (
    <div className={styles.gauge}>
      <div className={styles.gaugeHeader}>
        <span className={styles.gaugeLabel}>{label}</span>
        <span className={styles.gaugeValue} style={{ color }}>
          {value.toFixed(1)}{unit}
          {detail && <span style={{ fontSize: 10, color: '#6b7280', marginLeft: 6 }}>{detail}</span>}
        </span>
      </div>
      <div className={styles.gaugeBar}>
        <div
          className={styles.gaugeFill}
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
}
