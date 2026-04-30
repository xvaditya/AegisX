import type { MascotState, Severity } from '../../types';
import { severityToMascotState as mapSeverityToMascotState } from '../../state/aegisEmotion';

export interface MascotStateConfig {
  label: string;
  aura: string;
  accent: string;
  expression: 'neutral' | 'focused' | 'thinking' | 'alert' | 'panic' | 'healing' | 'happy' | 'sleeping';
  accessory?: 'scanline' | 'question' | 'siren' | 'wrench' | 'sparkles' | 'zzz';
}

export const MASCOT_STATE_CONFIGS: Record<MascotState, MascotStateConfig> = {
  idle: {
    label: 'All systems nominal',
    aura: 'transparent',
    accent: '#2563eb',
    expression: 'neutral',
  },
  monitoring: {
    label: 'Monitoring systems...',
    aura: 'rgba(82, 183, 136, 0.18)',
    accent: '#38bdf8',
    expression: 'neutral',
  },
  scanning: {
    label: 'Scanning for threats...',
    aura: 'rgba(59, 130, 246, 0.28)',
    accent: '#60a5fa',
    expression: 'focused',
    accessory: 'scanline',
  },
  thinking: {
    label: 'Analyzing incident...',
    aura: 'rgba(250, 204, 21, 0.22)',
    accent: '#facc15',
    expression: 'thinking',
    accessory: 'question',
  },
  alert: {
    label: 'Alert detected!',
    aura: 'rgba(249, 115, 22, 0.3)',
    accent: '#f97316',
    expression: 'alert',
    accessory: 'siren',
  },
  critical: {
    label: 'Critical incident!',
    aura: 'rgba(239, 68, 68, 0.4)',
    accent: '#ef4444',
    expression: 'panic',
    accessory: 'siren',
  },
  healing: {
    label: 'Applying fix...',
    aura: 'rgba(74, 222, 128, 0.3)',
    accent: '#60a5fa',
    expression: 'healing',
    accessory: 'wrench',
  },
  success: {
    label: 'Issue resolved!',
    aura: 'rgba(134, 239, 172, 0.34)',
    accent: '#93c5fd',
    expression: 'happy',
    accessory: 'sparkles',
  },
  sleeping: {
    label: 'Zzz... All quiet',
    aura: 'rgba(107, 114, 128, 0.16)',
    accent: '#8b949e',
    expression: 'sleeping',
    accessory: 'zzz',
  },
};

export function severityToMascotState(severity: Severity): MascotState {
  return mapSeverityToMascotState(severity);
}
