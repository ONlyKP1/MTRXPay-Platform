import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

interface Dispute {
  id: string;
  merchant: string;
  transactionId: string;
  amount: string;
  reason: string;
  cardScheme: string;
  deadline: string;
  deadlineUrgent: boolean;
  status: 'open' | 'evidence_due' | 'under_review' | 'won' | 'lost';
  filed: string;
}

const mockDisputes: Dispute[] = [
  { id: 'DSP-042', merchant: 'BetKing International', transactionId: 'TXN-47891', amount: '£2,340', reason: 'Friendly fraud — customer denies transaction', cardScheme: 'Visa', deadline: '22 hours', deadlineUrgent: true, status: 'evidence_due', filed: '2026-03-16' },
  { id: 'DSP-041', merchant: 'Web3 Payments AG', transactionId: 'TXN-47820', amount: '£890', reason: 'Product not received', cardScheme: 'Mastercard', deadline: '3 days', deadlineUrgent: false, status: 'open', filed: '2026-03-15' },
  { id: 'DSP-040', merchant: 'TradeFX Pro', transactionId: 'TXN-47765', amount: '£5,100', reason: 'Unauthorised transaction', cardScheme: 'Visa', deadline: '5 days', deadlineUrgent: false, status: 'under_review', filed: '2026-03-14' },
  { id: 'DSP-039', merchant: 'VapeWorld Direct', transactionId: 'TXN-47701', amount: '£420', reason: 'Duplicate charge', cardScheme: 'Mastercard', deadline: '8 hours', deadlineUrgent: true, status: 'evidence_due', filed: '2026-03-13' },
  { id: 'DSP-038', merchant: 'CloudRetail UK', transactionId: 'TXN-47650', amount: '£149.99', reason: 'Product not as described', cardScheme: 'Visa', deadline: 'Closed', deadlineUrgent: false, status: 'won', filed: '2026-03-10' },
  { id: 'DSP-037', merchant: 'LuxTravel Group', transactionId: 'TXN-47590', amount: '£3,200', reason: 'Service not provided — flight cancelled', cardScheme: 'Amex', deadline: 'Closed', deadlineUrgent: false, status: 'lost', filed: '2026-03-08' },
  { id: 'DSP-036', merchant: 'BetKing International', transactionId: 'TXN-47520', amount: '£1,800', reason: 'Friendly fraud — customer denies transaction', cardScheme: 'Visa', deadline: 'Closed', deadlineUrgent: false, status: 'won', filed: '2026-03-05' },
];

const statusVariant = (s: string) =>
  s === 'won' ? 'success' as const :
  s === 'lost' ? 'danger' as const :
  s === 'evidence_due' ? 'warning' as const :
  s === 'under_review' ? 'info' as const :
  'danger' as const;

const statusLabel: Record<string, string> = {
  open: 'Open',
  evidence_due: 'Evidence Due',
  under_review: 'Under Review',
  won: 'Won',
  lost: 'Lost',
};

type Filter = 'all' | 'open' | 'evidence_due' | 'under_review' | 'won' | 'lost';

export function DisputesPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = filter === 'all' ? mockDisputes : mockDisputes.filter(d => d.status === filter);

  const active = mockDisputes.filter(d => !['won', 'lost'].includes(d.status));
  const totalAtRisk = active.reduce((sum, d) => sum + parseFloat(d.amount.replace(/[£,]/g, '')), 0);
  const urgentCount = mockDisputes.filter(d => d.deadlineUrgent).length;
  const wonCount = mockDisputes.filter(d => d.status === 'won').length;
  const totalClosed = mockDisputes.filter(d => ['won', 'lost'].includes(d.status)).length;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Disputes & Chargebacks</h1>
          <p className="admin-page__subtitle">Manage incoming disputes, build evidence packs, and track outcomes</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Export</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Analytics</button>
        </div>
      </div>

      <div className="admin-stats admin-stats--compact">
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Active Disputes</span>
          <span className="admin-stat-card__value">{active.length}</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Value at Risk</span>
          <span className="admin-stat-card__value admin-text--danger">£{totalAtRisk.toLocaleString()}</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Deadline &lt;24h</span>
          <span className="admin-stat-card__value admin-text--danger">{urgentCount}</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Win Rate</span>
          <span className="admin-stat-card__value">{totalClosed ? Math.round((wonCount / totalClosed) * 100) : 0}%</span>
        </div>
      </div>

      <div className="admin-filters">
        {(['all', 'open', 'evidence_due', 'under_review', 'won', 'lost'] as Filter[]).map(f => (
          <button key={f} className={`admin-filter-btn${filter === f ? ' admin-filter-btn--active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : statusLabel[f]}
            <span className="admin-filter-btn__count">
              {f === 'all' ? mockDisputes.length : mockDisputes.filter(d => d.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead><tr><th>Dispute ID</th><th>Merchant</th><th>Transaction</th><th>Amount</th><th>Reason</th><th>Scheme</th><th>Deadline</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className={`mtrx-table__row--clickable ${d.deadlineUrgent ? 'admin-row--critical' : ''}`}>
                  <td className="admin-mono">{d.id}</td>
                  <td><strong>{d.merchant}</strong></td>
                  <td className="admin-mono">{d.transactionId}</td>
                  <td>{d.amount}</td>
                  <td className="admin-desc-cell">{d.reason}</td>
                  <td>{d.cardScheme}</td>
                  <td className={d.deadlineUrgent ? 'admin-text--danger' : 'admin-muted'}><strong>{d.deadline}</strong></td>
                  <td><Badge variant={statusVariant(d.status)}>{statusLabel[d.status]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
