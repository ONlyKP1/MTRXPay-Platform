export interface Step {
  number: number;
  label: string;
}

export interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressStepper({ steps, currentStep, className = '' }: ProgressStepperProps) {
  return (
    <div className={`mtrx-stepper ${className}`}>
      {steps.map((step, index) => (
        <div key={step.number} className="mtrx-stepper__item">
          <div
            className={[
              'mtrx-stepper__step',
              currentStep === step.number && 'mtrx-stepper__step--active',
              currentStep > step.number && 'mtrx-stepper__step--completed',
            ].filter(Boolean).join(' ')}
          >
            <span className="mtrx-stepper__number">
              {currentStep > step.number ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step.number
              )}
            </span>
            <span className="mtrx-stepper__label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={[
                'mtrx-stepper__connector',
                currentStep > step.number && 'mtrx-stepper__connector--completed',
              ].filter(Boolean).join(' ')}
            />
          )}
        </div>
      ))}
    </div>
  );
}
