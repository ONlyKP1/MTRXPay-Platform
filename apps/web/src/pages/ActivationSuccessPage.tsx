import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const features = [
  {
    title: 'Accept Payments',
    desc: 'Process card payments, bank transfers, and alternative payment methods across multiple currencies.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  },
  {
    title: 'Settlements & Payouts',
    desc: 'Automated settlement cycles with direct bank withdrawals. Full visibility of pending and cleared funds.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5z" /><path d="M16 12a1 1 0 102 0 1 1 0 00-2 0z" /></svg>,
  },
  {
    title: 'Revenue Analytics',
    desc: 'Real time transaction monitoring, revenue tracking, conversion metrics, and performance insights.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  },
  {
    title: 'Risk & Compliance',
    desc: 'Integrated fraud prevention, chargeback management, and regulatory compliance tools.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    title: 'API & Integrations',
    desc: 'Developer tools, REST API, webhooks, and SDK access for seamless platform integration.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
  },
  {
    title: 'Multi Currency',
    desc: 'Accept and settle in GBP, EUR, USD, and AED with automated currency management.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  },
];

export function ActivationSuccessPage() {
  const navigate = useNavigate();
  const { user, updateMerchantStatus } = useAuth();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1600),
      setTimeout(() => setStep(4), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnterDashboard = () => {
    updateMerchantStatus('approved');
    navigate('/dashboard');
  };

  return (
    <DashboardLayout unreadCount={0}>
      <div className="activation-success">
        {/* Hero card */}
        <div className={`activation-success__hero${step >= 1 ? ' activation-success__hero--visible' : ''}`}>
          <div className="activation-success__hero-glow" />

          {/* Badge */}
          <div className="activation-success__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified & Approved</span>
          </div>

          {/* Shield */}
          <div className="activation-success__shield">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          <h1 className="activation-success__heading">Account Activated</h1>
          <p className={`activation-success__subheading${step >= 2 ? ' activation-success__subheading--visible' : ''}`}>
            Congratulations, {user?.firstName}. Your merchant account has been verified and approved by our compliance team. You now have full, unrestricted access to the MTRX Pay platform.
          </p>
        </div>

        {/* Features */}
        <div className={`activation-success__features-section${step >= 3 ? ' activation-success__features-section--visible' : ''}`}>
          <p className="activation-success__features-label">Platform capabilities now unlocked</p>
          <div className="activation-success__features-grid">
            {features.map((f) => (
              <div key={f.title} className="activation-success__feature">
                <div className="activation-success__feature-icon">{f.icon}</div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`activation-success__cta${step >= 4 ? ' activation-success__cta--visible' : ''}`}>
          <button className="activation-success__btn" onClick={handleEnterDashboard}>
            Enter Your Dashboard
          </button>
          <p className="activation-success__note">
            Your merchant ID and API credentials are available in the developer section.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
