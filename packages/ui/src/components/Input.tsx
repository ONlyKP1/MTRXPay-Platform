import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="mtrx-input-group">
        {label && <label className="mtrx-input-label">{label}</label>}
        <input
          ref={ref}
          className={`mtrx-input ${error ? 'mtrx-input--error' : ''} ${className}`}
          {...props}
        />
        {hint && !error && <span className="mtrx-input-hint">{hint}</span>}
        {error && <span className="mtrx-input-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
