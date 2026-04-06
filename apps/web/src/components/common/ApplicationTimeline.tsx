import type { MerchantStatus } from '../../types/auth';

interface Props {
  status: MerchantStatus;
}

const steps = [
  { key: 'application', label: 'Application', desc: 'Complete your merchant details' },
  { key: 'submitted', label: 'Submitted', desc: 'Application sent for review' },
  { key: 'compliance', label: 'Compliance', desc: 'Under verification review' },
  { key: 'activated', label: 'Activated', desc: 'Ready to process payments' },
];

function getStepState(stepKey: string, status: MerchantStatus): 'done' | 'active' | 'upcoming' | 'error' {
  if (status === 'rejected' || status === 'suspended') {
    if (stepKey === 'compliance') return 'error';
    if (stepKey === 'application' || stepKey === 'submitted') return 'done';
    return 'upcoming';
  }
  if (status === 'approved') return 'done';
  if (status === 'under_review') {
    if (stepKey === 'application' || stepKey === 'submitted') return 'done';
    if (stepKey === 'compliance') return 'active';
    return 'upcoming';
  }
  if (status === 'pending_submission') {
    if (stepKey === 'application') return 'done';
    if (stepKey === 'submitted') return 'active';
    return 'upcoming';
  }
  // draft
  if (stepKey === 'application') return 'active';
  return 'upcoming';
}

export function ApplicationTimeline({ status }: Props) {
  return (
    <div className="app-timeline">
      {steps.map((step, i) => {
        const state = getStepState(step.key, status);
        return (
          <div key={step.key} className="app-timeline__step">
            <div className="app-timeline__indicator">
              <div className={`app-timeline__dot app-timeline__dot--${state}`}>
                {state === 'done' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : state === 'error' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : state === 'active' ? (
                  <span className="app-timeline__pulse" />
                ) : (
                  <span className="app-timeline__number">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`app-timeline__line app-timeline__line--${state === 'done' ? 'done' : 'pending'}`} />
              )}
            </div>
            <div className="app-timeline__content">
              <p className={`app-timeline__label app-timeline__label--${state}`}>{step.label}</p>
              <p className="app-timeline__desc">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
