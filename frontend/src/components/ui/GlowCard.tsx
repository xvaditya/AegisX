/* ── GlowCard Component ── */

import type { ReactNode } from 'react';
import styles from './ui.module.css';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function GlowCard({ children, className = '', style, onClick }: GlowCardProps) {
  return (
    <div
      className={`${styles.glowCard} ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}
