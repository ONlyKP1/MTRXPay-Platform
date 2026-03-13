import { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';

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
  {
    q: 'What industries do you support?',
    a: 'We specialise in underserved verticals including cryptocurrency, gaming, adult entertainment, CBD, nutraceuticals, forex, travel, e-commerce, and SaaS. If traditional processors have turned you away, we can likely help.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We are PCI DSS Level 1 compliant and use end-to-end encryption for all transactions. Your data is stored in SOC 2 certified data centres with 24/7 monitoring.',
  },
  {
    q: 'Can I integrate with my existing platform?',
    a: 'Absolutely. We offer RESTful APIs, hosted payment pages, and plugins for major e-commerce platforms. Our developer documentation makes integration straightforward.',
  },
];

export function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <section className="hp-pricing-page__header">
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center' }}>
          <span className="hp-section-label">FAQ</span>
          <h1 className="hp-section-title">
            Frequently Asked <em>Questions</em>
          </h1>
          <p className="hp-section-subtitle">
            Everything you need to know about MTRX PAY. Can't find an answer? Get in touch.
          </p>
        </AnimatedSection>
      </section>

      <section className="hp-pricing-page__faq">
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
