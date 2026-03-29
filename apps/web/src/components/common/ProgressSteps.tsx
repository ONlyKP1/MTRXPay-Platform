interface Step {
  number: number;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="progress-steps">
      {steps.map((step, index) => (
        <div key={step.number} className="progress-step-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className={`progress-step ${
              currentStep === step.number
                ? 'active'
                : currentStep > step.number
                ? 'completed'
                : ''
            }`}
          >
            <span className="progress-step-number">
              {currentStep > step.number ? '✓' : step.number}
            </span>
            <span className="progress-step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`progress-connector ${
                currentStep > step.number ? 'completed' : ''
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
