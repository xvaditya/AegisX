/* ── AegisX Constants ── */

export const API_BASE_URL = '/api';
export const WS_BASE_URL = `ws://${window.location.hostname}:8000`;

export const SEVERITY_COLORS: Record<string, string> = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#f97316',
  critical: '#ef4444',
};

export const SEVERITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const INCIDENT_TYPE_LABELS: Record<string, string> = {
  brute_force: 'Brute Force',
  api_500: 'API 500 Error',
  cpu_overload: 'CPU Overload',
  suspicious_traffic: 'Suspicious Traffic',
  service_crash: 'Service Crash',
};

export const INCIDENT_TYPE_ICONS: Record<string, string> = {
  brute_force: '🔐',
  api_500: '🔥',
  cpu_overload: '⚡',
  suspicious_traffic: '🕵️',
  service_crash: '💀',
};

export const ACTION_LABELS: Record<string, string> = {
  block_ip: 'Block IP',
  restart_service: 'Restart Service',
  run_scan: 'Run Scan',
  kill_process: 'Kill Process',
  view_logs: 'View Logs',
};

export const ACTION_ICONS: Record<string, string> = {
  block_ip: '🛡️',
  restart_service: '🔄',
  run_scan: '🔍',
  kill_process: '☠️',
  view_logs: '📋',
};

export const MASCOT_COLORS: Record<string, string> = {
  idle: '#6b7280',
  monitoring: '#3b82f6',
  scanning: '#3b82f6',
  thinking: '#facc15',
  alert: '#f97316',
  critical: '#ef4444',
  healing: '#4ade80',
  success: '#4ade80',
  sleeping: '#6b7280',
};

export const METRICS_POLL_INTERVAL = 3000;
export const WS_RECONNECT_INTERVAL = 3000;
