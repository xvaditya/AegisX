/* ── ActionBar Component ── */

import type { Incident, ActionType } from '../../types';
import { useActions } from '../../hooks/useActions';
import { ActionButton } from './ActionButton';
import styles from './actions.module.css';

interface ActionBarProps {
  incident: Incident | null;
  onActionStart?: (actionType: ActionType) => void;
  onActionComplete?: (success: boolean) => void;
}

const AVAILABLE_ACTIONS: ActionType[] = ['block_ip', 'restart_service', 'run_scan', 'kill_process', 'view_logs'];

export function ActionBar({ incident, onActionStart, onActionComplete }: ActionBarProps) {
  const { execute, executing, lastResult } = useActions();

  const handleAction = async (actionType: ActionType) => {
    if (!incident) return;

    const target =
      actionType === 'block_ip'
        ? incident.source_ip
        : actionType === 'restart_service'
          ? incident.affected_service
          : actionType === 'kill_process'
            ? `PID-${incident.id.replace(/\D/g, '').slice(-4).padStart(4, '0')}`
            : incident.affected_service;

    onActionStart?.(actionType);
    const result = await execute(actionType, target, incident.id);
    if (onActionComplete) {
      onActionComplete(result?.status === 'success');
    }
  };

  return (
    <div>
      <div className={styles.bar}>
        {AVAILABLE_ACTIONS.map((action) => (
          <ActionButton
            key={action}
            actionType={action}
            onClick={() => handleAction(action)}
            disabled={executing || !incident}
          />
        ))}
      </div>

      {lastResult && (
        <div
          className={`${styles.result} ${
            lastResult.status === 'success' ? styles.resultSuccess : styles.resultFailed
          }`}
        >
          {lastResult.status === 'success' ? '✅' : '❌'} {lastResult.message}
          <span style={{ opacity: 0.5, marginLeft: 8, fontSize: 10 }}>
            {lastResult.duration_ms}ms
          </span>
        </div>
      )}
    </div>
  );
}
