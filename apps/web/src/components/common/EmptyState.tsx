interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  message = 'No data yet.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="state-box state-box--empty">
      {icon ?? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      <p className="state-box__text">{message}</p>
    </div>
  );
}
