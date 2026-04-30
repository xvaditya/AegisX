import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { useAegisSystemContext } from '../state/useAegisSystemContext';

export function Settings() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const [strictMode, setStrictMode] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [scanDepth, setScanDepth] = useState(72);

  return (
    <AppLayout title="System Config" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="settings-page">
        <Card eyebrow="API Integration" title="External Monitoring">
          <div className="settings-list">
            <label><span>SIEM endpoint</span><input value="https://aegisx.local/api/events" readOnly /></label>
            <label><span>API key</span><input value="AX-••••-••••-4421" readOnly /></label>
            <button className="motion-button motion-scan" onClick={() => system.executeAction('run_scan', 'integration-health')}>Test Integration</button>
          </div>
        </Card>
        <Card eyebrow="Core Performance" title="Scanning">
          <div className="settings-list">
            <label className="toggle-row"><span>Strict containment mode</span><input type="checkbox" checked={strictMode} onChange={(event) => setStrictMode(event.target.checked)} /></label>
            <label><span>Scan depth</span><input type="range" min="10" max="100" value={scanDepth} onChange={(event) => setScanDepth(Number(event.target.value))} /></label>
            <strong>{scanDepth}% inspection depth</strong>
          </div>
        </Card>
        <Card eyebrow="Notifications" title="Alert Protocols">
          <div className="settings-list">
            <label className="toggle-row"><span>Push Level 4+ threats</span><input type="checkbox" checked={pushAlerts} onChange={(event) => setPushAlerts(event.target.checked)} /></label>
            <label className="toggle-row"><span>Daily PDF health summary</span><input type="checkbox" defaultChecked /></label>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Settings;
