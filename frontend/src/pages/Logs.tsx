import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { LogViewer } from '../components/LogViewer';
import { useAegisSystemContext } from '../state/useAegisSystemContext';
import type { LogLevel } from '../types';

export function Logs() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<LogLevel | 'ALL'>('ALL');
  const logs = system.logs.filter((log) => `${log.level} ${log.service} ${log.message}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppLayout title="Logs" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="logs-page">
        <Card eyebrow="System Filters" title="Terminal Log Stream">
          <LogViewer logs={logs} level={level} onLevelChange={setLevel} />
        </Card>
        <Card eyebrow="Command Bar" title="Query Console">
          <form className="terminal-input" onSubmit={(event) => { event.preventDefault(); system.executeAction('run_scan', query || 'all logs'); }}>
            <span>$</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="grep auth-service --level security" />
            <button className="motion-button motion-run">Run</button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Logs;
