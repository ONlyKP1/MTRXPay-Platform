import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

interface Transaction {
  id: string;
  merchant: string;
  amount: string;
  currency: string;
  type: 'payment' | 'refund' | 'chargeback' | 'payout';
  status: 'completed' | 'pending' | 'failed' | 'disputed' | 'in_escrow';
  paymentMethod: string;
  timestamp: string;
  riskScore: number;
  customerCountry: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-48291', merchant: 'BetKing International', amount: '£12,450.00', currency: 'GBP', type: 'payment', status: 'in_escrow', paymentMethod: 'Visa Debit', timestamp: '2026-03-18 14:22:01', riskScore: 35, customerCountry: 'GB' },
  { id: 'TXN-48290', merchant: 'TradeFX Pro', amount: '€8,200.00', currency: 'EUR', type: 'payment', status: 'completed', paymentMethod: 'Bank Transfer', timestamp: '2026-03-18 14:18:45', riskScore: 12, customerCountry: 'DE' },
  { id: 'TXN-48289', merchant: 'CloudRetail UK', amount: '£149.99', currency: 'GBP', type: 'refund', status: 'completed', paymentMethod: 'Mastercard', timestamp: '2026-03-18 14:15:30', riskScore: 5, customerCountry: 'GB' },
  { id: 'TXN-48288', merchant: 'LuxTravel Group', amount: '$45,200.00', currency: 'USD', type: 'payment', status: 'pending', paymentMethod: 'Amex', timestamp: '2026-03-18 14:12:00', riskScore: 72, customerCountry: 'AE' },
  { id: 'TXN-48287', merchant: 'Web3 Payments AG', amount: '£2,340.00', currency: 'GBP', type: 'chargeback', status: 'disputed', paymentMethod: 'Visa Credit', timestamp: '2026-03-18 13:55:12', riskScore: 85, customerCountry: 'US' },
  { id: 'TXN-48286', merchant: 'GreenLeaf Wellness', amount: '£890.00', currency: 'GBP', type: 'payout', status: 'completed', paymentMethod: 'Bank Transfer', timestamp: '2026-03-18 13:40:00', riskScore: 8, customerCountry: 'GB' },
  { id: 'TXN-48285', merchant: 'BetKing International', amount: '£5,100.00', currency: 'GBP', type: 'payment', status: 'failed', paymentMethod: 'Visa Debit', timestamp: '2026-03-18 13:32:18', riskScore: 62, customerCountry: 'NG' },
];

const statusVariant = (s: string) =>
  s === 'completed' ? 'success' as const :
  s === 'failed' ? 'danger' as const :
  s === 'disputed' ? 'danger' as const :
  s === 'in_escrow' ? 'warning' as const :
  'info' as const;

const typeVariant = (t: string) =>
  t === 'chargeback' ? 'danger' as const :
  t === 'refund' ? 'warning' as const :
  t === 'payout' ? 'info' as const :
  'default' as const;

const riskColor = (score: number) =>
  score >= 70 ? 'admin-risk--high' :
  score >= 40 ? 'admin-risk--mid' : 'admin-risk--low';

type TypeFilter = 'all' | 'payment' | 'refund' | 'chargeback' | 'payout';

export function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const filtered = typeFilter === 'all' ? mockTransactions : mockTransactions.filter(t => t.type === typeFilter);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Transactions</h1>
          <p className="admin-page__subtitle">Real-time transaction monitoring with risk scoring and fraud detection</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Export CSV</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Flag Review</button>
        </div>
      </div>

      <div className="admin-filters">
        {(['all', 'payment', 'refund', 'chargeback', 'payout'] as TypeFilter[]).map(f => (
          <button
            key={f}
            className={`admin-filter-btn${typeFilter === f ? ' admin-filter-btn--active' : ''}`}
            onClick={() => setTypeFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Method</th>
                <th>Risk Score</th>
                <th>Country</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="mtrx-table__row--clickable">
                  <td className="admin-mono">{t.id}</td>
                  <td><strong>{t.merchant}</strong></td>
                  <td>{t.amount}</td>
                  <td><Badge variant={typeVariant(t.type)}>{t.type}</Badge></td>
                  <td>{t.paymentMethod}</td>
                  <td>
                    <div className="admin-risk-cell">
                      <span className={`admin-risk-score ${riskColor(t.riskScore)}`}>{t.riskScore}</span>
                    </div>
                  </td>
                  <td>{t.customerCountry}</td>
                  <td className="admin-muted">{t.timestamp}</td>
                  <td><Badge variant={statusVariant(t.status)}>{t.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
