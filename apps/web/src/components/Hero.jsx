import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-tag">Payment Orchestration Platform</span>
        <h1>The <strong>Trusted</strong> Way to Process Complex Payments</h1>
        <p className="hero-subtitle">
          MTRX provides premium payment orchestration for businesses and individuals 
          operating in high-value, high-risk, and underserved verticals.
        </p>
        <div className="hero-cta">
          <a href="/onboarding" className="btn btn-primary">Start Onboarding</a>
          <a href="#features" className="btn btn-secondary">Learn More</a>
        </div>
      </div>
      <div className="hero-image">
        <div className="image-placeholder">
          <div>
            <strong>Hero Image</strong><br />
            Suggested: Dashboard interface, payment flow visualization,<br />
            or abstract representation of secure transactions
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
