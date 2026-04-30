import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ActionResponse, Incident, MascotState, Severity, SystemMetrics } from '../types';

export type AegisEvent =
  | 'incident_detected'
  | 'critical_incident'
  | 'scan_started'
  | 'analysis_started'
  | 'action_running'
  | 'action_success'
  | 'action_failed'
  | 'idle_timeout'
  | 'metrics_normal'
  | 'metrics_warning'
  | 'metrics_critical';

export interface AegisEmotionSnapshot {
  state: MascotState;
  event: AegisEvent | 'default';
  since: number;
}

const EVENT_TO_STATE: Record<AegisEvent | 'default', MascotState> = {
  incident_detected: 'alert',
  critical_incident: 'critical',
  scan_started: 'scanning',
  analysis_started: 'thinking',
  action_running: 'healing',
  action_success: 'success',
  action_failed: 'alert',
  idle_timeout: 'sleeping',
  metrics_normal: 'idle',
  metrics_warning: 'scanning',
  metrics_critical: 'critical',
  default: 'idle',
};

const STATE_PRIORITY: Record<MascotState, number> = {
  idle: 0,
  monitoring: 1,
  sleeping: 1,
  scanning: 2,
  thinking: 3,
  healing: 4,
  success: 5,
  alert: 6,
  critical: 7,
};

const TRANSIENT_MS: Partial<Record<MascotState, number>> = {
  success: 4200,
  alert: 10000,
  critical: 14000,
  healing: 8000,
  thinking: 9000,
  scanning: 7000,
};

export const AEGIS_IDLE_TIMEOUT_MS = 45000;

export function mapEventToMascotState(event: AegisEvent | 'default'): MascotState {
  return EVENT_TO_STATE[event] ?? EVENT_TO_STATE.default;
}

export function severityToMascotEvent(severity: Severity): AegisEvent {
  return severity === 'critical' ? 'critical_incident' : 'incident_detected';
}

export function severityToMascotState(severity: Severity): MascotState {
  return mapEventToMascotState(severityToMascotEvent(severity));
}

export function incidentToMascotEvent(incident: Incident): AegisEvent {
  if (incident.severity === 'critical' || incident.type === 'service_crash') {
    return 'critical_incident';
  }
  return 'incident_detected';
}

export function actionToMascotEvent(result: ActionResponse | null): AegisEvent {
  return result?.status === 'success' ? 'action_success' : 'action_failed';
}

export function metricsToMascotEvent(metrics: SystemMetrics | null): AegisEvent {
  if (!metrics) return 'metrics_normal';
  const highestLoad = Math.max(metrics.cpu_percent, metrics.memory_percent, metrics.disk_percent);
  if (highestLoad >= 95) return 'metrics_critical';
  if (highestLoad >= 85 || metrics.network_connections > 700) return 'metrics_warning';
  return 'metrics_normal';
}

export function shouldReplaceMascotState(current: MascotState, next: MascotState): boolean {
  return STATE_PRIORITY[next] >= STATE_PRIORITY[current] || current === 'success';
}

export function useAegisEmotion(initialState: MascotState = 'idle') {
  const [snapshot, setSnapshot] = useState<AegisEmotionSnapshot>({
    state: initialState,
    event: 'default',
    since: 0,
  });
  const transientTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTransientTimer = useCallback(() => {
    if (transientTimer.current) {
      clearTimeout(transientTimer.current);
      transientTimer.current = null;
    }
  }, []);

  const scheduleIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setSnapshot({ state: 'sleeping', event: 'idle_timeout', since: Date.now() });
    }, AEGIS_IDLE_TIMEOUT_MS);
  }, []);

  const dispatch = useCallback((event: AegisEvent | 'default', force = false) => {
    const nextState = mapEventToMascotState(event);
    clearTransientTimer();

    setSnapshot((current) => {
      if (!force && !shouldReplaceMascotState(current.state, nextState)) return current;
      return { state: nextState, event, since: Date.now() };
    });

    scheduleIdleTimer();

    const duration = TRANSIENT_MS[nextState];
    if (duration) {
      transientTimer.current = setTimeout(() => {
        setSnapshot({ state: 'monitoring', event: 'default', since: Date.now() });
        scheduleIdleTimer();
      }, duration);
    }
  }, [clearTransientTimer, scheduleIdleTimer]);

  const reset = useCallback(() => dispatch('default', true), [dispatch]);

  useEffect(() => {
    scheduleIdleTimer();
    return () => {
      clearTransientTimer();
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [clearTransientTimer, scheduleIdleTimer]);

  return useMemo(() => ({
    ...snapshot,
    dispatch,
    reset,
  }), [dispatch, reset, snapshot]);
}
