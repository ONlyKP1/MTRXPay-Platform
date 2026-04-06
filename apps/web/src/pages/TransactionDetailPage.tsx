import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatusBadge } from '../components/common/StatusBadge';

type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';
const currencyLocales: Record<Currency, string> = { GBP: 'en-GB', EUR: 'de-DE', USD: 'en-US', AED: 'ar-AE' };

const mockTransactions: Record<string, {
  id: string; date: string; time: string; amount: number; currency: Currency;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'payout' | 'refund' | 'chargeback';
  customer: string; email: string; reference: string;
  method: string; cardLast4: string; riskScore: number; ip: string;
  fees: number; net: number; settlementDate: string; description: string;
  metadata: { key: string; value: string }[];
  timeline: { time: string; event: string; status: string }[];
}> = {
  'TXN-001': {
    id: 'TXN-001', date: '2026-03-14', time: '14:32:18', amount: 1_475.00, currency: 'GBP',
    status: 'completed', type: 'payment', customer: 'John Smith', email: 'j.smith@acme.co.uk',
    reference: 'ORD-2026-001', method: 'Visa', cardLast4: '4242', riskScore: 12,
    ip: '192.168.1.45', fees: 36.88, net: 1_438.12, settlementDate: '2026-03-17',
    description: 'Premium subscription - Annual plan',
    metadata: [
      { key: 'Plan', value: 'Enterprise Annual' },
      { key: 'Customer ID', value: 'CUS-00482' },
      { key: 'Invoice', value: 'INV-2026-0142' },
    ],
    timeline: [
      { time: '14:32:18', event: 'Payment initiated', status: 'info' },
      { time: '14:32:19', event: '3DS authentication passed', status: 'success' },
      { time: '14:32:21', event: 'Payment authorised by Visa', status: 'success' },
      { time: '14:32:22', event: 'Payment captured', status: 'success' },
      { time: '14:32:22', event: 'Settlement scheduled for 17 Mar', status: 'info' },
    ],
  },
  'TXN-002': {
    id: 'TXN-002', date: '2026-03-14', time: '12:15:44', amount: 890.50, currency: 'GBP',
    status: 'completed', type: 'payment', customer: 'Emma Wilson', email: 'emma.w@barlow.io',
    reference: 'ORD-2026-002', method: 'Mastercard', cardLast4: '8910', riskScore: 8,
    ip: '10.0.0.22', fees: 22.26, net: 868.24, settlementDate: '2026-03-17',
    description: 'Monthly subscription renewal',
    metadata: [
      { key: 'Plan', value: 'Professional Monthly' },
      { key: 'Customer ID', value: 'CUS-00291' },
    ],
    timeline: [
      { time: '12:15:44', event: 'Payment initiated', status: 'info' },
      { time: '12:15:46', event: 'Payment authorised by Mastercard', status: 'success' },
      { time: '12:15:47', event: 'Payment captured', status: 'success' },
    ],
  },
  'TXN-003': {
    id: 'TXN-003', date: '2026-03-13', time: '16:45:02', amount: 2_100.00, currency: 'EUR',
    status: 'pending', type: 'payment', customer: 'Hans Mueller', email: 'h.mueller@dach.de',
    reference: 'ORD-2026-003', method: 'SEPA', cardLast4: '-', riskScore: 22,
    ip: '85.214.132.10', fees: 52.50, net: 2_047.50, settlementDate: '-',
    description: 'Enterprise setup fee',
    metadata: [
      { key: 'Plan', value: 'Enterprise' },
      { key: 'Region', value: 'DACH' },
    ],
    timeline: [
      { time: '16:45:02', event: 'Payment initiated via SEPA', status: 'info' },
      { time: '16:45:03', event: 'Awaiting bank confirmation', status: 'pending' },
    ],
  },
};

// Fallback for any txn ID not in mock
const fallbackTxn = {
  id: 'TXN-000', date: '2026-03-14', time: '00:00:00', amount: 0, currency: 'GBP' as Currency,
  status: 'pending' as const, type: 'payment' as const, customer: 'Unknown', email: '-',
  reference: '-', method: '-', cardLast4: '-', riskScore: 0, ip: '-', fees: 0, net: 0,
  settlementDate: '-', description: '-', metadata: [], timeline: [],
};

const formatDate = (iso: string) => {
  if (!iso || iso === '-') return '-';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const txn = mockTransactions[id || ''] || { ...fallbackTxn, id: id || 'TXN-000' };

  const formatCurrency = (amount: number, currency: Currency = txn.currency) => {
    return new Intl.NumberFormat(currencyLocales[currency], {
      style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(amount);
  };

  const statusMap: Record<string, 'completed' | 'pending' | 'failed'> = {
    completed: 'completed', pending: 'pending', failed: 'failed', refunded: 'failed',
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="hp-txn-detail__breadcrumb">
        <Link to="/transactions">Transactions</Link>
        <span className="hp-txn-detail__breadcrumb-sep">/</span>
        <span>{txn.id}</span>
      </nav>

      {/* Header */}
      <header className="hp-txn-detail__header">
        <div className="hp-txn-detail__header-left">
          <button className="hp-txn-detail__back" onClick={() => navigate('/transactions')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <div>
            <div className="hp-txn-detail__id-row">
              <h1 className="hp-txn-detail__id">{txn.id}</h1>
              <StatusBadge status={statusMap[txn.status] || 'pending'} />
              <span className={`hp-dash__type-badge hp-dash__type-badge--${txn.type}`}>{txn.type}</span>
            </div>
            <p className="hp-txn-detail__desc">{txn.description}</p>
          </div>
        </div>
        <div className="hp-txn-detail__header-right">
          <span className="hp-txn-detail__amount">{formatCurrency(txn.amount)}</span>
          <span className="hp-txn-detail__currency">{txn.currency}</span>
        </div>
      </header>

      {/* Main 2-column layout */}
      <div className="hp-txn-detail__grid">
        {/* Left column */}
        <div className="hp-txn-detail__main">
          {/* Payment Details */}
          <section className="hp-txn-detail__card">
            <h3 className="hp-txn-detail__section-label">Payment Details</h3>
            <div className="hp-txn-detail__details-grid">
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Amount</span>
                <span className="hp-txn-detail__detail-value">{formatCurrency(txn.amount)}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Fees</span>
                <span className="hp-txn-detail__detail-value">{formatCurrency(txn.fees)}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Net Amount</span>
                <span className="hp-txn-detail__detail-value hp-txn-detail__detail-value--bold">{formatCurrency(txn.net)}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Payment Method</span>
                <span className="hp-txn-detail__detail-value">{txn.method} {txn.cardLast4 !== '-' ? `****${txn.cardLast4}` : ''}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Reference</span>
                <span className="hp-txn-detail__detail-value hp-txn-detail__detail-value--mono">{txn.reference}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Settlement Date</span>
                <span className="hp-txn-detail__detail-value">{formatDate(txn.settlementDate)}</span>
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section className="hp-txn-detail__card">
            <h3 className="hp-txn-detail__section-label">Customer</h3>
            <div className="hp-txn-detail__details-grid">
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Name</span>
                <span className="hp-txn-detail__detail-value">{txn.customer}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Email</span>
                <span className="hp-txn-detail__detail-value">{txn.email}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">IP Address</span>
                <span className="hp-txn-detail__detail-value hp-txn-detail__detail-value--mono">{txn.ip}</span>
              </div>
              <div className="hp-txn-detail__detail">
                <span className="hp-txn-detail__detail-label">Risk Score</span>
                <span className={`hp-txn-detail__detail-value ${txn.riskScore < 30 ? 'hp-txn-detail__detail-value--green' : txn.riskScore < 60 ? 'hp-txn-detail__detail-value--gold' : 'hp-txn-detail__detail-value--red'}`}>
                  {txn.riskScore}/100
                </span>
              </div>
            </div>
          </section>

          {/* Metadata */}
          {txn.metadata.length > 0 && (
            <section className="hp-txn-detail__card">
              <h3 className="hp-txn-detail__section-label">Metadata</h3>
              <div className="hp-txn-detail__metadata">
                {txn.metadata.map((m) => (
                  <div key={m.key} className="hp-txn-detail__meta-row">
                    <span className="hp-txn-detail__meta-key">{m.key}</span>
                    <span className="hp-txn-detail__meta-value">{m.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column — Timeline + Actions */}
        <div className="hp-txn-detail__sidebar">
          {/* Timeline */}
          <section className="hp-txn-detail__card">
            <h3 className="hp-txn-detail__section-label">Event Timeline</h3>
            <div className="hp-txn-detail__timeline">
              {txn.timeline.map((evt, i) => (
                <div key={i} className="hp-txn-detail__timeline-item">
                  <div className={`hp-txn-detail__timeline-dot hp-txn-detail__timeline-dot--${evt.status}`} />
                  {i < txn.timeline.length - 1 && <div className="hp-txn-detail__timeline-line" />}
                  <div className="hp-txn-detail__timeline-content">
                    <span className="hp-txn-detail__timeline-event">{evt.event}</span>
                    <span className="hp-txn-detail__timeline-time">{evt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="hp-txn-detail__card">
            <h3 className="hp-txn-detail__section-label">Actions</h3>
            <div className="hp-txn-detail__actions">
              {txn.status === 'completed' && txn.type === 'payment' && (
                <button className="hp-txn-detail__action-btn hp-txn-detail__action-btn--outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                  Issue Refund
                </button>
              )}
              <button className="hp-txn-detail__action-btn hp-txn-detail__action-btn--outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Download Receipt
              </button>
              <button className="hp-txn-detail__action-btn hp-txn-detail__action-btn--outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                Email Receipt
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
