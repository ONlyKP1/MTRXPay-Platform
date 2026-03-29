import React from 'react';

// SVG Icon Components
const IconSmartRouting = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconCompliance = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconWallet = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconPartner = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const features = [
  {
    icon: <IconSmartRouting />,
    title: 'Smart Routing',
    description: 'Intelligent PSP selection based on transaction type, risk profile, and success rates.'
  },
  {
    icon: <IconCompliance />,
    title: 'Compliance First',
    description: 'Built-in KYB/KYC verification, AML screening, and transaction monitoring.'
  },
  {
    icon: <IconWallet />,
    title: 'Wallet System',
    description: 'Secure digital wallets with instant settlement and split payment capabilities.'
  },
  {
    icon: <IconDashboard />,
    title: 'Real-Time Dashboard',
    description: 'Complete visibility into transactions, settlements, and account status.'
  },
  {
    icon: <IconGlobe />,
    title: 'Multi-Jurisdiction',
    description: 'Operating in UK, EU, and UAE with plans for global expansion.'
  },
  {
    icon: <IconPartner />,
    title: 'Partner Network',
    description: 'Revenue-sharing affiliate program—earn 1% on referred merchant volume.'
  }
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="section-header">
        <div className="section-tag">Platform Capabilities</div>
        <h2>Built for Complex Payment Flows</h2>
        <p>
          MTRX orchestrates payments across multiple providers, 
          manages digital wallets, and handles compliance—so you don't have to.
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
