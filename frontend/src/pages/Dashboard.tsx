/* ── Dashboard Page ── */

import { useState, useEffect, useCallback } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { useMetrics } from '../hooks/useMetrics';
import { IncidentFeed } from '../components/incidents/IncidentFeed';
import { AnalysisPanel } from '../components/analysis/AnalysisPanel';
import { ActionBar } from '../components/actions/ActionBar';
import { MetricsPanel } from '../components/metrics/MetricsPanel';
import { ChatPanel } from '../components/chat/ChatPanel';
import { AegisMascot } from '../components/mascot/AegisMascot';
import { PulseIndicator } from '../components/ui/PulseIndicator';
import { severityToMascotState } from '../components/mascot/MascotStates';
import type { MascotState } from '../types';

export function Dashboard() {
  const { incidents, selectedIncident, analysis, analysisLoading, selectIncident, isConnected } = useIncidents();
  const { metrics, loading: metricsLoading } = useMetrics();
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  // Update mascot state based on latest incident
  useEffect(() => {
    if (incidents.length > 0) {
      const latest = incidents[0];
      setMascotState(severityToMascotState(latest.severity));

      // Reset to idle after 10 seconds if no new incidents
      const timer = setTimeout(() => setMascotState('monitoring'), 10000);
      return () => clearTimeout(timer);
    }
  }, [incidents]);

  // Set mascot to thinking when analysis is loading
  useEffect(() => {
    if (analysisLoading) setMascotState('thinking');
  }, [analysisLoading]);

  const handleActionComplete = useCallback((success: boolean) => {
    setMascotState(success ? 'success' : 'alert');
    setTimeout(() => setMascotState('idle'), 4000);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr 0.8fr',
      gridTemplateRows: 'auto 1fr auto',
      gap: '12px',
      padding: '16px',
      height: '100vh',
      maxHeight: '100vh',
    }}>
      {/* Header */}
      <header style={{
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'rgba(18, 20, 26, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(75, 85, 99, 0.2)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4ade80, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>
              AegisX
            </h1>
            <span style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Autonomous Incident Analyst
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
            <PulseIndicator color={isConnected ? '#4ade80' : '#ef4444'} />
            {isConnected ? 'Live' : 'Disconnected'}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {incidents.length} incidents
          </div>
          <AegisMascot state={mascotState} size={48} showLabel={false} />
        </div>
      </header>

      {/* Incident Feed */}
      <section style={{
        background: 'rgba(18, 20, 26, 0.7)',
        borderRadius: '16px',
        border: '1px solid rgba(75, 85, 99, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(75, 85, 99, 0.15)',
          fontSize: '13px',
          fontWeight: 700,
          color: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          📡 Incident Feed
          <PulseIndicator color="#4ade80" size={6} />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <IncidentFeed
            incidents={incidents}
            selectedId={selectedIncident?.id ?? null}
            onSelect={selectIncident}
          />
        </div>
      </section>

      {/* Analysis + Actions */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden',
      }}>
        {/* AI Analysis */}
        <div style={{
          flex: 1,
          background: 'rgba(18, 20, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          overflow: 'auto',
        }}>
          <AnalysisPanel analysis={analysis} loading={analysisLoading} />
        </div>

        {/* Actions */}
        <div style={{
          background: 'rgba(18, 20, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(75, 85, 99, 0.2)',
        }}>
          <div style={{
            padding: '10px 18px 0',
            fontSize: '13px',
            fontWeight: 700,
            color: '#e5e7eb',
          }}>
            ⚡ Quick Actions
          </div>
          <ActionBar incident={selectedIncident} onActionComplete={handleActionComplete} />
        </div>
      </section>

      {/* Right Column: Mascot + Metrics + Chat */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden',
      }}>
        {/* Mascot */}
        <div style={{
          background: 'rgba(18, 20, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <AegisMascot state={mascotState} size={100} />
        </div>

        {/* Metrics */}
        <div style={{
          background: 'rgba(18, 20, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(75, 85, 99, 0.2)',
        }}>
          <div style={{
            padding: '12px 18px 0',
            fontSize: '13px',
            fontWeight: 700,
            color: '#e5e7eb',
          }}>
            📊 System Metrics
          </div>
          <MetricsPanel metrics={metrics} loading={metricsLoading} />
        </div>

        {/* Chat */}
        <div style={{
          flex: 1,
          minHeight: 0,
          background: 'rgba(18, 20, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 18px',
            borderBottom: '1px solid rgba(75, 85, 99, 0.15)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#e5e7eb',
          }}>
            💬 Command Center
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatPanel />
          </div>
        </div>
      </section>
    </div>
  );
}
