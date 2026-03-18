import { Card, Badge } from '@mtrx/ui';

interface Settlement {
  id: string;
  merchant: string;
  amount: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'held' | 'failed';
  escrowRelease: string;
  initiatedDate: string;
  expectedDate: string;
  method: string;
}

const mockSettlements: Settlement[] = [
  { id: 'STL-4821', merchant: 'BetKing International', amount: '£124,500.00', currency: 'GBP', status: 'processing', escrowRelease: '2026-03-19 14:00', initiatedDate: '2026-03-16', expectedDate: '2026-03-19', method: 'BACS' },
  { id: 'STL-4820', merchant: 'TradeFX Pro', amount: '€89,200.00', currency: 'EUR', status: 'pending', escrowRelease: '2026-03-20 09:00', initiatedDate: '2026-03-17', expectedDate: '2026-03-20', method: 'SEPA' },
  { id: 'STL-4819', merchant: 'CloudRetail UK', amount: '£12,340.00', currency: 'GBP', status: 'completed', escrowRelease: '2026-03-17 10:00', initiatedDate: '2026-03-14', expectedDate: '2026-03-17', method: 'Faster Payments' },
  { id: 'STL-4818', merchant: 'Web3 Payments AG', amount: '£45,000.00', currency: 'GBP', status: 'held', escrowRelease: 'Under investigation', initiatedDate: '2026-03-13', expectedDate: 'TBD', method: 'BACS' },
  { id: 'STL-4817', merchant: 'LuxTravel Group', amount: '$78,400.00', currency: 'USD', status: 'completed', escrowRelease: '2026-03-16 16:00', initiatedDate: '2026-03-13', expectedDate: '2026-03-16', method: 'Wire Transfer' },
];

const statusVariant = (s: string) =>
  s === 'completed' ? 'success' as const :
  s === 'failed' || s === 'held' ? 'danger' as const :
  s === 'processing' ? 'info' as const :
  'warning' as const;

export function SettlementsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Settlements</h1>
          <p className="admin-page__subtitle">72-hour escrow management, settlement batches, and payout processing</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Release Batch</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Process Payouts</button>
        </div>
      </div>

      <div className="admin-stats admin-stats--compact">
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">In Escrow</span>
          <span className="admin-stat-card__value">£890,420</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Ready to Release</span>
          <span className="admin-stat-card__value">£234,100</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Held / Frozen</span>
          <span className="admin-stat-card__value admin-text--danger">£57,800</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Settled Today</span>
          <span className="admin-stat-card__value">£1.2M</span>
        </div>
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>Settlement ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Escrow Release</th>
                <th>Initiated</th>
                <th>Expected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockSettlements.map(s => (
                <tr key={s.id} className="mtrx-table__row--clickable">
                  <td className="admin-mono">{s.id}</td>
                  <td><strong>{s.merchant}</strong></td>
                  <td>{s.amount}</td>
                  <td>{s.method}</td>
                  <td className={s.status === 'held' ? 'admin-text--danger' : ''}>{s.escrowRelease}</td>
                  <td>{s.initiatedDate}</td>
                  <td>{s.expectedDate}</td>
                  <td><Badge variant={statusVariant(s.status)}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
