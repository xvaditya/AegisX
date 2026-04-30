import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { incidentToMascotEvent, metricsToMascotEvent, useAegisEmotion } from '../state/aegisEmotion';
import type { ActionType, AIAnalysis, Incident, LogEntry, MascotState, SystemMetrics } from '../types';

export function useAegisSystem() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('Ready for operator command.');
  const mascot = useAegisEmotion('monitoring');
  const { state: mascotState, dispatch: dispatchMascot } = mascot;

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const [incidentData, logData, metricData] = await Promise.all([
          api.getIncidents(30),
          api.getLogs(),
          api.getMetrics(),
        ]);
        if (!mounted) return;
        setIncidents(incidentData);
        setLogs(logData);
        setMetrics(metricData);
        setSelectedIncident(incidentData[0] ?? null);
        dispatchMascot(metricsToMascotEvent(metricData), true);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load system state.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const timer = setInterval(async () => {
      const metricData = await api.getMetrics();
      if (!mounted) return;
      setMetrics(metricData);
      dispatchMascot(metricsToMascotEvent(metricData));
    }, 6000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [dispatchMascot]);

  useEffect(() => {
    if (!selectedIncident) return;
    let mounted = true;
    dispatchMascot('analysis_started', true);
    api.getAnalysis(selectedIncident.id).then((data) => {
      if (mounted) setAnalysis(data);
    });
    return () => {
      mounted = false;
    };
  }, [dispatchMascot, selectedIncident]);

  const selectIncident = useCallback((incident: Incident) => {
    setAnalysis(null);
    setSelectedIncident(incident);
    dispatchMascot(incidentToMascotEvent(incident), true);
  }, [dispatchMascot]);

  const executeAction = useCallback(async (actionType: ActionType, target: string, incidentId?: string) => {
    dispatchMascot('action_running', true);
    setActionMessage(`Executing ${actionType.replaceAll('_', ' ')} on ${target}...`);
    const result = await api.executeAction({ action_type: actionType, target, incident_id: incidentId, confirmed: true });
    setActionMessage(result.message);
    dispatchMascot(result.status === 'success' ? 'action_success' : 'action_failed', true);
    setLogs((current) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        service: 'operator',
        level: result.status === 'success' ? 'INFO' : 'ERROR',
        message: result.message,
      },
      ...current,
    ]);
    return result;
  }, [dispatchMascot]);

  const status = useMemo(() => {
    const state = mascotState as MascotState;
    if (state === 'critical') return 'CRITICAL';
    if (state === 'alert') return 'ALERT';
    if (state === 'healing') return 'HEALING';
    return 'OPTIMIZED';
  }, [mascotState]);

  return {
    incidents,
    logs,
    metrics,
    selectedIncident,
    analysis,
    loading,
    error,
    actionMessage,
    mascotState,
    status,
    selectIncident,
    executeAction,
  };
}
