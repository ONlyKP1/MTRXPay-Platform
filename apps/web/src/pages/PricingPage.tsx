import { useState } from 'react';
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

const faqs = [
  {
    q: 'How quickly will I receive my funds?',
    a: 'Funds are settled T+1 — meaning you receive your money the next business day. All settlement schedules are transparent with no hidden holds.',
  },
  {
    q: 'How do you handle chargebacks?',
    a: 'We provide full chargeback management. Our system automatically gathers evidence and responds to disputes on your behalf, saving you time and reducing losses.',
  },
  {
    q: 'Which currencies do you support?',
    a: 'We support GBP, EUR, USD, and AED out of the box, with additional currencies available on request. Settlement can be arranged in your preferred currency.',
  },
  {
    q: 'How long does onboarding take?',
    a: 'Most merchants are fully onboarded within 24–48 hours. Our integrated KYC/KYB verification is built into the signup flow, so there\'s no back-and-forth with paperwork.',
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No. The rates shown are all-inclusive — there are no monthly minimums, no gateway fees, and no PCI compliance charges. What you see is what you pay.',
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
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
      </section>

      {/* FAQ */}
      <section className="hp-pricing-page__faq">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="hp-section-label">FAQ</span>
          <h2 className="hp-section-title">
            Common <em>questions</em>
          </h2>
        </AnimatedSection>
        <div className="hp-pricing-page__faq-list">
          {faqs.map((faq, i) => (
            <AnimatedSection
              key={i}
              className={`hp-pricing-page__faq-item${openFaq === i ? ' hp-pricing-page__faq-item--open' : ''}`}
              animation="fade-up"
              delay={i * 0.05}
            >
              <button
                className="hp-pricing-page__faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{faq.q}</span>
                <svg
                  className="hp-pricing-page__faq-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="hp-pricing-page__faq-a">
                <p>{faq.a}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
