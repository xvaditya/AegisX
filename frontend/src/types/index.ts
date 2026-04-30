/* ── AegisX Type Definitions ── */

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentType =
  | 'brute_force'
  | 'api_500'
  | 'cpu_overload'
  | 'suspicious_traffic'
  | 'service_crash';

export type ActionType =
  | 'block_ip'
  | 'restart_service'
  | 'isolate_node'
  | 'run_scan'
  | 'kill_process'
  | 'view_logs';

export type ActionStatus = 'pending' | 'executing' | 'success' | 'failed';

export type MascotState =
  | 'idle'
  | 'monitoring'
  | 'scanning'
  | 'thinking'
  | 'alert'
  | 'critical'
  | 'healing'
  | 'success'
  | 'sleeping';

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  timestamp: string;
  source_ip: string;
  affected_service: string;
  description: string;
  is_resolved: boolean;
}

export interface AIAnalysis {
  incident_id: string;
  what_happened: string;
  why_it_happened: string;
  affected_service: string;
  severity_assessment: string;
  suggested_action: string;
  responsible_team: string;
  confidence: number;
}

export interface SystemMetrics {
  timestamp: string;
  cpu_percent: number;
  cpu_count: number;
  memory_percent: number;
  memory_used_gb: number;
  memory_total_gb: number;
  disk_percent: number;
  disk_used_gb: number;
  disk_total_gb: number;
  network_bytes_sent: number;
  network_bytes_recv: number;
  network_connections: number;
}

export interface ActionRequest {
  action_type: ActionType;
  target: string;
  incident_id?: string;
  confirmed?: boolean;
}

export interface ActionResponse {
  action_type: ActionType;
  target: string;
  status: ActionStatus;
  message: string;
  timestamp: string;
  duration_ms: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SECURITY';

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: LogLevel;
  message: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'degraded' | 'isolated';
  traffic: number;
  threats: number;
  latency: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  trigger: string;
  action: string;
  lastRun: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
