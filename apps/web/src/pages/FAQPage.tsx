import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';

const faqs = [
  {
    q: 'How quickly will I receive my funds?',
    a: 'Settlement timelines are dynamic and tailored to your merchant type, volume, and risk profile. All payout rules are transparent with no hidden holds.',
  },
  {
    q: 'How do you handle chargebacks?',
    a: 'Every chargeback is recorded and reviewed by our team. We examine your evidence and make a human decision, not a bot. Real people assessing real disputes to protect your revenue.',
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
    a: 'No. The rates shown are all-inclusive. There are no monthly minimums, no gateway fees, and no PCI compliance charges. What you see is what you pay.',
  },
  {
    q: 'What industries do you support?',
    a: 'We specialise in underserved verticals including cryptocurrency, gaming, adult entertainment, CBD, nutraceuticals, forex, travel, e-commerce, and SaaS. If traditional processors have turned you away, we can likely help.',
  },
  {
    q: 'How do I accept payments?',
    a: 'MTRX gives you multiple ways to accept payments. Embed our checkout widget directly on your site, generate shareable payment links for invoices or one-off charges, integrate via our RESTful API for full control, or use hosted payment pages with zero development required.',
  },
];

export function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="hp-faq-page">
      <section className="hp-faq-page__header">
        <div className="hp-faq-page__video-wrap">
          <video
            className="hp-faq-page__video"
            src="/faq-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hp-faq-page__overlay" />
        </div>
        <AnimatedSection animation="fade-up" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="hp-section-label">FAQ</span>
          <h1 className="hp-section-title">
            Frequently Asked <em>Questions</em>
          </h1>
          <p className="hp-section-subtitle">
            Everything you need to know about MTRX PAY. Can't find an answer? <Link to="/contact" style={{ color: 'var(--hp-gold)' }}>Get in touch</Link>.
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
    </div>
  );
}
