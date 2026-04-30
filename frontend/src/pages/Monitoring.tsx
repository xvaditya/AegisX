import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { mockNodes } from '../data/mockData';
import { useAegisSystemContext } from '../state/useAegisSystemContext';

export function Monitoring() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');

  return (
    <AppLayout title="Monitoring" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="monitoring-grid">
        <Card eyebrow="System Activity" title="Resource Load">
          <div className="metric-stack large">
            {[
              ['CPU Utilization', system.metrics?.cpu_percent ?? 0],
              ['Memory Pressure', system.metrics?.memory_percent ?? 0],
              ['Disk Occupancy', system.metrics?.disk_percent ?? 0],
            ].map(([label, value]) => (
              <div className="metric-row" key={label}>
                <span>{label}</span>
                <progress value={Number(value)} max="100" />
                <strong>{value}%</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card eyebrow="Node Health" title="Protected Fleet">
          <div className="node-grid">
            {mockNodes.map((node) => (
              <button key={node.id} className={`node-card motion-node ${node.status}`} onClick={() => system.executeAction('run_scan', node.name)}>
                <strong>{node.name}</strong>
                <span>{node.region}</span>
                <em>{node.status}</em>
              </button>
            ))}
          </div>
        </Card>
        <Card eyebrow="Operator Control" title="Recovery">
          <div className="command-card">
            <p>{system.actionMessage}</p>
            <button className="motion-button motion-restart" onClick={() => system.executeAction('restart_service', 'edge-monitoring-cluster')}>Restart Monitoring Cluster</button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Monitoring;
