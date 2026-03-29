import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { MerchantStatus } from '../../types/auth';

interface Props {
  status: MerchantStatus;
  firstName?: string;
}

const statusConfig: Record<string, { heading: string; subtitle: string; message: string; cta?: string; ctaRoute?: string; accent: string }> = {
  draft: {
    heading: 'Your Dashboard Awaits',
    subtitle: 'Application Incomplete',
    message: 'Complete your merchant onboarding to unlock the full MTRX Pay platform. Once verified, you will have access to payment processing, real time analytics, and settlement tools.',
    cta: 'Continue Onboarding',
    ctaRoute: '/account-type',
    accent: 'var(--hp-gold)',
  },
  pending_submission: {
    heading: 'Ready to Submit',
    subtitle: 'Final Review Required',
    message: 'Your application is prepared. Submit it now and our compliance team will begin the verification process. Approval typically takes one to three business days.',
    cta: 'Submit Application',
    ctaRoute: '/account-type',
    accent: 'var(--hp-gold)',
  },
  under_review: {
    heading: 'Verification in Progress',
    subtitle: 'Application Under Review',
    message: 'Our compliance team is reviewing your merchant application. This process typically takes one to three business days. You will receive a notification as soon as a decision has been made.',
    accent: '#F59E0B',
  },
  rejected: {
    heading: 'Application Not Approved',
    subtitle: 'Additional Information Required',
    message: 'Your merchant application was not approved at this time. This may be due to incomplete documentation or verification requirements. Please contact our compliance team for specific details.',
    cta: 'Contact Compliance',
    ctaRoute: '/help',
    accent: '#EF4444',
  },
  suspended: {
    heading: 'Account Suspended',
    subtitle: 'Action Required',
    message: 'Your merchant account has been temporarily suspended pending review. All payment processing and settlements have been paused. Please contact our compliance team immediately.',
    cta: 'Contact Compliance',
    ctaRoute: '/help',
    accent: '#EF4444',
  },
};

const lockedFeatures = [
  { icon: 'card', label: 'Payment Processing', desc: 'Accept cards, bank transfers, and alternative methods' },
  { icon: 'payout', label: 'Settlements & Payouts', desc: 'Automated settlement and bank withdrawals' },
  { icon: 'chart', label: 'Revenue Analytics', desc: 'Real time reporting and performance insights' },
  { icon: 'shield', label: 'Risk & Compliance', desc: 'Fraud prevention and chargeback management' },
  { icon: 'key', label: 'API & Integrations', desc: 'Developer tools, webhooks, and SDK access' },
  { icon: 'globe', label: 'Multi Currency', desc: 'Process payments in GBP, EUR, USD, and AED' },
];

const featureIcons: Record<string, React.ReactNode> = {
  card: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  payout: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  key: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
  globe: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
};

export function DashboardLocked({ status, firstName }: Props) {
  const navigate = useNavigate();
  const config = statusConfig[status];
  if (!config) return null;

  const steps = [
    { label: 'Application', active: true, done: status !== 'draft' && status !== 'pending_submission' },
    { label: 'Compliance', active: status === 'under_review', done: false },
    { label: 'Activated', active: false, done: false },
  ];

  const isTerminal = status === 'rejected' || status === 'suspended';
  const isReview = status === 'under_review';

  return (
    <div className="dash-locked">
      {/* Top card */}
      <div className="dash-locked__hero">
        <div className="dash-locked__hero-glow" />

        {/* Status badge */}
        <div className="dash-locked__badge" style={{ borderColor: `${config.accent}40`, color: config.accent }}>
          {isReview && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          )}
          {isTerminal && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          {!isReview && !isTerminal && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          )}
          <span>{config.subtitle}</span>
        </div>

        <h1 className="dash-locked__heading">{config.heading}</h1>

        {firstName && (
          <p className="dash-locked__greeting">Welcome, {firstName}</p>
        )}

        <p className="dash-locked__message">{config.message}</p>

        {/* Stepper */}
        {!isTerminal && (
          <div className="dash-locked__stepper">
            {steps.map((s, i) => (
              <div key={s.label} className="dash-locked__step">
                <div className={`dash-locked__step-dot${s.done ? ' dash-locked__step-dot--done' : s.active ? ' dash-locked__step-dot--active' : ''}`}>
                  {s.done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className={`dash-locked__step-label${s.done ? ' dash-locked__step-label--done' : s.active ? ' dash-locked__step-label--active' : ''}`}>{s.label}</span>
                {i < steps.length - 1 && <div className={`dash-locked__step-line${s.done ? ' dash-locked__step-line--done' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {config.cta && config.ctaRoute && (
          <button className="dash-locked__cta" onClick={() => navigate(config.ctaRoute!)}>
            {config.cta}
          </button>
        )}

        {isReview && (
          <p className="dash-locked__review-note">
            No further action is required. You will be notified by email when your application has been reviewed.
          </p>
        )}
      </div>

      {/* Locked features grid */}
      <div className="dash-locked__section-label">Features available once activated</div>
      <div className="dash-locked__features">
        {lockedFeatures.map((f) => (
          <div key={f.label} className="dash-locked__feature">
            <div className="dash-locked__feature-icon">{featureIcons[f.icon]}</div>
            <div>
              <h4 className="dash-locked__feature-title">{f.label}</h4>
              <p className="dash-locked__feature-desc">{f.desc}</p>
            </div>
            <div className="dash-locked__feature-lock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
