import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    'mtrx-btn',
    `mtrx-btn--${variant}`,
    `mtrx-btn--${size}`,
    fullWidth && 'mtrx-btn--full',
    isLoading && 'mtrx-btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="mtrx-btn__spinner" />
      ) : (
        <>
          {icon && <span className="mtrx-btn__icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
