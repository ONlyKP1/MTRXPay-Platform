import type { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  return (
    <div className={`mtrx-card mtrx-card--pad-${padding} ${className}`}>
      {(title || action) && (
        <div className="mtrx-card__header">
          <div>
            {title && <h3 className="mtrx-card__title">{title}</h3>}
            {subtitle && <p className="mtrx-card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="mtrx-card__action">{action}</div>}
        </div>
      )}
      <div className="mtrx-card__body">{children}</div>
    </div>
  );
}
