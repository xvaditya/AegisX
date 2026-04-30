import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { IncidentList } from '../components/IncidentList';
import { useAegisSystemContext } from '../state/useAegisSystemContext';
import type { Severity } from '../types';

export function Incidents() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const selected = system.selectedIncident;
  const incidents = system.incidents.filter((incident) => `${incident.id} ${incident.description} ${incident.source_ip}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppLayout title="Incident Command" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="two-column incident-command">
        <Card eyebrow="Live Feed" title="Threat Queue">
          <IncidentList incidents={incidents} selectedId={selected?.id} filter={filter} onFilterChange={setFilter} onSelect={system.selectIncident} />
        </Card>
        <Card eyebrow="AI Threat Summary" title={selected?.affected_service ?? 'No incident selected'}>
          {selected ? (
            <div className="incident-detail">
              <div className={`threat-banner ${selected.severity}`}>{selected.severity} threat detected</div>
              <h2>{selected.description}</h2>
              <p>{system.analysis?.what_happened ?? 'Building incident summary...'}</p>
              <dl>
                <div><dt>Node</dt><dd>{selected.affected_service}</dd></div>
                <div><dt>Source</dt><dd>{selected.source_ip}</dd></div>
                <div><dt>Confidence</dt><dd>{Math.round((system.analysis?.confidence ?? 0.88) * 100)}%</dd></div>
              </dl>
              <div className="action-strip">
                <button className="motion-button motion-block" onClick={() => system.executeAction('block_ip', selected.source_ip, selected.id)}>Block IP</button>
                <button className="motion-button motion-isolate" onClick={() => system.executeAction('isolate_node', selected.affected_service, selected.id)}>Isolate Node</button>
                <button className="motion-button motion-logs" onClick={() => system.executeAction('view_logs', selected.affected_service, selected.id)}>View Full Logs</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select an incident to open the containment workspace.</div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

export default Incidents;
