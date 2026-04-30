import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, eyebrow, action, children, className = '' }: CardProps) {
  return (
    <section className={`aegis-card ${className}`}>
      {(title || eyebrow || action) && (
        <header className="aegis-card__header">
          <div>
            {eyebrow && <p className="aegis-eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
