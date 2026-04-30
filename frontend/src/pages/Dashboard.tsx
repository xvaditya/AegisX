import { useMemo, useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { IncidentList } from '../components/IncidentList';
import { LogViewer } from '../components/LogViewer';
import { useAegisSystemContext } from '../state/useAegisSystemContext';
import type { LogLevel, Severity } from '../types';

export function Dashboard() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const [logLevel, setLogLevel] = useState<LogLevel | 'ALL'>('ALL');

  const incidents = useMemo(
    () => system.incidents.filter((incident) => `${incident.id} ${incident.description} ${incident.affected_service}`.toLowerCase().includes(query.toLowerCase())),
    [system.incidents, query],
  );

  return (
    <AppLayout title="Command Dashboard" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="dashboard-grid">
        <Card eyebrow="Live Sync" title="Incident Feed">
          <IncidentList incidents={incidents} selectedId={system.selectedIncident?.id} filter={filter} onFilterChange={setFilter} onSelect={system.selectIncident} />
        </Card>
        <Card eyebrow="Analysis Core" title={system.selectedIncident?.affected_service ?? 'Select an incident'}>
          {system.loading && <div className="aegis-skeleton">Loading incident intelligence...</div>}
          {system.error && <div className="aegis-error">{system.error}</div>}
          {system.selectedIncident && (
            <div className="analysis-panel">
              <h3>{system.selectedIncident.description}</h3>
              <p>{system.analysis?.why_it_happened ?? 'Aegis is correlating logs and metrics for this incident.'}</p>
              <div className="action-strip">
                <button className="motion-button motion-block" onClick={() => system.executeAction('block_ip', system.selectedIncident!.source_ip, system.selectedIncident!.id)}>Block IP</button>
                <button className="motion-button motion-restart" onClick={() => system.executeAction('restart_service', system.selectedIncident!.affected_service, system.selectedIncident!.id)}>Restart Service</button>
                <button className="motion-button motion-isolate" onClick={() => system.executeAction('isolate_node', system.selectedIncident!.affected_service, system.selectedIncident!.id)}>Isolate Node</button>
              </div>
              <small>{system.actionMessage}</small>
            </div>
          )}
        </Card>
        <Card eyebrow="Telemetry" title="System Metrics">
          <div className="metric-stack">
            {[
              ['CPU', system.metrics?.cpu_percent ?? 0],
              ['Memory', system.metrics?.memory_percent ?? 0],
              ['Disk', system.metrics?.disk_percent ?? 0],
            ].map(([label, value]) => (
              <div className="metric-row" key={label}>
                <span>{label}</span>
                <progress value={Number(value)} max="100" />
                <strong>{value}%</strong>
              </div>
            ))}
            <div className="metric-total">{system.metrics?.network_connections.toLocaleString() ?? '--'} live connections</div>
          </div>
        </Card>
        <Card eyebrow="Terminal Stream" title="Logs">
          <LogViewer logs={system.logs} level={logLevel} onLevelChange={setLogLevel} />
        </Card>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
