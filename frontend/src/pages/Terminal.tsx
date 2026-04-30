import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { LogViewer } from '../components/LogViewer';
import { useAegisSystemContext } from '../state/useAegisSystemContext';

export function Terminal() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const [commands, setCommands] = useState<string[]>(['cat /var/logs/intrusion_attempts.log', 'scan --perimeter --depth=72']);

  return (
    <AppLayout title="Terminal" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="terminal-page">
        <Card eyebrow="Command Output" title="Operator Terminal">
          <LogViewer logs={system.logs} level="ALL" onLevelChange={() => undefined} />
          <form className="terminal-input" onSubmit={(event) => {
            event.preventDefault();
            if (!query.trim()) return;
            setCommands((current) => [query, ...current]);
            system.executeAction('run_scan', query);
            setQuery('');
          }}>
            <span>&gt;</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ENTER COMMAND OR AI QUERY..." />
            <button className="motion-button motion-send">Send</button>
          </form>
        </Card>
        <Card eyebrow="Session" title="Recent Commands">
          <div className="command-history">
            {commands.map((command) => <code key={command}>{command}</code>)}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Terminal;
