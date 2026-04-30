import { AegisMascot } from './mascot/AegisMascot';
import type { MascotState } from '../types';

const copy: Record<MascotState, string> = {
  idle: 'Perimeter quiet. Watching the baseline.',
  monitoring: 'Live telemetry is flowing across protected nodes.',
  scanning: 'Scanning traffic and process drift.',
  thinking: 'Correlating logs, metrics, and incident context.',
  alert: 'Anomaly confirmed. Operator attention requested.',
  critical: 'Critical threat active. Containment recommended.',
  healing: 'Running recovery and containment playbooks.',
  success: 'Action completed. Stability improving.',
  sleeping: 'Low activity mode. I will wake on signal.',
};

interface AegisAvatarProps {
  state: MascotState;
}

export function AegisAvatar({ state }: AegisAvatarProps) {
  return (
    <aside className="aegis-avatar" aria-live="polite">
      <AegisMascot state={state} size={84} />
      <div>
        <p className="aegis-eyebrow">Aegis Intelligence</p>
        <strong>{state.toUpperCase()}</strong>
        <span>{copy[state]}</span>
      </div>
    </aside>
  );
}
