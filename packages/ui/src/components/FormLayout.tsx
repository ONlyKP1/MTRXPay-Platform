import type { ReactNode } from 'react';

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className = '' }: FormSectionProps) {
  return (
    <div className={`mtrx-form-section ${className}`}>
      {(title || description) && (
        <div className="mtrx-form-section__header">
          {title && <h3 className="mtrx-form-section__title">{title}</h3>}
          {description && <p className="mtrx-form-section__desc">{description}</p>}
        </div>
      )}
      <div className="mtrx-form-section__body">{children}</div>
    </div>
  );
}

export interface FormRowProps {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function FormRow({ children, columns = 2, className = '' }: FormRowProps) {
  return (
    <div className={`mtrx-form-row mtrx-form-row--${columns}col ${className}`}>
      {children}
    </div>
  );
}

export interface FormActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

export function FormActions({ children, align = 'right', className = '' }: FormActionsProps) {
  return (
    <div className={`mtrx-form-actions mtrx-form-actions--${align} ${className}`}>
      {children}
    </div>
  );
}
