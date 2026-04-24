/* ── Floating Assistant Page ── */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIncidents } from '../hooks/useIncidents';
import { AegisMascot } from '../components/mascot/AegisMascot';
import { severityToMascotState } from '../components/mascot/MascotStates';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionBar } from '../components/actions/ActionBar';
import { INCIDENT_TYPE_ICONS, INCIDENT_TYPE_LABELS, SEVERITY_COLORS } from '../utils/constants';
import { timeAgo } from '../utils/formatters';
import type { MascotState } from '../types';

export function FloatingAssistant() {
  const { incidents, selectedIncident, selectIncident } = useIncidents();
  const [expanded, setExpanded] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  useEffect(() => {
    if (incidents.length > 0) {
      const latest = incidents[0];
      setMascotState(severityToMascotState(latest.severity));
      const timer = setTimeout(() => setMascotState('monitoring'), 8000);
      return () => clearTimeout(timer);
    }
  }, [incidents]);

  const criticalCount = incidents.filter((i) => i.severity === 'critical').length;
  const highCount = incidents.filter((i) => i.severity === 'high').length;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    }}>
      <motion.div
        layout
        style={{
          background: 'rgba(10, 11, 15, 0.95)',
          borderRadius: '20px',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          width: expanded ? 320 : 200,
          cursor: 'grab',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Compact header */}
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <AegisMascot state={mascotState} size={expanded ? 80 : 60} showLabel={expanded} />

          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
          }}>
            {criticalCount > 0 && (
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 600,
              }}>
                {criticalCount} CRIT
              </span>
            )}
            {highCount > 0 && (
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(249, 115, 22, 0.2)',
                color: '#f97316',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                fontWeight: 600,
              }}>
                {highCount} HIGH
              </span>
            )}
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              {/* Recent incidents */}
              <div style={{
                padding: '0 16px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {incidents.slice(0, 5).map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => selectIncident(inc)}
                    style={{
                      padding: '8px 10px',
                      marginBottom: '6px',
                      borderRadius: '10px',
                      background: selectedIncident?.id === inc.id
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                      borderLeft: `3px solid ${SEVERITY_COLORS[inc.severity]}`,
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {INCIDENT_TYPE_ICONS[inc.type]} {INCIDENT_TYPE_LABELS[inc.type]}
                      </span>
                      <StatusBadge severity={inc.severity} size="sm" />
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '10px', marginTop: '2px' }}>
                      {timeAgo(inc.timestamp)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div style={{
                borderTop: '1px solid rgba(75, 85, 99, 0.2)',
                padding: '8px',
              }}>
                <ActionBar incident={selectedIncident} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
