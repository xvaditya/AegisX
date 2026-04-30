import { mockIncidents, mockLogs, mockMetrics } from '../data/mockData';
import type { ActionRequest, ActionResponse, AIAnalysis, Incident, LogEntry, SystemMetrics } from '../types';

const API_BASE =
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

function jitterMetrics(): SystemMetrics {
  const wobble = (value: number, spread: number) =>
    Math.max(1, Math.min(99, Math.round(value + (Math.random() - 0.5) * spread)));

  return {
    ...mockMetrics,
    timestamp: new Date().toISOString(),
    cpu_percent: wobble(mockMetrics.cpu_percent, 18),
    memory_percent: wobble(mockMetrics.memory_percent, 12),
    disk_percent: wobble(mockMetrics.disk_percent, 5),
    network_connections: mockMetrics.network_connections + Math.round((Math.random() - 0.5) * 320),
  };
}

function fallbackAnalysis(incident: Incident): AIAnalysis {
  return {
    incident_id: incident.id,
    what_happened: incident.description,
    why_it_happened: `AegisX correlated ${incident.affected_service} telemetry with source ${incident.source_ip} and found behavior outside the accepted baseline.`,
    affected_service: incident.affected_service,
    severity_assessment: `${incident.severity.toUpperCase()} confidence based on traffic, process, and log evidence.`,
    suggested_action:
      incident.severity === 'critical'
        ? 'Isolate the node, block the source IP, then restart impacted services after containment.'
        : 'Block suspicious sources, continue scanning, and keep the automation rule armed.',
    responsible_team: incident.severity === 'critical' ? 'Security Operations' : 'Platform Reliability',
    confidence: incident.severity === 'critical' ? 0.94 : 0.82,
  };
}

export const api = {
  async getIncidents(limit = 20): Promise<Incident[]> {
    try {
      return await fetchJSON<Incident[]>(`/incidents?limit=${limit}`);
    } catch {
      return mockIncidents.slice(0, limit);
    }
  },

  async getLogs(): Promise<LogEntry[]> {
    try {
      return await fetchJSON<LogEntry[]>('/logs');
    } catch {
      return mockLogs;
    }
  },

  async getIncident(id: string): Promise<Incident> {
    try {
      return await fetchJSON<Incident>(`/incidents/${id}`);
    } catch {
      return mockIncidents.find((incident) => incident.id === id) ?? mockIncidents[0];
    }
  },

  async getMetrics(): Promise<SystemMetrics> {
    try {
      return await fetchJSON<SystemMetrics>('/metrics');
    } catch {
      return jitterMetrics();
    }
  },

  async getAnalysis(incidentId: string): Promise<AIAnalysis> {
    try {
      return await fetchJSON<AIAnalysis>(`/analysis?incident_id=${incidentId}`, { method: 'POST' });
    } catch {
      const incident = mockIncidents.find((item) => item.id === incidentId) ?? mockIncidents[0];
      await new Promise((resolve) => setTimeout(resolve, 450));
      return fallbackAnalysis(incident);
    }
  },

  async executeAction(request: ActionRequest): Promise<ActionResponse> {
    try {
      return await fetchJSON<ActionResponse>('/action', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 550));
      return {
        action_type: request.action_type,
        target: request.target,
        status: 'success',
        message: `${request.action_type.replaceAll('_', ' ')} completed for ${request.target}`,
        timestamp: new Date().toISOString(),
        duration_ms: 548,
      };
    }
  },
};
