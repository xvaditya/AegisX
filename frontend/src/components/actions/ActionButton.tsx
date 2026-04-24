/* ── ActionButton Component ── */

import type { ActionType } from '../../types';
import { ACTION_LABELS, ACTION_ICONS } from '../../utils/constants';
import styles from './actions.module.css';

interface ActionButtonProps {
  actionType: ActionType;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ actionType, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.buttonExecuting : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonIcon}>{ACTION_ICONS[actionType]}</span>
      {ACTION_LABELS[actionType]}
    </button>
  );
}
