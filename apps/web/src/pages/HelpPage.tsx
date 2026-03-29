import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  { category: 'Getting Started', question: 'How do I complete my merchant verification?', answer: 'To complete verification, navigate to the Compliance Centre and upload all required documents. This typically includes proof of identity, business registration documents, and bank statements. Our team will review your submission within 48 hours.' },
  { category: 'Getting Started', question: 'What documents do I need to get started?', answer: 'You will need: Certificate of Incorporation, Proof of Business Address, Director ID documents, Bank Statement (last 3 months), and depending on your industry, additional compliance documents may be required.' },
  { category: 'Payments', question: 'How long does it take for payments to clear?', answer: 'Payments are subject to a 72-hour escrow period for security purposes. After this period, funds are released to your available balance and can be paid out according to your payout schedule.' },
  { category: 'Payments', question: 'What currencies do you support?', answer: 'MTRX Pay currently supports GBP, EUR, USD, and AED. We are continuously expanding our currency support. Contact us if you need a specific currency for your business.' },
  { category: 'Payouts', question: 'How often can I receive payouts?', answer: 'You can configure your payout schedule in the Payout Settings. Options include Daily, Weekly, Bi-Weekly, or Monthly payouts. Changes take effect from the next payout cycle.' },
  { category: 'Payouts', question: 'What are the payout fees?', answer: 'Payout fees vary by plan. Starter plan includes standard bank transfer fees, while Growth and Enterprise plans may have reduced or waived fees. Check your subscription details for specific rates.' },
  { category: 'Security', question: 'How is my data protected?', answer: 'MTRX Pay uses bank-grade encryption (AES-256) for all data at rest and in transit. We are PCI DSS Level 1 compliant and undergo regular security audits. Your funds are held in segregated accounts with tier-1 banking partners.' },
  { category: 'Chargebacks', question: 'How do I respond to a chargeback?', answer: 'When a chargeback is raised, you will receive an alert in your dashboard and via email. Navigate to the transaction details to submit evidence. You typically have 7-14 days to respond depending on the card network.' },
];

const apiEndpoints = [
  { method: 'POST', path: '/v1/payments', description: 'Create a new payment' },
  { method: 'GET', path: '/v1/payments/:id', description: 'Retrieve payment details' },
  { method: 'POST', path: '/v1/refunds', description: 'Create a refund' },
  { method: 'GET', path: '/v1/transactions', description: 'List all transactions' },
  { method: 'GET', path: '/v1/balance', description: 'Get current balance' },
  { method: 'POST', path: '/v1/payouts', description: 'Request a payout' },
  { method: 'GET', path: '/v1/webhooks', description: 'List webhook endpoints' },
  { method: 'POST', path: '/v1/webhooks', description: 'Create webhook endpoint' },
];

export function HelpPage() {
  const [activeTab, setActiveTab] = useState<'guides' | 'faq' | 'api'>('guides');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];
  const filteredFaqs = selectedCategory === 'all' ? faqs : faqs.filter(f => f.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Help & Documentation</h1>
      </div>

      {/* Tabs */}
      <div className="hp-dash__tabs">
        <button className={`hp-dash__tab${activeTab === 'guides' ? ' hp-dash__tab--active' : ''}`} onClick={() => setActiveTab('guides')}>Quick Guides</button>
        <button className={`hp-dash__tab${activeTab === 'faq' ? ' hp-dash__tab--active' : ''}`} onClick={() => setActiveTab('faq')}>FAQ</button>
        <button className={`hp-dash__tab${activeTab === 'api' ? ' hp-dash__tab--active' : ''}`} onClick={() => setActiveTab('api')}>Developer API</button>
      </div>

      {/* Quick Guides */}
      {activeTab === 'guides' && (
        <div className="hp-dash__actions-grid" style={{ marginTop: 8 }}>
          <div className="hp-dash__action-card">
            <div className="hp-dash__action-icon" style={{ color: 'var(--hp-green)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h4 className="hp-dash__action-title">Getting Started</h4>
            <p className="hp-dash__action-desc">Complete your account setup and start accepting payments.</p>
            <ul className="hp-dash__guide-steps">
              <li>Complete KYC/KYB verification</li>
              <li>Add your bank account</li>
              <li>Configure payout schedule</li>
              <li>Integrate the API</li>
            </ul>
          </div>
          <div className="hp-dash__action-card">
            <div className="hp-dash__action-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h4 className="hp-dash__action-title">Accept Payments</h4>
            <p className="hp-dash__action-desc">Learn how to process payments through the MTRX Pay platform.</p>
            <ul className="hp-dash__guide-steps">
              <li>API integration guide</li>
              <li>Hosted checkout page</li>
              <li>Payment links</li>
              <li>Recurring payments</li>
            </ul>
          </div>
          <div className="hp-dash__action-card">
            <div className="hp-dash__action-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4 className="hp-dash__action-title">Security & Compliance</h4>
            <p className="hp-dash__action-desc">Understand our security measures and compliance requirements.</p>
            <ul className="hp-dash__guide-steps">
              <li>PCI DSS compliance</li>
              <li>Data protection</li>
              <li>Fraud prevention</li>
              <li>Chargeback management</li>
            </ul>
          </div>
          <div className="hp-dash__action-card">
            <div className="hp-dash__action-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h4 className="hp-dash__action-title">API Integration</h4>
            <p className="hp-dash__action-desc">Technical documentation for developers integrating MTRX Pay.</p>
            <ul className="hp-dash__guide-steps">
              <li>Authentication</li>
              <li>API reference</li>
              <li>Webhooks</li>
              <li>SDKs & libraries</li>
            </ul>
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeTab === 'faq' && (
        <section>
          <div className="hp-dash__filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`hp-dash__pill${selectedCategory === cat ? ' hp-dash__pill--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
          <div className="hp-dash__faq-list">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className={`hp-dash__faq-item${expandedFaq === i ? ' hp-dash__faq-item--open' : ''}`}>
                <button className="hp-dash__faq-question" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                  <span>{faq.question}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={expandedFaq === i ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                  </svg>
                </button>
                {expandedFaq === i && (
                  <div className="hp-dash__faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* API */}
      {activeTab === 'api' && (
        <section>
          <div className="hp-dash__api-header">
            <div>
              <h3 className="hp-dash__api-title">Developer API</h3>
              <p className="hp-dash__text-muted">Integrate MTRX Pay into your application with our RESTful API.</p>
            </div>
            <div className="hp-dash__api-keys">
              <div className="hp-dash__api-key-box">
                <span className="hp-dash__metric-label">API Key</span>
                <code>pk_live_****************************</code>
                <button className="hp-dash__btn-outline hp-dash__btn-sm">Copy</button>
              </div>
              <div className="hp-dash__api-key-box">
                <span className="hp-dash__metric-label">Secret Key</span>
                <code>sk_live_****************************</code>
                <button className="hp-dash__btn-outline hp-dash__btn-sm">Reveal</button>
              </div>
            </div>
          </div>

          <div className="hp-dash__api-base">
            <span className="hp-dash__metric-label">Base URL</span>
            <code>https://api.mtrxpay.io/v1</code>
          </div>

          <span className="hp-dash__section-label" style={{ margin: '24px 0 16px', display: 'inline-flex' }}>Endpoints</span>
          <div className="hp-dash__endpoint-list">
            {apiEndpoints.map((ep, i) => (
              <div key={i} className="hp-dash__endpoint-item">
                <span className={`hp-dash__endpoint-method hp-dash__endpoint-method--${ep.method.toLowerCase()}`}>{ep.method}</span>
                <code className="hp-dash__endpoint-path">{ep.path}</code>
                <span className="hp-dash__text-muted">{ep.description}</span>
              </div>
            ))}
          </div>

          <div className="hp-dash__api-footer">
            <button className="hp-dash__btn-outline">View Full Documentation</button>
            <button className="hp-dash__btn-outline">Download SDK</button>
          </div>
        </section>
      )}

      {/* Support Card */}
      <div className="hp-dash__support-card">
        <div className="hp-dash__support-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>Need more help?</h3>
          <p className="hp-dash__text-muted" style={{ margin: 0 }}>Our support team is available 24/7 to assist you.</p>
        </div>
        <button className="hp-dash__btn-gold">Contact Support</button>
      </div>
    </DashboardLayout>
  );
}
