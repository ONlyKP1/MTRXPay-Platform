import { AnimatedSection } from '../AnimatedSection';

export function Features() {
  return (
    <section className="features" id="features">
      <AnimatedSection className="section-header" animation="fade-up">
        <p className="section-tag">Why Choose MTRX</p>
        <h2>Built for Complex Payment Needs</h2>
        <p>
          We understand that not all businesses fit the standard payment model.
          MTRX is designed for those who need more.
        </p>
      </AnimatedSection>
      <div className="features-grid">
        <AnimatedSection className="feature-card card-animated" animation="fade-up" delay={0}>
          <div className="feature-icon icon-bounce">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>Risk-Aware Processing</h3>
          <p>
            Sophisticated risk management designed for high-value transactions
            and challenging verticals that traditional processors avoid.
          </p>
        </AnimatedSection>
        <AnimatedSection className="feature-card card-animated" animation="fade-up" delay={0.15}>
          <div className="feature-icon icon-bounce">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h3>Global Coverage</h3>
          <p>
            Multi-currency support with intelligent routing to optimize
            acceptance rates across different regions and payment methods.
          </p>
        </AnimatedSection>
        <AnimatedSection className="feature-card card-animated" animation="fade-up" delay={0.3}>
          <div className="feature-icon icon-bounce">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3>Compliant by Design</h3>
          <p>
            Built-in KYC/KYB workflows, transaction monitoring, and
            regulatory reporting to keep your business compliant.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
