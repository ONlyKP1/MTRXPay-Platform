import { useNavigate } from 'react-router-dom';
import type { MerchantStatus } from '../../types/auth';

interface Props {
  status: MerchantStatus;
  firstName?: string;
}

const statusConfig: Record<string, { heading: string; message: string; cta?: string; ctaRoute?: string; accent: string }> = {
  draft: {
    heading: 'Complete Your Application',
    message: 'Your merchant account setup is incomplete. Please finish your onboarding to unlock the full dashboard and begin processing payments.',
    cta: 'Continue Onboarding',
    ctaRoute: '/account-type',
    accent: 'var(--hp-gold)',
  },
  pending_submission: {
    heading: 'Submit Your Application',
    message: 'Your application is ready to submit. Once submitted, our compliance team will review your details and verify your account.',
    cta: 'Submit Application',
    ctaRoute: '/account-type',
    accent: 'var(--hp-gold)',
  },
  under_review: {
    heading: 'Application Under Review',
    message: 'Your merchant application is being reviewed by our compliance team. This typically takes 1 to 3 business days. We will notify you as soon as a decision is made.',
    accent: '#F59E0B',
  },
  rejected: {
    heading: 'Application Declined',
    message: 'Unfortunately, your merchant application has not been approved at this time. You may contact our compliance team for further details or to submit additional information.',
    cta: 'Contact Support',
    ctaRoute: '/help',
    accent: '#EF4444',
  },
  suspended: {
    heading: 'Account Suspended',
    message: 'Your merchant account has been temporarily suspended. Please contact our compliance team for more information regarding this decision.',
    cta: 'Contact Support',
    ctaRoute: '/help',
    accent: '#EF4444',
  },
};

export function DashboardLocked({ status, firstName }: Props) {
  const navigate = useNavigate();
  const config = statusConfig[status];
  if (!config) return null;

  const steps = [
    { label: 'Application', done: status !== 'draft' && status !== 'pending_submission' },
    { label: 'Compliance Review', done: status === 'approved' },
    { label: 'Account Active', done: status === 'approved' },
  ];

  return (
    <div className="dash-locked">
      <div className="dash-locked__glow" style={{ background: `radial-gradient(ellipse at center, ${config.accent}08, transparent 70%)` }} />

      {/* Status indicator */}
      <div className="dash-locked__status-icon" style={{ borderColor: `${config.accent}30`, background: `${config.accent}08` }}>
        {status === 'under_review' ? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={config.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        ) : status === 'rejected' || status === 'suspended' ? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={config.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={config.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        )}
      </div>

      <h1 className="dash-locked__heading">{config.heading}</h1>
      {firstName && (
        <p className="dash-locked__greeting">Hello, {firstName}</p>
      )}
      <p className="dash-locked__message">{config.message}</p>

      {/* Progress stepper for non-terminal states */}
      {(status === 'draft' || status === 'pending_submission' || status === 'under_review') && (
        <div className="dash-locked__stepper">
          {steps.map((s, i) => (
            <div key={s.label} className="dash-locked__step">
              <div className={`dash-locked__step-dot${s.done ? ' dash-locked__step-dot--done' : ''}`}>
                {s.done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className={`dash-locked__step-label${s.done ? ' dash-locked__step-label--done' : ''}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`dash-locked__step-line${s.done ? ' dash-locked__step-line--done' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Restricted features list */}
      <div className="dash-locked__restricted">
        <p className="dash-locked__restricted-label">Features locked until activation</p>
        <div className="dash-locked__restricted-list">
          <span>Payment Processing</span>
          <span>Payout Requests</span>
          <span>Transaction History</span>
          <span>API Access</span>
          <span>Settlement Reports</span>
        </div>
      </div>

      {/* CTA */}
      {config.cta && config.ctaRoute && (
        <button className="dash-locked__cta" onClick={() => navigate(config.ctaRoute!)}>
          {config.cta}
        </button>
      )}

      {status === 'under_review' && (
        <p className="dash-locked__review-note">
          You will receive an email notification when your application has been reviewed.
          No further action is required at this time.
        </p>
      )}
    </div>
  );
}
