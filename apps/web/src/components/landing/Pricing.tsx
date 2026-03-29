import { Link } from 'react-router-dom';
import { AnimatedSection } from '../AnimatedSection';

const coreFeatures = [
  '50+ payment methods worldwide',
  'Dedicated account manager',
  'Managed dispute resolution',
  'Integrated KYC / KYB / AML',
  'Real-time transaction monitoring',
  'Multi-currency settlement',
];

export function Pricing() {
  return (
    <section className="hp-pricing" id="pricing">
      {/* Video background */}
      <div className="hp-pricing__video-wrap">
        <video
          className="hp-pricing__video"
          src="/tech-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hp-pricing__video-overlay" />
      </div>
      <div className="hp-pricing__bg-glow" />
      <div className="hp-pricing__bg-grid" />

      {/* Section header */}
      <AnimatedSection className="hp-pricing__header" animation="fade-up">
        <span className="hp-section-label">Pricing</span>
        <h2 className="hp-section-title">
          One plan. <em>No surprises.</em>
        </h2>
        <p className="hp-section-subtitle">
          Simple, transparent pricing with no hidden fees. Start processing in minutes.
        </p>
      </AnimatedSection>

      {/* Card */}
      <AnimatedSection className="hp-pricing__single" animation="fade-up" delay={0.15}>
        <div className="hp-pricing__card hp-pricing__card--single">
          {/* Decorative corner accents */}
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
            {coreFeatures.map((f, i) => (
              <li key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
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

    </section>
  );
}
