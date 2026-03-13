import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AccountTypePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = (type: 'individual' | 'business') => {
    localStorage.setItem('mtrx_account_type', type);

    if (type === 'individual') {
      navigate('/kyc');
    } else {
      navigate('/industry-select');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container" style={{ maxWidth: '600px' }}>
        <div className="auth-card">
          <img src="/logo.png" alt="MTRX Pay" className="auth-logo-img" />
          <h1 className="auth-title">Account Type</h1>
          <p className="auth-subtitle">
            Welcome {user?.firstName}! Please select your account type to continue.
          </p>

          <div className="account-type-options">
            <button className="account-type-card" onClick={() => handleSelect('individual')}>
              <div className="account-type-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="account-type-content">
                <h3>Individual</h3>
                <p>I'm signing up as a sole trader or freelancer</p>
              </div>
            </button>

            <button className="account-type-card" onClick={() => handleSelect('business')}>
              <div className="account-type-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                  <path d="M9 9v.01"/>
                  <path d="M9 12v.01"/>
                  <path d="M9 15v.01"/>
                  <path d="M9 18v.01"/>
                </svg>
              </div>
              <div className="account-type-content">
                <h3>Business</h3>
                <p>I'm registering a company (Ltd, LLP, PLC, etc.)</p>
              </div>
            </button>
          </div>

          <div className="account-type-footer">
            <p>Not sure? Sole traders should select Individual.</p>
            <p>Limited companies should select Business.</p>
          </div>

          <div className="fast-approval-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            48-Hour Approval Process
          </div>
        </div>
      </div>
    </div>
  );
}
