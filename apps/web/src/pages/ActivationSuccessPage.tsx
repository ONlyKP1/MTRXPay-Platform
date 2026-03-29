import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function ActivationSuccessPage() {
  const navigate = useNavigate();
  const { user, updateMerchantStatus } = useAuth();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Animate through the success steps
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2000),
      setTimeout(() => setStep(4), 2800),
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
        {/* Background glow */}
        <div className="activation-success__glow" />

        {/* Shield icon with animation */}
        <div className={`activation-success__icon${step >= 1 ? ' activation-success__icon--visible' : ''}`}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className={`activation-success__heading${step >= 1 ? ' activation-success__heading--visible' : ''}`}>
          Account Activated
        </h1>
        <p className={`activation-success__subheading${step >= 2 ? ' activation-success__subheading--visible' : ''}`}>
          Congratulations, {user?.firstName}. Your merchant account has been verified and approved.
          You now have full access to the MTRX Pay platform.
        </p>

        {/* Unlocked features */}
        <div className={`activation-success__features${step >= 3 ? ' activation-success__features--visible' : ''}`}>
          <p className="activation-success__features-label">What you can now do</p>
          <div className="activation-success__features-grid">
            <div className="activation-success__feature">
              <div className="activation-success__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h4>Accept Payments</h4>
              <p>Process card payments, bank transfers, and alternative payment methods</p>
            </div>
            <div className="activation-success__feature">
              <div className="activation-success__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h4>Receive Payouts</h4>
              <p>Withdraw funds directly to your bank account after the settlement period</p>
            </div>
            <div className="activation-success__feature">
              <div className="activation-success__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h4>Live Analytics</h4>
              <p>Real time transaction monitoring, revenue tracking, and performance insights</p>
            </div>
            <div className="activation-success__feature">
              <div className="activation-success__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4>Compliance Tools</h4>
              <p>Integrated fraud prevention, chargeback management, and risk monitoring</p>
            </div>
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
