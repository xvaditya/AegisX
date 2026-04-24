/* ── MetricsPanel Component ── */

import type { SystemMetrics } from '../../types';
import { MetricGauge } from './MetricGauge';
import { formatBytes } from '../../utils/formatters';
import styles from './metrics.module.css';

interface MetricsPanelProps {
  metrics: SystemMetrics | null;
  loading: boolean;
}

export function MetricsPanel({ metrics, loading }: MetricsPanelProps) {
  if (loading || !metrics) {
    return <div className={styles.loading}>Loading metrics...</div>;
  }

  return (
    <div className={styles.panel}>
      <MetricGauge
        label="CPU"
        value={metrics.cpu_percent}
        detail={`${metrics.cpu_count} cores`}
      />
      <MetricGauge
        label="Memory"
        value={metrics.memory_percent}
        detail={`${metrics.memory_used_gb}/${metrics.memory_total_gb} GB`}
      />
      <MetricGauge
        label="Disk"
        value={metrics.disk_percent}
        detail={`${metrics.disk_used_gb}/${metrics.disk_total_gb} GB`}
      />

      <div className={styles.networkStats}>
        <div className={styles.netStat}>
          <div className={styles.netLabel}>↑ Sent</div>
          <div className={styles.netValue}>{formatBytes(metrics.network_bytes_sent)}</div>
        </div>
        <div className={styles.netStat}>
          <div className={styles.netLabel}>↓ Recv</div>
          <div className={styles.netValue}>{formatBytes(metrics.network_bytes_recv)}</div>
        </div>
        <div className={styles.netStat}>
          <div className={styles.netLabel}>Connections</div>
          <div className={styles.netValue}>{metrics.network_connections}</div>
        </div>
      </div>
    </div>
  );
}
