export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`mtrx-loading ${className}`}>
      <div className="mtrx-loading__spinner" />
      <span className="mtrx-loading__text">{message}</span>
    </div>
  );
}
