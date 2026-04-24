/* ── Mascot State Config ── */

import type { MascotState, Severity } from '../../types';

export interface MascotStateConfig {
  label: string;
  bodyColor: string;
  eyeColor: string;
  sproutColor: string;
  glowColor: string;
  expression: 'neutral' | 'happy' | 'worried' | 'alert' | 'sleeping' | 'excited';
}

export const MASCOT_STATE_CONFIGS: Record<MascotState, MascotStateConfig> = {
  idle: {
    label: 'All systems nominal',
    bodyColor: '#4b5563',
    eyeColor: '#e5e7eb',
    sproutColor: '#4ade80',
    glowColor: 'transparent',
    expression: 'neutral',
  },
  monitoring: {
    label: 'Monitoring systems...',
    bodyColor: '#4b5563',
    eyeColor: '#93c5fd',
    sproutColor: '#4ade80',
    glowColor: '#3b82f620',
    expression: 'neutral',
  },
  scanning: {
    label: 'Scanning for threats...',
    bodyColor: '#4b5563',
    eyeColor: '#60a5fa',
    sproutColor: '#4ade80',
    glowColor: '#3b82f630',
    expression: 'neutral',
  },
  thinking: {
    label: 'Analyzing incident...',
    bodyColor: '#4b5563',
    eyeColor: '#fde68a',
    sproutColor: '#fbbf24',
    glowColor: '#facc1520',
    expression: 'worried',
  },
  alert: {
    label: '⚠️ Alert detected!',
    bodyColor: '#6b5540',
    eyeColor: '#fca5a5',
    sproutColor: '#f97316',
    glowColor: '#f9731630',
    expression: 'alert',
  },
  critical: {
    label: '🚨 CRITICAL INCIDENT!',
    bodyColor: '#7f1d1d',
    eyeColor: '#fecaca',
    sproutColor: '#ef4444',
    glowColor: '#ef444440',
    expression: 'alert',
  },
  healing: {
    label: 'Applying fix...',
    bodyColor: '#4b5563',
    eyeColor: '#86efac',
    sproutColor: '#4ade80',
    glowColor: '#4ade8030',
    expression: 'happy',
  },
  success: {
    label: '✅ Issue resolved!',
    bodyColor: '#4b5563',
    eyeColor: '#86efac',
    sproutColor: '#4ade80',
    glowColor: '#4ade8040',
    expression: 'excited',
  },
  sleeping: {
    label: 'Zzz... All quiet',
    bodyColor: '#374151',
    eyeColor: '#6b7280',
    sproutColor: '#6b7280',
    glowColor: 'transparent',
    expression: 'sleeping',
  },
};

export function severityToMascotState(severity: Severity): MascotState {
  switch (severity) {
    case 'low': return 'monitoring';
    case 'medium': return 'thinking';
    case 'high': return 'alert';
    case 'critical': return 'critical';
    default: return 'idle';
  }
}
