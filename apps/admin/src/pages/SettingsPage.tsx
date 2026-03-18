import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

const feeTiers = [
  { tier: 'Bronze', industry: 'All', mdr: '6.5%', txnFee: '£0.35', chargebackFee: '£15', monthlyMin: '£0' },
  { tier: 'Silver', industry: 'All', mdr: '4.8%', txnFee: '£0.30', chargebackFee: '£15', monthlyMin: '£0' },
  { tier: 'Gold', industry: 'All', mdr: '3.5%', txnFee: '£0.25', chargebackFee: '£12', monthlyMin: '£0' },
  { tier: 'Platinum', industry: 'All', mdr: '2.4%', txnFee: '£0.20', chargebackFee: '£10', monthlyMin: '£0' },
  { tier: 'Custom', industry: 'Gaming & iGaming', mdr: '5.8%', txnFee: '£0.25', chargebackFee: '£20', monthlyMin: '£500' },
  { tier: 'Custom', industry: 'Cryptocurrency', mdr: '5.2%', txnFee: '£0.30', chargebackFee: '£20', monthlyMin: '£500' },
  { tier: 'Custom', industry: 'Adult Entertainment', mdr: '7.0%', txnFee: '£0.40', chargebackFee: '£25', monthlyMin: '£1,000' },
];

const riskRules = [
  { name: 'Max transactions per 5 min', type: 'velocity', threshold: '25 transactions', action: 'Block + Alert', status: 'active' },
  { name: 'Single transaction limit', type: 'amount', threshold: '£50,000', action: 'Flag for review', status: 'active' },
  { name: 'Daily volume limit per merchant', type: 'amount', threshold: '150% of avg daily', action: 'Flag for review', status: 'active' },
  { name: 'Geo-mismatch detection', type: 'geo', threshold: 'Card ≠ IP ≠ Billing', action: 'Flag + delay', status: 'active' },
  { name: 'Structuring pattern detection', type: 'pattern', threshold: 'Repeated near-threshold', action: 'SAR alert', status: 'active' },
  { name: 'Card-not-present limit', type: 'amount', threshold: '£10,000 per card/24h', action: 'Block', status: 'active' },
  { name: 'Sanctioned jurisdiction block', type: 'geo', threshold: 'OFAC/EU list match', action: 'Auto-block', status: 'active' },
  { name: 'New card velocity', type: 'velocity', threshold: '5 new cards per merchant/hr', action: 'Flag', status: 'disabled' },
];

const paymentMethods = [
  { name: 'Visa', currencies: ['GBP', 'EUR', 'USD', 'AED'], enabled: true },
  { name: 'Mastercard', currencies: ['GBP', 'EUR', 'USD', 'AED'], enabled: true },
  { name: 'Amex', currencies: ['GBP', 'USD'], enabled: true },
  { name: 'BACS Direct Debit', currencies: ['GBP'], enabled: true },
  { name: 'SEPA Transfer', currencies: ['EUR'], enabled: true },
  { name: 'Faster Payments', currencies: ['GBP'], enabled: true },
  { name: 'Wire Transfer', currencies: ['GBP', 'EUR', 'USD', 'AED'], enabled: true },
  { name: 'Apple Pay', currencies: ['GBP', 'EUR', 'USD'], enabled: false },
  { name: 'Google Pay', currencies: ['GBP', 'EUR', 'USD'], enabled: false },
  { name: 'Crypto (USDC/USDT)', currencies: ['USD'], enabled: false },
];

const currencies = [
  { pair: 'GBP/EUR', rate: '1.1742', spread: '0.45%', updated: '2026-03-18 14:30' },
  { pair: 'GBP/USD', rate: '1.2634', spread: '0.40%', updated: '2026-03-18 14:30' },
  { pair: 'GBP/AED', rate: '4.6398', spread: '0.55%', updated: '2026-03-18 14:30' },
  { pair: 'EUR/USD', rate: '1.0760', spread: '0.35%', updated: '2026-03-18 14:30' },
  { pair: 'EUR/AED', rate: '3.9514', spread: '0.50%', updated: '2026-03-18 14:30' },
  { pair: 'USD/AED', rate: '3.6725', spread: '0.30%', updated: '2026-03-18 14:30' },
];

const tierClass = (t: string) =>
  t === 'Platinum' ? 'admin-tier--platinum' :
  t === 'Gold' ? 'admin-tier--gold' :
  t === 'Silver' ? 'admin-tier--silver' :
  t === 'Bronze' ? 'admin-tier--bronze' : '';

type Tab = 'fees' | 'risk-rules' | 'payment-methods' | 'currencies';

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('fees');

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Platform Settings</h1>
          <p className="admin-page__subtitle">Fee structures, risk rules, payment methods, and currency configuration</p>
        </div>
      </div>

      <div className="admin-filters">
        {([['fees', 'Fee Management'], ['risk-rules', 'Risk Rules'], ['payment-methods', 'Payment Methods'], ['currencies', 'Currencies & FX']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} className={`admin-filter-btn${tab === key ? ' admin-filter-btn--active' : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'fees' && (
        <Card padding="none">
          <div className="mtrx-table-wrap">
            <table className="mtrx-table">
              <thead><tr><th>Tier</th><th>Industry</th><th>MDR</th><th>Txn Fee</th><th>Chargeback Fee</th><th>Monthly Min</th><th>Action</th></tr></thead>
              <tbody>
                {feeTiers.map((f, i) => (
                  <tr key={i}>
                    <td>{f.tier !== 'Custom' ? <span className={`admin-tier ${tierClass(f.tier)}`}>{f.tier}</span> : <span className="admin-muted">Custom</span>}</td>
                    <td>{f.industry}</td>
                    <td><strong>{f.mdr}</strong></td>
                    <td>{f.txnFee}</td>
                    <td>{f.chargebackFee}</td>
                    <td>{f.monthlyMin}</td>
                    <td><button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'risk-rules' && (
        <Card padding="none">
          <div className="mtrx-table-wrap">
            <table className="mtrx-table">
              <thead><tr><th>Rule</th><th>Type</th><th>Threshold</th><th>Action</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {riskRules.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.name}</strong></td>
                    <td><Badge variant="default">{r.type}</Badge></td>
                    <td className="admin-mono">{r.threshold}</td>
                    <td>{r.action}</td>
                    <td><Badge variant={r.status === 'active' ? 'success' : 'default'}>{r.status}</Badge></td>
                    <td><button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'payment-methods' && (
        <div className="admin-report-grid">
          {paymentMethods.map(pm => (
            <Card key={pm.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong>{pm.name}</strong>
                <Badge variant={pm.enabled ? 'success' : 'default'}>{pm.enabled ? 'Enabled' : 'Disabled'}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {pm.currencies.map(c => <span key={c} className="mtrx-badge mtrx-badge--default">{c}</span>)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'currencies' && (
        <Card padding="none">
          <div className="mtrx-table-wrap">
            <table className="mtrx-table">
              <thead><tr><th>Currency Pair</th><th>Rate</th><th>Spread</th><th>Last Updated</th><th>Action</th></tr></thead>
              <tbody>
                {currencies.map(c => (
                  <tr key={c.pair}>
                    <td><strong>{c.pair}</strong></td>
                    <td className="admin-mono">{c.rate}</td>
                    <td>{c.spread}</td>
                    <td className="admin-muted">{c.updated}</td>
                    <td><button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
