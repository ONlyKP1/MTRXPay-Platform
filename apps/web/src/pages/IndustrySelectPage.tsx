import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: ReactElement;
  isHighRisk?: boolean;
}

const industries: Industry[] = [
  {
    id: 'crypto',
    name: 'Cryptocurrency & Web3',
    description: 'Exchanges, NFT marketplaces, DeFi platforms',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.5 9a3 3 0 0 1 5 0c.4.8.5 2-.5 2.5-1 .5-1.5 1.5-1 2.5"/>
        <circle cx="12" cy="17" r=".5"/>
      </svg>
    ),
    isHighRisk: true,
  },
  {
    id: 'gaming',
    name: 'Gaming & iGaming',
    description: 'Online gaming, casinos, esports, betting',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M12 12h.01"/>
        <path d="M17 12h.01"/>
        <path d="M7 10v4"/>
        <path d="M5 12h4"/>
      </svg>
    ),
    isHighRisk: true,
  },
  {
    id: 'adult',
    name: 'Adult Entertainment',
    description: 'Content platforms, dating services',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    isHighRisk: true,
  },
  {
    id: 'cannabis',
    name: 'CBD & Cannabis',
    description: 'Licensed dispensaries, CBD products',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20"/>
        <path d="M12 6c-2.5-2-6.5-2-9 0 0 3 2 6 5 7-3 1-5 4-5 7 2.5 2 6.5 2 9 0"/>
        <path d="M12 6c2.5-2 6.5-2 9 0 0 3-2 6-5 7 3 1 5 4 5 7-2.5 2-6.5 2-9 0"/>
      </svg>
    ),
    isHighRisk: true,
  },
  {
    id: 'nutraceuticals',
    name: 'Nutraceuticals',
    description: 'Supplements, health products, wellness',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        <path d="m8.5 8.5 7 7"/>
      </svg>
    ),
    isHighRisk: true,
  },
  {
    id: 'forex',
    name: 'Forex & Trading',
    description: 'Trading platforms, prop firms, signals',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    isHighRisk: true,
  },
  {
    id: 'travel',
    name: 'Travel & Tourism',
    description: 'Airlines, hotels, tour operators',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
      </svg>
    ),
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    description: 'Online stores, marketplaces, dropshipping',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: 'saas',
    name: 'SaaS & Technology',
    description: 'Software subscriptions, digital services',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    id: 'other',
    name: 'Other Industry',
    description: 'Not listed? We can still help',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
];

export function IndustrySelectPage() {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedIndustry) {
      localStorage.setItem('mtrx_industry', selectedIndustry);
      navigate('/kyb');
    }
  };

  const selectedIndustryData = industries.find(i => i.id === selectedIndustry);

  return (
    <div className="auth-layout">
      <div className="auth-container" style={{ maxWidth: '800px' }}>
        <div className="auth-card">
          <img src="/logo.png" alt="MTRX Pay" className="auth-logo-img" />
          <h1 className="auth-title">Your Industry</h1>
          <p className="auth-subtitle">
            Select your primary business sector. We specialize in supporting underserved industries.
          </p>

          <div className="industry-grid">
            {industries.map((industry) => (
              <button
                key={industry.id}
                className={`industry-card ${selectedIndustry === industry.id ? 'selected' : ''} ${industry.isHighRisk ? 'high-risk' : ''}`}
                onClick={() => setSelectedIndustry(industry.id)}
              >
                <div className="industry-icon">{industry.icon}</div>
                <div className="industry-content">
                  <h4>{industry.name}</h4>
                  <p>{industry.description}</p>
                </div>
                {industry.isHighRisk && (
                  <span className="high-risk-badge">Specialist</span>
                )}
                {selectedIndustry === industry.id && (
                  <div className="selected-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedIndustryData?.isHighRisk && (
            <div className="high-risk-notice">
              <div className="notice-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="notice-content">
                <h4>You're in good hands</h4>
                <p>MTRX specializes in providing payment solutions for {selectedIndustryData.name.toLowerCase()} businesses. We understand your unique compliance needs.</p>
              </div>
            </div>
          )}

          <div className="industry-actions">
            <Button
              variant="secondary"
              onClick={() => navigate('/account-type')}
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedIndustry}
            >
              Continue
            </Button>
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
