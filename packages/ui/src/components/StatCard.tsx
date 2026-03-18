import type { ReactNode } from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = '',
}: StatCardProps) {
  return (
    <div className={`mtrx-stat ${className}`}>
      {icon && <div className="mtrx-stat__icon">{icon}</div>}
      <div className="mtrx-stat__content">
        <span className="mtrx-stat__label">{label}</span>
        <span className="mtrx-stat__value">{value}</span>
        {change && (
          <span className={`mtrx-stat__change mtrx-stat__change--${changeType}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
