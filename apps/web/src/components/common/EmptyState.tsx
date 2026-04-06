interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  message = 'No data yet.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="state-box state-box--empty">
      <div className="state-box__icon-ring">
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>
      {title && <h4 className="state-box__title">{title}</h4>}
      <p className="state-box__text">{message}</p>
      {action && (
        <button className="state-box__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
