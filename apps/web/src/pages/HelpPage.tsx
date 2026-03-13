import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I complete my merchant verification?',
    answer: 'To complete verification, navigate to the Compliance Centre and upload all required documents. This typically includes proof of identity, business registration documents, and bank statements. Our team will review your submission within 48 hours.'
  },
  {
    category: 'Getting Started',
    question: 'What documents do I need to get started?',
    answer: 'You will need: Certificate of Incorporation, Proof of Business Address, Director ID documents, Bank Statement (last 3 months), and depending on your industry, additional compliance documents may be required.'
  },
  {
    category: 'Payments',
    question: 'How long does it take for payments to clear?',
    answer: 'Payments are subject to a 72-hour escrow period for security purposes. After this period, funds are released to your available balance and can be paid out according to your payout schedule.'
  },
  {
    category: 'Payments',
    question: 'What currencies do you support?',
    answer: 'MTRX Pay currently supports GBP, EUR, USD, and AED. We are continuously expanding our currency support. Contact us if you need a specific currency for your business.'
  },
  {
    category: 'Payouts',
    question: 'How often can I receive payouts?',
    answer: 'You can configure your payout schedule in the Payout Settings. Options include Daily, Weekly, Bi-Weekly, or Monthly payouts. Changes take effect from the next payout cycle.'
  },
  {
    category: 'Payouts',
    question: 'What are the payout fees?',
    answer: 'Payout fees vary by plan. Starter plan includes standard bank transfer fees, while Growth and Enterprise plans may have reduced or waived fees. Check your subscription details for specific rates.'
  },
  {
    category: 'Security',
    question: 'How is my data protected?',
    answer: 'MTRX Pay uses bank-grade encryption (AES-256) for all data at rest and in transit. We are PCI DSS Level 1 compliant and undergo regular security audits. Your funds are held in segregated accounts with tier-1 banking partners.'
  },
  {
    category: 'Chargebacks',
    question: 'How do I respond to a chargeback?',
    answer: 'When a chargeback is raised, you will receive an alert in your dashboard and via email. Navigate to the transaction details to submit evidence. You typically have 7-14 days to respond depending on the card network.'
  },
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'guides' | 'faq' | 'api'>('guides');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-back" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Dashboard</span>
          </div>
          <img src="/logo.png" alt="MTRX Pay" className="dashboard-logo-img" />
        </header>

        <h1 className="page-title">Help & Documentation</h1>

        {/* Tabs */}
        <div className="compliance-tabs">
          <button
            className={`tab-btn ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            Quick Guides
          </button>
          <button
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
          <button
            className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            Developer API
          </button>
        </div>

        {/* Quick Guides Tab */}
        {activeTab === 'guides' && (
          <div className="help-section">
            <div className="guides-grid">
              <div className="guide-card">
                <div className="guide-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Getting Started</h3>
                <p>Complete your account setup and start accepting payments in minutes.</p>
                <ul className="guide-steps">
                  <li>Complete KYC/KYB verification</li>
                  <li>Add your bank account</li>
                  <li>Configure payout schedule</li>
                  <li>Integrate the API</li>
                </ul>
              </div>

              <div className="guide-card">
                <div className="guide-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <h3>Accept Payments</h3>
                <p>Learn how to process payments through the MTRX Pay platform.</p>
                <ul className="guide-steps">
                  <li>API integration guide</li>
                  <li>Hosted checkout page</li>
                  <li>Payment links</li>
                  <li>Recurring payments</li>
                </ul>
              </div>

              <div className="guide-card">
                <div className="guide-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3>Security & Compliance</h3>
                <p>Understand our security measures and compliance requirements.</p>
                <ul className="guide-steps">
                  <li>PCI DSS compliance</li>
                  <li>Data protection</li>
                  <li>Fraud prevention</li>
                  <li>Chargeback management</li>
                </ul>
              </div>

              <div className="guide-card">
                <div className="guide-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h3>API Integration</h3>
                <p>Technical documentation for developers integrating MTRX Pay.</p>
                <ul className="guide-steps">
                  <li>Authentication</li>
                  <li>API reference</li>
                  <li>Webhooks</li>
                  <li>SDKs & libraries</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="help-section">
            <div className="faq-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
            <div className="faq-list">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points={expandedFaq === index ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
                    </svg>
                  </button>
                  {expandedFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div className="help-section">
            <div className="api-header">
              <div className="api-info">
                <h3>Developer API</h3>
                <p>Integrate MTRX Pay into your application with our RESTful API.</p>
              </div>
              <div className="api-keys">
                <div className="api-key-box">
                  <span className="key-label">API Key</span>
                  <code>pk_live_****************************</code>
                  <button className="copy-btn">Copy</button>
                </div>
                <div className="api-key-box">
                  <span className="key-label">Secret Key</span>
                  <code>sk_live_****************************</code>
                  <button className="copy-btn">Reveal</button>
                </div>
              </div>
            </div>

            <div className="api-base-url">
              <span className="base-label">Base URL</span>
              <code>https://api.mtrxpay.io/v1</code>
            </div>

            <h4 className="api-section-title">Endpoints</h4>
            <div className="api-endpoints">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="endpoint-item">
                  <span className={`endpoint-method ${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <code className="endpoint-path">{endpoint.path}</code>
                  <span className="endpoint-desc">{endpoint.description}</span>
                </div>
              ))}
            </div>

            <div className="api-footer">
              <Button variant="secondary">
                View Full Documentation
              </Button>
              <Button variant="secondary">
                Download SDK
              </Button>
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className="support-card">
          <div className="support-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div className="support-info">
            <h3>Need more help?</h3>
            <p>Our support team is available 24/7 to assist you with any questions.</p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
