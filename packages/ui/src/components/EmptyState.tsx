import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No data',
  message = 'There are no items to display.',
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`mtrx-empty ${className}`}>
      {icon && <div className="mtrx-empty__icon">{icon}</div>}
      <h3 className="mtrx-empty__title">{title}</h3>
      <p className="mtrx-empty__message">{message}</p>
      {action && <div className="mtrx-empty__action">{action}</div>}
    </div>
  );
}
