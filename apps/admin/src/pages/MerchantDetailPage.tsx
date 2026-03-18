import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Badge } from '@mtrx/ui';

interface Merchant {
  id: string;
  name: string;
  industry: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  status: 'active' | 'suspended' | 'under_review' | 'churned';
  monthlyVolume: string;
  trustScore: number;
  chargebackRate: string;
  joinDate: string;
  lastActivity: string;
  registrationNumber: string;
  address: string;
  director: string;
  email: string;
  phone: string;
  website: string;
  mdr: string;
  txnFee: string;
  dailyLimit: string;
  monthlyLimit: string;
  currencies: string[];
  apiKey: string;
  webhookUrl: string;
}

const merchants: Record<string, Merchant> = {
  'MRC-1001': { id: 'MRC-1001', name: 'TradeFX Pro', industry: 'Forex & Trading', tier: 'Gold', status: 'active', monthlyVolume: '£1.8M', trustScore: 92, chargebackRate: '0.12%', joinDate: '2025-08-14', lastActivity: '2 min ago', registrationNumber: 'CY-384729', address: '42 Makarios Avenue, Nicosia, Cyprus', director: 'Andreas Stavrou', email: 'ops@tradefxpro.com', phone: '+357 22 123456', website: 'tradefxpro.com', mdr: '4.2%', txnFee: '£0.30', dailyLimit: '£500,000', monthlyLimit: '£5,000,000', currencies: ['GBP', 'EUR', 'USD'], apiKey: 'sk_live_****...a3f2', webhookUrl: 'https://api.tradefxpro.com/webhooks/mtrx' },
  'MRC-1002': { id: 'MRC-1002', name: 'BetKing International', industry: 'Gaming & iGaming', tier: 'Platinum', status: 'active', monthlyVolume: '£4.2M', trustScore: 88, chargebackRate: '0.45%', joinDate: '2025-06-01', lastActivity: '5 min ago', registrationNumber: 'MT-119284', address: '18 Republic Street, Valletta, Malta', director: 'Marco Borg', email: 'finance@betking.mt', phone: '+356 21 234567', website: 'betking.mt', mdr: '5.8%', txnFee: '£0.25', dailyLimit: '£1,000,000', monthlyLimit: '£15,000,000', currencies: ['GBP', 'EUR', 'USD', 'AED'], apiKey: 'sk_live_****...b7e1', webhookUrl: 'https://api.betking.mt/payments/webhook' },
  'MRC-1003': { id: 'MRC-1003', name: 'CloudRetail UK', industry: 'E-commerce & Retail', tier: 'Silver', status: 'active', monthlyVolume: '£95K', trustScore: 96, chargebackRate: '0.08%', joinDate: '2025-11-20', lastActivity: '1 hr ago', registrationNumber: 'GB-12847362', address: '71-75 Shelton Street, London WC2H 9JQ', director: 'Emma Richards', email: 'payments@cloudretail.co.uk', phone: '+44 20 7123 4567', website: 'cloudretail.co.uk', mdr: '2.4%', txnFee: '£0.20', dailyLimit: '£50,000', monthlyLimit: '£500,000', currencies: ['GBP'], apiKey: 'sk_live_****...c9d4', webhookUrl: 'https://cloudretail.co.uk/api/mtrx' },
  'MRC-1004': { id: 'MRC-1004', name: 'VapeWorld Direct', industry: 'CBD & Cannabis', tier: 'Bronze', status: 'suspended', monthlyVolume: '£0', trustScore: 34, chargebackRate: '3.2%', joinDate: '2025-09-10', lastActivity: '14 days ago', registrationNumber: 'GB-99128374', address: '5 Canal Street, Manchester M1 3HE', director: 'Jake Morrison', email: 'admin@vapeworld.direct', phone: '+44 161 234 5678', website: 'vapeworld.direct', mdr: '6.5%', txnFee: '£0.35', dailyLimit: '£0', monthlyLimit: '£0', currencies: ['GBP'], apiKey: 'sk_live_****...d2a8 (REVOKED)', webhookUrl: 'https://vapeworld.direct/webhook' },
  'MRC-1005': { id: 'MRC-1005', name: 'LuxTravel Group', industry: 'Travel & Tourism', tier: 'Gold', status: 'active', monthlyVolume: '£680K', trustScore: 91, chargebackRate: '0.15%', joinDate: '2025-07-22', lastActivity: '30 min ago', registrationNumber: 'AE-82947', address: 'IFZA Business Park, DDP, Dubai', director: 'Khalid Al-Rashid', email: 'treasury@luxtravel.ae', phone: '+971 4 123 4567', website: 'luxtravel.ae', mdr: '3.8%', txnFee: '£0.28', dailyLimit: '£250,000', monthlyLimit: '£3,000,000', currencies: ['GBP', 'USD', 'AED', 'EUR'], apiKey: 'sk_live_****...e5b3', webhookUrl: 'https://api.luxtravel.ae/mtrx/events' },
  'MRC-1006': { id: 'MRC-1006', name: 'Web3 Payments AG', industry: 'Cryptocurrency & Web3', tier: 'Silver', status: 'under_review', monthlyVolume: '£320K', trustScore: 67, chargebackRate: '0.89%', joinDate: '2025-12-01', lastActivity: '3 hrs ago', registrationNumber: 'CH-294817', address: 'Bahnhofstrasse 12, Zurich, Switzerland', director: 'Lukas Meier', email: 'compliance@web3pay.ch', phone: '+41 44 123 4567', website: 'web3pay.ch', mdr: '5.2%', txnFee: '£0.30', dailyLimit: '£200,000', monthlyLimit: '£2,000,000', currencies: ['GBP', 'EUR', 'USD'], apiKey: 'sk_live_****...f1c7', webhookUrl: 'https://web3pay.ch/hooks/mtrx' },
};

const tierClass = (t: string) =>
  t === 'Platinum' ? 'admin-tier--platinum' :
  t === 'Gold' ? 'admin-tier--gold' :
  t === 'Silver' ? 'admin-tier--silver' : 'admin-tier--bronze';

const trustColor = (score: number) =>
  score >= 80 ? 'admin-trust--high' :
  score >= 50 ? 'admin-trust--mid' : 'admin-trust--low';

const statusVariant = (s: string) =>
  s === 'active' ? 'success' as const :
  s === 'suspended' ? 'danger' as const :
  s === 'under_review' ? 'warning' as const :
  'default' as const;

const mockDocuments = [
  { name: 'Certificate of Incorporation', uploaded: '2025-08-10', status: 'verified' },
  { name: 'Director ID — Passport', uploaded: '2025-08-10', status: 'verified' },
  { name: 'Proof of Address — Utility Bill', uploaded: '2025-08-11', status: 'verified' },
  { name: 'Bank Statement (3 months)', uploaded: '2025-08-12', status: 'verified' },
  { name: 'Processing History Statement', uploaded: '2025-08-12', status: 'pending' },
  { name: 'AML Policy Document', uploaded: '2025-08-14', status: 'under_review' },
];

const mockTransactions = [
  { id: 'TXN-48291', amount: '£12,450.00', type: 'payment', method: 'Visa Debit', status: 'completed', timestamp: '2026-03-18 14:22' },
  { id: 'TXN-48245', amount: '£8,200.00', type: 'payment', method: 'Bank Transfer', status: 'completed', timestamp: '2026-03-17 11:40' },
  { id: 'TXN-48201', amount: '£3,100.00', type: 'refund', method: 'Visa Debit', status: 'completed', timestamp: '2026-03-16 09:15' },
  { id: 'TXN-48190', amount: '£22,000.00', type: 'payment', method: 'Mastercard', status: 'in_escrow', timestamp: '2026-03-15 16:30' },
  { id: 'TXN-48102', amount: '£950.00', type: 'chargeback', method: 'Visa Credit', status: 'disputed', timestamp: '2026-03-14 13:22' },
];

const mockTimeline = [
  { time: '2026-03-18 14:22', actor: 'System', event: 'Transaction processed', detail: '£12,450 via Visa Debit — escrow hold applied' },
  { time: '2026-03-15 10:00', actor: 'James M.', event: 'Note added', detail: 'Merchant requested increase to daily processing limit. Pending compliance review.' },
  { time: '2026-03-10 09:30', actor: 'System', event: 'Tier upgraded', detail: 'Silver → Gold — based on 6-month volume and trust score' },
  { time: '2026-03-01 08:00', actor: 'System', event: 'Monthly settlement', detail: 'February settlement — £1.64M processed, £68,880 in fees collected' },
  { time: '2025-12-15 11:00', actor: 'Sarah K.', event: 'KYB review completed', detail: 'All documents verified. Merchant approved for live processing.' },
  { time: '2025-08-14 09:00', actor: 'System', event: 'Account created', detail: 'Application approved. Onboarding completed.' },
];

type Tab = 'overview' | 'transactions' | 'documents' | 'config' | 'notes';

export function MerchantDetailPage() {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const m = merchants[merchantId || ''];

  if (!m) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Merchant Not Found</h1>
            <p className="admin-page__subtitle">
              <Link to="/merchants">← Back to Merchants</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="admin-page__subtitle" style={{ marginBottom: 8 }}>
            <Link to="/merchants">← Merchants</Link> / {m.id}
          </p>
          <h1 className="admin-page__title">{m.name}</h1>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
            <span className={`admin-tier ${tierClass(m.tier)}`}>{m.tier}</span>
            <Badge variant={statusVariant(m.status)}>{m.status.replace('_', ' ')}</Badge>
            <span className="admin-muted">{m.industry}</span>
          </div>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm" onClick={() => navigate('/communications')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Message
          </button>
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Suspend</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Edit Merchant</button>
        </div>
      </div>

      <div className="admin-filters">
        {(['overview', 'transactions', 'documents', 'config', 'notes'] as Tab[]).map(t => (
          <button
            key={t}
            className={`admin-filter-btn${tab === t ? ' admin-filter-btn--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'config' ? 'Configuration' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">Monthly Volume</span>
              <span className="admin-stat-card__value">{m.monthlyVolume}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">Trust Score</span>
              <span className="admin-stat-card__value">
                <span className={trustColor(m.trustScore)}>{m.trustScore}</span>/100
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">Chargeback Rate</span>
              <span className="admin-stat-card__value">{m.chargebackRate}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">Member Since</span>
              <span className="admin-stat-card__value">{m.joinDate}</span>
            </div>
          </div>
          <div className="admin-grid-2">
            <Card title="Business Information">
              <div className="admin-detail-rows">
                <div className="admin-detail-row"><span>Legal Name</span><strong>{m.name}</strong></div>
                <div className="admin-detail-row"><span>Registration</span><span className="admin-mono">{m.registrationNumber}</span></div>
                <div className="admin-detail-row"><span>Director</span><span>{m.director}</span></div>
                <div className="admin-detail-row"><span>Address</span><span>{m.address}</span></div>
                <div className="admin-detail-row"><span>Email</span><span>{m.email}</span></div>
                <div className="admin-detail-row"><span>Phone</span><span>{m.phone}</span></div>
                <div className="admin-detail-row"><span>Website</span><span>{m.website}</span></div>
              </div>
            </Card>
            <Card title="Processing Summary">
              <div className="admin-detail-rows">
                <div className="admin-detail-row"><span>MDR</span><strong>{m.mdr}</strong></div>
                <div className="admin-detail-row"><span>Transaction Fee</span><span>{m.txnFee}</span></div>
                <div className="admin-detail-row"><span>Daily Limit</span><span>{m.dailyLimit}</span></div>
                <div className="admin-detail-row"><span>Monthly Limit</span><span>{m.monthlyLimit}</span></div>
                <div className="admin-detail-row"><span>Currencies</span><span>{m.currencies.join(', ')}</span></div>
                <div className="admin-detail-row"><span>Last Active</span><span>{m.lastActivity}</span></div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 'transactions' && (
        <Card padding="none">
          <div className="mtrx-table-wrap">
            <table className="mtrx-table">
              <thead><tr><th>Transaction ID</th><th>Amount</th><th>Type</th><th>Method</th><th>Timestamp</th><th>Status</th></tr></thead>
              <tbody>
                {mockTransactions.map(t => (
                  <tr key={t.id}>
                    <td className="admin-mono">{t.id}</td>
                    <td>{t.amount}</td>
                    <td><Badge variant={t.type === 'chargeback' ? 'danger' : t.type === 'refund' ? 'warning' : 'default'}>{t.type}</Badge></td>
                    <td>{t.method}</td>
                    <td className="admin-muted">{t.timestamp}</td>
                    <td><Badge variant={t.status === 'completed' ? 'success' : t.status === 'disputed' ? 'danger' : 'warning'}>{t.status.replace('_', ' ')}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'documents' && (
        <Card padding="none">
          <div className="mtrx-table-wrap">
            <table className="mtrx-table">
              <thead><tr><th>Document</th><th>Uploaded</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {mockDocuments.map(d => (
                  <tr key={d.name}>
                    <td><strong>{d.name}</strong></td>
                    <td className="admin-muted">{d.uploaded}</td>
                    <td><Badge variant={d.status === 'verified' ? 'success' : d.status === 'pending' ? 'warning' : 'info'}>{d.status.replace('_', ' ')}</Badge></td>
                    <td><button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'config' && (
        <div className="admin-grid-2">
          <Card title="Fee Settings">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>MDR (Merchant Discount Rate)</span><strong>{m.mdr}</strong></div>
              <div className="admin-detail-row"><span>Per-Transaction Fee</span><span>{m.txnFee}</span></div>
              <div className="admin-detail-row"><span>Chargeback Fee</span><span>£15.00</span></div>
              <div className="admin-detail-row"><span>Monthly Minimum</span><span>£0 (waived)</span></div>
            </div>
          </Card>
          <Card title="Processing Limits">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>Daily Limit</span><strong>{m.dailyLimit}</strong></div>
              <div className="admin-detail-row"><span>Monthly Limit</span><span>{m.monthlyLimit}</span></div>
              <div className="admin-detail-row"><span>Single Transaction Max</span><span>£50,000</span></div>
              <div className="admin-detail-row"><span>Escrow Period</span><span>72 hours</span></div>
            </div>
          </Card>
          <Card title="API & Integration">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>API Key (Live)</span><span className="admin-mono">{m.apiKey}</span></div>
              <div className="admin-detail-row"><span>API Key (Test)</span><span className="admin-mono">sk_test_****...x8m2</span></div>
              <div className="admin-detail-row"><span>Webhook URL</span><span className="admin-mono" style={{ fontSize: '0.72rem' }}>{m.webhookUrl}</span></div>
              <div className="admin-detail-row"><span>Webhook Status</span><Badge variant="success">active</Badge></div>
            </div>
          </Card>
          <Card title="Enabled Currencies">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['GBP', 'EUR', 'USD', 'AED'].map(c => (
                <span key={c} className={`mtrx-badge ${m.currencies.includes(c) ? 'mtrx-badge--success' : 'mtrx-badge--default'}`}>
                  {c} {m.currencies.includes(c) ? '✓' : '—'}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'notes' && (
        <Card title="Activity Timeline">
          <div className="admin-activity">
            {mockTimeline.map((e, i) => (
              <div key={i} className="admin-activity__item">
                <div className="admin-activity__time">{e.time}</div>
                <div className="admin-activity__body">
                  <span className="admin-activity__event"><strong>{e.actor}</strong> — {e.event}</span>
                  <span className="admin-activity__detail">{e.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
