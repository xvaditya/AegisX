import type { AutomationRule, Incident, LogEntry, NetworkNode, SystemMetrics } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-7001',
    type: 'service_crash',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    source_ip: '185.231.44.19',
    affected_service: 'alpha-7-central',
    description: 'Node Alpha-7 breach detected after anomalous privilege escalation and lateral movement.',
    is_resolved: false,
  },
  {
    id: 'INC-7002',
    type: 'brute_force',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
    source_ip: '45.91.82.104',
    affected_service: 'auth-service',
    description: 'Repeated failed credential attempts against admin gateway from distributed sources.',
    is_resolved: false,
  },
  {
    id: 'INC-7003',
    type: 'suspicious_traffic',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
    source_ip: '10.44.8.22',
    affected_service: 'api-gateway',
    description: 'Traffic spike exceeded baseline by 320 percent on edge cluster Omega-7.',
    is_resolved: false,
  },
  {
    id: 'INC-7004',
    type: 'api_500',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 92).toISOString(),
    source_ip: '172.16.20.4',
    affected_service: 'billing-api',
    description: 'Transient 500 rate increase correlated with a slow downstream cache shard.',
    is_resolved: true,
  },
];

export const mockLogs: LogEntry[] = [
  { id: 'LOG-1', timestamp: '14:23:54.210', service: 'api-gateway', level: 'WARN', message: 'Latency spike detected on node 4A. Load balancing redistribution in progress.' },
  { id: 'LOG-2', timestamp: '14:24:01.092', service: 'auth-service', level: 'SECURITY', message: 'Blocked credential spray from 45.91.82.104 after threshold breach.' },
  { id: 'LOG-3', timestamp: '14:24:05.889', service: 'db-cluster', level: 'INFO', message: 'VACUUM operation completed on access_logs and user_sessions.' },
  { id: 'LOG-4', timestamp: '14:24:12.331', service: 'automation', level: 'INFO', message: 'Triggering rule RECOVER_STALLED_SERVICES for checkout-worker.' },
  { id: 'LOG-5', timestamp: '14:24:15.999', service: 'alpha-7-central', level: 'ERROR', message: 'Unexpected shell spawned by service account svc-maintenance.' },
  { id: 'LOG-6', timestamp: '14:25:01.000', service: 'monitoring', level: 'DEBUG', message: 'Heartbeat signal received from edge cluster Omega-7.' },
];

export const mockMetrics: SystemMetrics = {
  timestamp: new Date().toISOString(),
  cpu_percent: 68,
  cpu_count: 16,
  memory_percent: 74,
  memory_used_gb: 92,
  memory_total_gb: 128,
  disk_percent: 61,
  disk_used_gb: 1280,
  disk_total_gb: 2048,
  network_bytes_sent: 884240000,
  network_bytes_recv: 1298840000,
  network_connections: 4204,
};

export const mockNodes: NetworkNode[] = [
  { id: 'N-ALPHA-7', name: 'Alpha-7 Central', region: 'us-east', status: 'degraded', traffic: 88, threats: 3, latency: 250 },
  { id: 'N-OMEGA-7', name: 'Omega-7 Edge', region: 'eu-west', status: 'online', traffic: 64, threats: 0, latency: 42 },
  { id: 'N-KAPPA-2', name: 'Kappa-2 Cache', region: 'ap-south', status: 'online', traffic: 47, threats: 1, latency: 78 },
  { id: 'N-SIGMA-9', name: 'Sigma-9 Archive', region: 'us-west', status: 'isolated', traffic: 12, threats: 4, latency: 0 },
];

export const mockRules: AutomationRule[] = [
  { id: 'AUTO-1', name: 'Brute Force Mitigation', category: 'NETWORK', enabled: true, trigger: 'failed logins > 25 in 60s', action: 'block source IP and rotate tokens', lastRun: '2 min ago' },
  { id: 'AUTO-2', name: 'Critical System Failure', category: 'RECOVERY', enabled: true, trigger: 'service health < 40%', action: 'restart service and page on-call', lastRun: '18 min ago' },
  { id: 'AUTO-3', name: 'Database Optimization', category: 'DATABASE', enabled: false, trigger: 'IOPS > 90% for 10 min', action: 'scale read replica by one node', lastRun: 'yesterday' },
];
