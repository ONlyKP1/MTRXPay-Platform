import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatusBadge } from '../components/common/StatusBadge';

type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';
const currencyLocales: Record<Currency, string> = { GBP: 'en-GB', EUR: 'de-DE', USD: 'en-US', AED: 'ar-AE' };

const balances: { currency: Currency; available: number; escrow: number; pending: number }[] = [
  { currency: 'GBP', available: 31_842.75, escrow: 4_275.30, pending: 2_100.00 },
  { currency: 'EUR', available: 27_615.40, escrow: 1_840.60, pending: 850.00 },
  { currency: 'USD', available: 42_390.20, escrow: 3_120.50, pending: 1_450.00 },
  { currency: 'AED', available: 156_720.80, escrow: 8_945.00, pending: 0 },
];

const recentSettlements = [
  { id: 'SET-001', date: '2026-03-14', currency: 'GBP' as Currency, amount: 15_420.00, status: 'completed' as const, bank: 'Barclays ****4821' },
  { id: 'SET-002', date: '2026-03-11', currency: 'GBP' as Currency, amount: 8_240.00, status: 'completed' as const, bank: 'Barclays ****4821' },
  { id: 'SET-003', date: '2026-03-07', currency: 'EUR' as Currency, amount: 12_680.50, status: 'completed' as const, bank: 'Deutsche ****7733' },
  { id: 'SET-004', date: '2026-03-18', currency: 'GBP' as Currency, amount: 9_800.00, status: 'pending' as const, bank: 'Barclays ****4821' },
];

const escrowReleases = [
  { id: 'ESC-001', amount: 1_475.00, currency: 'GBP' as Currency, capturedAt: '2026-03-14 14:32', releasesAt: '2026-03-17 14:32', hoursLeft: 52 },
  { id: 'ESC-002', amount: 890.50, currency: 'GBP' as Currency, capturedAt: '2026-03-14 12:15', releasesAt: '2026-03-17 12:15', hoursLeft: 50 },
  { id: 'ESC-003', amount: 1_850.00, currency: 'GBP' as Currency, capturedAt: '2026-03-13 17:25', releasesAt: '2026-03-16 17:25', hoursLeft: 26 },
];

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export function BalancesPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('GBP');

  const formatCurrency = (amount: number, currency: Currency) =>
    new Intl.NumberFormat(currencyLocales[currency], { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

  const selected = balances.find(b => b.currency === selectedCurrency)!;
  const totalBalance = selected.available + selected.escrow + selected.pending;

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Balances</h1>
      </div>

      {/* Currency Tabs */}
      <div className="hp-dash__currency-tabs">
        {balances.map((b) => (
          <button
            key={b.currency}
            className={`hp-dash__currency-tab${selectedCurrency === b.currency ? ' hp-dash__currency-tab--active' : ''}`}
            onClick={() => setSelectedCurrency(b.currency)}
          >
            <span className="hp-dash__currency-tab-code">{b.currency}</span>
            <span className="hp-dash__currency-tab-amount">{formatCurrency(b.available, b.currency)}</span>
          </button>
        ))}
      </div>

      {/* Balance Summary */}
      <section className="hp-dash__kpi-grid" style={{ marginBottom: 24 }}>
        <div className="hp-dash__kpi-card hp-dash__kpi-card--primary">
          <div className="hp-dash__kpi-card-content">
            <span className="hp-dash__kpi-card-label">Available Balance</span>
            <span className="hp-dash__kpi-card-value">{formatCurrency(selected.available, selectedCurrency)}</span>
          </div>
        </div>
        <div className="hp-dash__kpi-card">
          <div className="hp-dash__kpi-card-content">
            <span className="hp-dash__kpi-card-label">In Escrow (72hr hold)</span>
            <span className="hp-dash__kpi-card-value">{formatCurrency(selected.escrow, selectedCurrency)}</span>
          </div>
        </div>
        <div className="hp-dash__kpi-card">
          <div className="hp-dash__kpi-card-content">
            <span className="hp-dash__kpi-card-label">Pending Settlement</span>
            <span className="hp-dash__kpi-card-value">{formatCurrency(selected.pending, selectedCurrency)}</span>
          </div>
        </div>
      </section>

      {/* Total balance bar */}
      <section className="hp-bal__total-card">
        <div className="hp-bal__total-header">
          <span className="hp-dash__section-label">Total Balance Breakdown</span>
          <span className="hp-bal__total-amount">{formatCurrency(totalBalance, selectedCurrency)}</span>
        </div>
        <div className="hp-bal__bar-track">
          <div className="hp-bal__bar-fill hp-bal__bar-fill--available" style={{ width: `${(selected.available / totalBalance) * 100}%` }} />
          <div className="hp-bal__bar-fill hp-bal__bar-fill--escrow" style={{ width: `${(selected.escrow / totalBalance) * 100}%` }} />
          <div className="hp-bal__bar-fill hp-bal__bar-fill--pending" style={{ width: `${(selected.pending / totalBalance) * 100}%` }} />
        </div>
        <div className="hp-bal__bar-legend">
          <span><span className="hp-bal__legend-dot hp-bal__legend-dot--available" /> Available</span>
          <span><span className="hp-bal__legend-dot hp-bal__legend-dot--escrow" /> Escrow</span>
          <span><span className="hp-bal__legend-dot hp-bal__legend-dot--pending" /> Pending</span>
        </div>
      </section>

      {/* Escrow Releases */}
      <section className="hp-dash__transactions">
        <div className="hp-dash__section-header">
          <span className="hp-dash__section-label">Upcoming Escrow Releases</span>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Captured</th>
                <th>Releases</th>
                <th>Time Left</th>
              </tr>
            </thead>
            <tbody>
              {escrowReleases.map((e) => (
                <tr key={e.id}>
                  <td className="hp-dash__txn-id">{e.id}</td>
                  <td>{formatCurrency(e.amount, e.currency)}</td>
                  <td>{e.capturedAt}</td>
                  <td>{e.releasesAt}</td>
                  <td><StatusBadge status="pending" /><span style={{ marginLeft: 8, fontSize: '0.78rem' }}>{e.hoursLeft}h</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Settlements */}
      <section className="hp-dash__transactions">
        <div className="hp-dash__section-header">
          <span className="hp-dash__section-label">Recent Settlements</span>
        </div>
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Settlement ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Bank Account</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSettlements.map((s) => (
                <tr key={s.id}>
                  <td className="hp-dash__txn-id">{s.id}</td>
                  <td>{formatDate(s.date)}</td>
                  <td>{formatCurrency(s.amount, s.currency)}</td>
                  <td style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '0.78rem' }}>{s.bank}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
