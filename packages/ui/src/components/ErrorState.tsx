import type { ReactNode } from 'react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`mtrx-error ${className}`}>
      <div className="mtrx-error__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="mtrx-error__title">{title}</h3>
      <p className="mtrx-error__message">{message}</p>
      {action && <div className="mtrx-error__action">{action}</div>}
    </div>
  );
}
