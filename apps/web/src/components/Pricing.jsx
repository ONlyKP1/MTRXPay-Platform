import React from 'react';

const pricingItems = [
  {
    value: '£49.99',
    period: 'per month',
    description: '12-month commitment required. Full access to platform features, compliance tools, and support.'
  },
  {
    value: '3%',
    period: 'transaction fee',
    description: 'Transparent per-transaction fee. No volume tiers. No hidden costs. Includes PSP routing and processing.'
  },
  {
    value: '1%',
    period: 'affiliate reward',
    description: 'Refer merchants and earn 1% of their transaction volume. Build passive income through our network.'
  }
];

function Pricing() {
  return (
    <section className="features" id="pricing">
      <div className="section-header">
        <div className="section-tag">Transparent Pricing</div>
        <h2>Simple, Predictable Fees</h2>
        <p>
          No hidden charges. No surprise fees. Just honest pricing for premium service.
        </p>
      </div>
      <div className="features-grid">
        {pricingItems.map((item, index) => (
          <div key={index} className="feature-card">
            <h3 style={{ fontSize: '42px', marginBottom: '8px' }}>{item.value}</h3>
            <p style={{ color: 'var(--gold)', marginBottom: '20px' }}>{item.period}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
