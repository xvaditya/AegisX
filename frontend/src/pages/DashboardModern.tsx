/* ── Modern Bento Dashboard ── */

import { useEffect, useCallback, useRef } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { useMetrics } from '../hooks/useMetrics';
import { IncidentFeed } from '../components/incidents/IncidentFeed';
import { AnalysisPanel } from '../components/analysis/AnalysisPanel';
import { ActionBar } from '../components/actions/ActionBar';
import { MetricsPanel } from '../components/metrics/MetricsPanel';
import { ChatPanel } from '../components/chat/ChatPanel';
import { AegisMascot } from '../components/mascot/AegisMascot';
import { PulseIndicator } from '../components/ui/PulseIndicator';
import { incidentToMascotEvent, metricsToMascotEvent, useAegisEmotion } from '../state/aegisEmotion';

export function DashboardModern() {
  const { incidents, selectedIncident, analysis, analysisLoading, selectIncident, isConnected } = useIncidents();
  const { metrics, loading: metricsLoading } = useMetrics();
  const mascot = useAegisEmotion('idle');
  const { state: mascotState, dispatch: dispatchMascotEvent } = mascot;
  const seenIncidentId = useRef<string | null>(null);

  useEffect(() => {
    const latest = incidents[0];
    if (!latest || latest.id === seenIncidentId.current) return;
    seenIncidentId.current = latest.id;
    dispatchMascotEvent(incidentToMascotEvent(latest), true);
  }, [incidents, dispatchMascotEvent]);

  useEffect(() => {
    if (analysisLoading) dispatchMascotEvent('analysis_started', true);
  }, [analysisLoading, dispatchMascotEvent]);

  useEffect(() => {
    if (!metricsLoading) dispatchMascotEvent(metricsToMascotEvent(metrics));
  }, [metrics, metricsLoading, dispatchMascotEvent]);

  const handleActionStart = useCallback(() => {
    dispatchMascotEvent('action_running', true);
  }, [dispatchMascotEvent]);

  const handleActionComplete = useCallback((success: boolean) => {
    dispatchMascotEvent(success ? 'action_success' : 'action_failed', true);
  }, [dispatchMascotEvent]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#030712',
      color: '#f0f4ec',
      fontFamily: "'SF Display', 'Manrope', sans-serif",
      overflow: 'hidden',
    }}>
      {/* ════════════════════ HEADER ════════════════════ */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        backgroundColor: 'rgba(10, 13, 10, 0.92)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
        backdropFilter: 'blur(20px)',
        height: '80px',
      }}>
        {/* Brand Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em',
              fontFamily: "'Helvetica', sans-serif",
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 0 12px rgba(0,255,65,0.25)',
            }}>
              AEGISX
            </h1>
            <p style={{
              fontSize: '0.7rem',
              color: '#95a599',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0.25rem 0 0 0',
              fontWeight: 600,
            }}>
              Autonomous Incident Analyst
            </p>
          </div>

          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '2rem',
            borderLeft: '1px solid rgba(56, 189, 248, 0.1)',
          }}>
            <input
              type="text"
              placeholder="Search incidents..."
              style={{
                backgroundColor: 'rgba(18, 22, 18, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: '#f0f4ec',
                fontSize: '0.875rem',
                fontFamily: "'SF Display', sans-serif",
                width: '300px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <PulseIndicator color={isConnected ? '#38bdf8' : '#ef5f52'} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingLeft: '1.5rem',
            borderLeft: '1px solid rgba(56, 189, 248, 0.1)',
          }}>
            <span style={{
              fontSize: '0.7rem',
              color: '#95a599',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              STATUS
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: isConnected ? '#38bdf8' : '#ef5f52',
              textShadow: isConnected ? '0 0 12px rgba(0,255,65,0.4)' : 'none',
              fontFamily: "'Helvetica', sans-serif",
              textTransform: 'uppercase',
            }}>
              {isConnected ? '● ONLINE' : '● OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      {/* ════════════════════ MAIN CONTENT ════════════════════ */}
      <main style={{
        marginTop: '80px',
        marginBottom: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        display: 'grid',
        gridTemplateColumns: '350px 1fr 380px',
        gridTemplateRows: 'auto 1fr',
        gap: '16px',
        height: 'calc(100vh - 120px)',
        maxHeight: 'calc(100vh - 120px)',
      }}>
        {/* ──── LEFT: INCIDENT FEED (BENTO) ──── */}
        <section style={{
          gridColumn: '1',
          gridRow: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(18, 22, 18, 0.75) 0%, rgba(26, 33, 26, 0.55) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.12)',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(56, 189, 248, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(18, 22, 18, 0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 12px rgba(0,255,65,0.6)',
                animation: 'pulse-green 2s ease-in-out infinite',
              }} />
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: "'Helvetica', sans-serif",
                color: '#38bdf8',
                margin: 0,
              }}>
                INCIDENT FEED
              </h2>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#95a599',
            }}>
              LIVE_SYNC
            </span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem' }}>
            <IncidentFeed
              incidents={incidents}
              selectedId={selectedIncident?.id ?? null}
              onSelect={selectIncident}
            />
          </div>
        </section>

        {/* ──── CENTER: ANALYSIS PANEL (LARGE BENTO) ──── */}
        <section style={{
          gridColumn: '2',
          gridRow: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(18, 22, 18, 0.75) 0%, rgba(26, 33, 26, 0.55) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.12)',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(56, 189, 248, 0.06)',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(18, 22, 18, 0.5)',
          }}>
            <h2 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Helvetica', sans-serif",
              color: '#38bdf8',
              margin: 0,
            }}>
              ANALYSIS CORE
            </h2>
            {analysisLoading && (
              <div style={{
                fontSize: '0.75rem',
                color: '#bfdbfe',
                animation: 'pulse-green 1.5s ease-in-out infinite',
                fontWeight: 700,
              }}>
                ⚡ ANALYZING...
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {selectedIncident ? (
              <>
                <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
                  <AnalysisPanel analysis={analysis} loading={analysisLoading} />
                </div>
                <div style={{
                  borderTop: '1px solid rgba(56, 189, 248, 0.08)',
                  padding: '1.25rem',
                  backgroundColor: 'rgba(18, 22, 18, 0.5)',
                }}>
                  <ActionBar
                    incident={selectedIncident}
                    onActionStart={handleActionStart}
                    onActionComplete={handleActionComplete}
                  />
                </div>
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                textAlign: 'center',
              }}>
                <div>
                  <div style={{
                    fontSize: '3.5rem',
                    marginBottom: '1rem',
                    opacity: 0.4,
                  }}>
                    🔍
                  </div>
                  <p style={{
                    color: '#95a599',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    margin: 0,
                    fontFamily: "'SF Display', sans-serif",
                  }}>
                    Select an incident to begin analysis
                  </p>
                  <p style={{
                    color: '#7a8678',
                    fontSize: '0.85rem',
                    margin: '0.75rem 0 0 0',
                  }}>
                    AI-powered root cause detection will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ──── RIGHT: MASCOT + METRICS (STACKED BENTO) ──── */}
        <div style={{
          gridColumn: '3',
          gridRow: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflow: 'hidden',
        }}>
          {/* Aegis Mascot Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(18, 22, 18, 0.75) 0%, rgba(26, 33, 26, 0.55) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.12)',
            borderRadius: '16px',
            padding: '2rem 1.5rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '280px',
            boxShadow: '0 8px 32px rgba(56, 189, 248, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, transparent 0%, rgba(56, 189, 248, 0.02) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Mascot */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <AegisMascot state={mascotState} />
            </div>

            {/* Status */}
            <div style={{
              marginTop: '1.25rem',
              textAlign: 'center',
              zIndex: 2,
            }}>
              <p style={{
                fontSize: '0.7rem',
                color: '#95a599',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                margin: 0,
                letterSpacing: '0.05em',
              }}>
                AEGIS STATE
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: '#bfdbfe',
                fontWeight: 700,
                fontFamily: "'Helvetica', sans-serif",
                textTransform: 'uppercase',
                margin: '0.5rem 0 0 0',
                letterSpacing: '0.05em',
              }}>
                {mascotState.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Metrics Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(18, 22, 18, 0.75) 0%, rgba(26, 33, 26, 0.55) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.12)',
            borderRadius: '16px',
            padding: '1.25rem',
            backdropFilter: 'blur(16px)',
            flex: 1,
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(56, 189, 248, 0.06)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, transparent 0%, rgba(56, 189, 248, 0.02) 100%)',
              pointerEvents: 'none',
              borderRadius: '16px',
            }} />

            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Helvetica', sans-serif",
              color: '#38bdf8',
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 2,
              margin: '0 0 1rem 0',
            }}>
              System Metrics
            </h3>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <MetricsPanel metrics={metrics} loading={metricsLoading} />
            </div>
          </div>
        </div>
      </main>

      {/* ════════════════════ FLOATING CHAT ════════════════════ */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '340px',
        maxHeight: '420px',
        background: 'linear-gradient(135deg, rgba(18, 22, 18, 0.95) 0%, rgba(26, 33, 26, 0.85) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 48px rgba(56, 189, 248, 0.12)',
        zIndex: 40,
        overflow: 'hidden',
      }}>
        <ChatPanel />
      </div>

      {/* ════════════════════ STYLES ════════════════════ */}
      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(0,255,65,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 20px rgba(0,255,65,0.8); }
        }

        @keyframes glow-fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default DashboardModern;
