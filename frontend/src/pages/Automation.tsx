import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { mockRules } from '../data/mockData';
import { useAegisSystemContext } from '../state/useAegisSystemContext';

export function Automation() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const [rules, setRules] = useState(mockRules);
  const visible = rules.filter((rule) => `${rule.name} ${rule.category} ${rule.trigger}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppLayout title="Automation Terminal" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="automation-page">
        <Card eyebrow="Active Automation Protocols" title="Playbooks">
          <div className="rule-stack">
            {visible.map((rule) => (
              <article key={rule.id} className={`rule-card ${rule.enabled ? 'enabled' : ''}`}>
                <div>
                  <span>{rule.category}</span>
                  <h2>{rule.name}</h2>
                  <p>If <code>{rule.trigger}</code> then <code>{rule.action}</code>.</p>
                  <small>Last run: {rule.lastRun}</small>
                </div>
                <button className={rule.enabled ? 'motion-button motion-toggle-on' : 'motion-button motion-toggle-off'} onClick={() => setRules((current) => current.map((item) => item.id === rule.id ? { ...item, enabled: !item.enabled } : item))}>
                  {rule.enabled ? 'Disable' : 'Enable'}
                </button>
              </article>
            ))}
          </div>
        </Card>
        <Card eyebrow="Manual Override" title="Run Protocol">
          <div className="action-strip vertical">
            <button className="motion-button motion-block" onClick={() => system.executeAction('block_ip', '45.91.82.104')}>Block Known Attacker</button>
            <button className="motion-button motion-restart" onClick={() => system.executeAction('restart_service', 'auth-service')}>Restart Auth Service</button>
            <button className="motion-button motion-isolate" onClick={() => system.executeAction('isolate_node', 'Alpha-7 Central')}>Isolate Alpha-7</button>
          </div>
          <p className="operator-note">{system.actionMessage}</p>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Automation;
