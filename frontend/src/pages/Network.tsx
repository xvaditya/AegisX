import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { mockNodes } from '../data/mockData';
import { useAegisSystemContext } from '../state/useAegisSystemContext';

export function Network() {
  const system = useAegisSystemContext();
  const [query, setQuery] = useState('');
  const nodes = mockNodes.filter((node) => `${node.name} ${node.region} ${node.status}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppLayout title="Network" status={system.status} mascotState={system.mascotState} query={query} onQueryChange={setQuery}>
      <div className="network-page">
        <Card eyebrow="Threat Map" title="Network Topology">
          <div className="topology-map">
            {nodes.map((node) => (
              <button key={node.id} className={`topology-node motion-node ${node.status}`} onClick={() => system.executeAction('isolate_node', node.name)}>
                <strong>{node.name}</strong>
                <span>{node.latency}ms</span>
              </button>
            ))}
          </div>
        </Card>
        <Card eyebrow="Traffic" title="Ingress / Egress">
          <div className="network-bars">
            {nodes.map((node) => (
              <div key={node.id} className="network-row">
                <span>{node.region}</span>
                <progress value={node.traffic} max="100" />
                <strong>{node.traffic}%</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Network;
