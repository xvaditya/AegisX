/* ── REST API Client ── */

import type { Incident, AIAnalysis, SystemMetrics, ActionRequest, ActionResponse } from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getIncidents: (limit = 20) => fetchJSON<Incident[]>(`/incidents/?limit=${limit}`),

  getIncident: (id: string) => fetchJSON<Incident>(`/incidents/${id}`),

  getMetrics: () => fetchJSON<SystemMetrics>('/metrics/'),

  getAnalysis: (incidentId: string) =>
    fetchJSON<AIAnalysis>(`/analysis/?incident_id=${incidentId}`, {
      method: 'POST',
    }),

  executeAction: (request: ActionRequest) =>
    fetchJSON<ActionResponse>('/actions/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};
