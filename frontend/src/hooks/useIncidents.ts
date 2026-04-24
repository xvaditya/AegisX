/* ── useIncidents Hook ── */

import { useState, useEffect, useCallback } from 'react';
import type { Incident, AIAnalysis } from '../types';
import { api } from '../services/api';
import { useWebSocket } from './useWebSocket';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const { isConnected, subscribe } = useWebSocket('/api/incidents/ws');

  // Load initial incidents
  useEffect(() => {
    api.getIncidents(20).then(setIncidents).catch(console.error);
  }, []);

  // Subscribe to live incidents
  useEffect(() => {
    const unsub = subscribe((data) => {
      const incident = data as Incident;
      setIncidents((prev) => [incident, ...prev].slice(0, 50));
    });
    return unsub;
  }, [subscribe]);

  // Get analysis when an incident is selected
  const selectIncident = useCallback(async (incident: Incident) => {
    setSelectedIncident(incident);
    setAnalysis(null);
    setAnalysisLoading(true);
    try {
      const result = await api.getAnalysis(incident.id);
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to get analysis:', err);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  return {
    incidents,
    selectedIncident,
    analysis,
    analysisLoading,
    selectIncident,
    isConnected,
  };
}
