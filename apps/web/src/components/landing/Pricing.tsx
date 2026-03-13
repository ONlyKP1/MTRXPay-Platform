import { Link } from 'react-router-dom';
import { AnimatedSection } from '../AnimatedSection';

const features = [
  '£149 one-time setup fee',
  '50+ payment methods',
  'Dedicated account manager',
  'Managed dispute resolution',
  'Integrated KYC/KYB/AML',
  'Founding rates locked permanently',
];

export function Pricing() {
  return (
    <section className="hp-pricing" id="pricing">
      <AnimatedSection className="hp-pricing__single" animation="fade-up">
        <div className="hp-pricing__glow" />
        <div className="hp-pricing__card hp-pricing__card--single">
          <span className="hp-pricing__tag">Founding Partner</span>
          <div className="hp-pricing__price">
            <span className="hp-pricing__amount">£49</span>
            <span className="hp-pricing__per"> /month</span>
          </div>
          <span className="hp-pricing__txn">+ 7% per transaction</span>
          <ul className="hp-pricing__features">
            {features.map((f, i) => (
              <li key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="hp-btn hp-btn--primary hp-btn--full">
            Join Now
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
