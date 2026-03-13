import { Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';

const features = [
  '50+ payment methods worldwide',
  'Dedicated account manager',
  'Managed dispute resolution',
  'Integrated KYC / KYB / AML',
  'Real-time transaction monitoring',
  'Multi-currency settlement',
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function PricingPage() {

  return (
    <div className="hp-pricing-page">
      {/* Video background */}
      <div className="hp-pricing-page__video-wrap">
        <video
          className="hp-pricing-page__video"
          src="/pricing-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hp-pricing-page__video-overlay" />
      </div>

      {/* Header */}
      <section className="hp-pricing-page__header">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center' }}>
          <span className="hp-section-label">Pricing</span>
          <h1 className="hp-section-title">
            Transparent <em>Pricing</em>
          </h1>
          <p className="hp-section-subtitle">
            Simple, all-inclusive pricing. No hidden fees, no surprise charges.
          </p>
        </AnimatedSection>
      </section>

      {/* Single pricing card */}
      <section className="hp-pricing-page__tiers">
        <AnimatedSection className="hp-pricing-page__single-wrap" animation="fade-up" delay={0.15}>
          <div className="hp-pricing__card hp-pricing__card--single hp-pricing-page__single-card">
            <div className="hp-pricing__corner hp-pricing__corner--tl" />
            <div className="hp-pricing__corner hp-pricing__corner--br" />

            <div className="hp-pricing__card-top">
              <div className="hp-pricing__price">
                <span className="hp-pricing__currency">£</span>
                <span className="hp-pricing__amount">49</span>
                <span className="hp-pricing__per">/mo</span>
              </div>
              <span className="hp-pricing__txn">+ 7% per transaction</span>
              <p className="hp-pricing__setup">£149 one-time setup · no monthly minimums</p>
            </div>

            <div className="hp-pricing__divider" />

            <ul className="hp-pricing__features">
              {features.map((f) => (
                <li key={f}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/register" className="hp-btn hp-btn--primary hp-btn--full hp-pricing__cta-btn">
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <p className="hp-pricing__guarantee">No lock-in · Cancel anytime · Go live in 24 hours</p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="hp-pricing-page__coming-soon" animation="fade-up" delay={0.3}>
          <div className="hp-pricing-page__coming-soon-inner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <div>
              <strong>Growth &amp; Enterprise tiers coming soon</strong>
              <p>Volume-based pricing, faster settlement, and dedicated infrastructure — launching shortly.</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

    </div>
  );
}
