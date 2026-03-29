interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="state-box state-box--loading">
      <span className="state-box__spinner" />
      <p className="state-box__text">{message}</p>
    </div>
  );
}
