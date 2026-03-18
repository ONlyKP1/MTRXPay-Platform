import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

const reconcBatches = [
  { id: 'REC-1204', dateRange: '2026-03-17', txnCount: 1842, gross: '£2,412,300', fees: '£108,554', net: '£2,303,746', status: 'matched' },
  { id: 'REC-1203', dateRange: '2026-03-16', txnCount: 1756, gross: '£2,189,400', fees: '£98,523', net: '£2,090,877', status: 'matched' },
  { id: 'REC-1202', dateRange: '2026-03-15', txnCount: 1901, gross: '£2,567,100', fees: '£115,520', net: '£2,451,580', status: 'discrepancy' },
  { id: 'REC-1201', dateRange: '2026-03-14', txnCount: 1654, gross: '£1,987,200', fees: '£89,424', net: '£1,897,776', status: 'matched' },
  { id: 'REC-1200', dateRange: '2026-03-13', txnCount: 1589, gross: '£1,876,500', fees: '£84,443', net: '£1,792,057', status: 'pending' },
];

const refunds = [
  { id: 'RFD-891', originalTxn: 'TXN-48102', merchant: 'CloudRetail UK', amount: '£149.99', reason: 'Customer return', requested: '2026-03-18 09:00', status: 'pending' },
  { id: 'RFD-890', originalTxn: 'TXN-47990', merchant: 'LuxTravel Group', amount: '£3,200.00', reason: 'Flight cancellation', requested: '2026-03-17 14:30', status: 'approved' },
  { id: 'RFD-889', originalTxn: 'TXN-47880', merchant: 'TradeFX Pro', amount: '£450.00', reason: 'Duplicate charge', requested: '2026-03-17 10:15', status: 'processed' },
  { id: 'RFD-888', originalTxn: 'TXN-47750', merchant: 'BetKing International', amount: '£90.00', reason: 'Service credit', requested: '2026-03-16 16:00', status: 'processed' },
  { id: 'RFD-887', originalTxn: 'TXN-47600', merchant: 'Web3 Payments AG', amount: '£12,500.00', reason: 'Compliance hold — refund mandated', requested: '2026-03-15 11:00', status: 'rejected' },
];

const revenueByMerchant = [
  { merchant: 'BetKing International', gross: '£4,210,000', fees: '£244,180', interchange: '£84,200', netMargin: '£159,980', marginPct: '3.8%' },
  { merchant: 'TradeFX Pro', gross: '£1,800,000', fees: '£75,600', interchange: '£36,000', netMargin: '£39,600', marginPct: '2.2%' },
  { merchant: 'LuxTravel Group', gross: '£680,000', fees: '£25,840', interchange: '£13,600', netMargin: '£12,240', marginPct: '1.8%' },
  { merchant: 'Web3 Payments AG', gross: '£320,000', fees: '£16,640', interchange: '£6,400', netMargin: '£10,240', marginPct: '3.2%' },
  { merchant: 'CloudRetail UK', gross: '£95,000', fees: '£2,280', interchange: '£1,900', netMargin: '£380', marginPct: '0.4%' },
];

const statusVariant = (s: string) =>
  s === 'matched' || s === 'processed' ? 'success' as const :
  s === 'discrepancy' || s === 'rejected' ? 'danger' as const :
  s === 'approved' ? 'info' as const :
  'warning' as const;

type Tab = 'overview' | 'refunds' | 'revenue';

export function ReconciliationPage() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Financial Reconciliation</h1>
          <p className="admin-page__subtitle">Transaction matching, refund processing, and revenue tracking</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Run Reconciliation</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Export Financials</button>
        </div>
      </div>

      <div className="admin-filters">
        {([['overview', 'Reconciliation'], ['refunds', 'Refund Management'], ['revenue', 'Revenue & Margin']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} className={`admin-filter-btn${tab === key ? ' admin-filter-btn--active' : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="admin-stats admin-stats--compact">
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Total Processed (MTD)</span>
              <span className="admin-stat-card__value">£11.03M</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Reconciled</span>
              <span className="admin-stat-card__value">£9.15M</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Discrepancies</span>
              <span className="admin-stat-card__value admin-text--danger">1</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Pending Review</span>
              <span className="admin-stat-card__value">1</span>
            </div>
          </div>

          <Card padding="none">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead><tr><th>Batch ID</th><th>Date</th><th>Transactions</th><th>Gross Amount</th><th>Fees Collected</th><th>Net Settlement</th><th>Status</th></tr></thead>
                <tbody>
                  {reconcBatches.map(b => (
                    <tr key={b.id} className={`mtrx-table__row--clickable ${b.status === 'discrepancy' ? 'admin-row--critical' : ''}`}>
                      <td className="admin-mono">{b.id}</td>
                      <td>{b.dateRange}</td>
                      <td>{b.txnCount.toLocaleString()}</td>
                      <td><strong>{b.gross}</strong></td>
                      <td>{b.fees}</td>
                      <td>{b.net}</td>
                      <td><Badge variant={statusVariant(b.status)}>{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'refunds' && (
        <>
          <div className="admin-stats admin-stats--compact">
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Pending Refunds</span>
              <span className="admin-stat-card__value">1</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Processed Today</span>
              <span className="admin-stat-card__value">3</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Total Refunded (MTD)</span>
              <span className="admin-stat-card__value">£16,389</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Refund Rate</span>
              <span className="admin-stat-card__value">0.15%</span>
            </div>
          </div>

          <Card padding="none">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead><tr><th>Refund ID</th><th>Original Txn</th><th>Merchant</th><th>Amount</th><th>Reason</th><th>Requested</th><th>Status</th></tr></thead>
                <tbody>
                  {refunds.map(r => (
                    <tr key={r.id} className="mtrx-table__row--clickable">
                      <td className="admin-mono">{r.id}</td>
                      <td className="admin-mono">{r.originalTxn}</td>
                      <td><strong>{r.merchant}</strong></td>
                      <td>{r.amount}</td>
                      <td className="admin-desc-cell">{r.reason}</td>
                      <td className="admin-muted">{r.requested}</td>
                      <td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'revenue' && (
        <>
          <div className="admin-stats admin-stats--compact">
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Gross Revenue (MTD)</span>
              <span className="admin-stat-card__value">£364,540</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Processing Fees</span>
              <span className="admin-stat-card__value">£496,464</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Interchange Costs</span>
              <span className="admin-stat-card__value">£142,100</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Net Margin</span>
              <span className="admin-stat-card__value">£222,440</span>
            </div>
          </div>

          <Card padding="none">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead><tr><th>Merchant</th><th>Gross Volume</th><th>Fees Collected</th><th>Interchange</th><th>Net Margin</th><th>Margin %</th></tr></thead>
                <tbody>
                  {revenueByMerchant.map(r => (
                    <tr key={r.merchant}>
                      <td><strong>{r.merchant}</strong></td>
                      <td>{r.gross}</td>
                      <td>{r.fees}</td>
                      <td>{r.interchange}</td>
                      <td><strong>{r.netMargin}</strong></td>
                      <td>{r.marginPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
