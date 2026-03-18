import { Card } from '@mtrx/ui';

const stats = [
  { label: 'Total Merchants', value: '1,247', change: '+12%', type: 'positive' as const },
  { label: 'Pending Applications', value: '38', change: '5 urgent', type: 'warning' as const },
  { label: 'Today\'s Volume', value: '£2.4M', change: '+8.3%', type: 'positive' as const },
  { label: 'Active Alerts', value: '7', change: '2 critical', type: 'danger' as const },
  { label: 'Settlement Queue', value: '£890K', change: '142 pending', type: 'neutral' as const },
  { label: 'Success Rate', value: '97.8%', change: '+0.3%', type: 'positive' as const },
];

const recentActivity = [
  { time: '2 min ago', event: 'New merchant application', detail: 'CryptoVault Ltd — Cryptocurrency', status: 'pending' },
  { time: '8 min ago', event: 'KYB review completed', detail: 'GreenLeaf Wellness — CBD & Cannabis', status: 'approved' },
  { time: '15 min ago', event: 'High-risk transaction flagged', detail: '£45,200 — iGaming merchant #1089', status: 'flagged' },
  { time: '22 min ago', event: 'Settlement batch processed', detail: 'Batch #4821 — 47 merchants — £1.2M', status: 'completed' },
  { time: '35 min ago', event: 'Chargeback dispute opened', detail: 'Order #TXN-9842 — £2,340', status: 'dispute' },
  { time: '1 hr ago', event: 'Merchant tier upgraded', detail: 'TradeFX Pro — Silver to Gold', status: 'approved' },
];

const systemHealth = [
  { service: 'Payment Gateway', status: 'operational', uptime: '99.99%' },
  { service: 'KYC/KYB Provider (SumSub)', status: 'operational', uptime: '99.95%' },
  { service: 'Settlement Engine', status: 'operational', uptime: '99.97%' },
  { service: 'Fraud Detection', status: 'degraded', uptime: '98.2%' },
  { service: 'Webhook Delivery', status: 'operational', uptime: '99.98%' },
];

const statusClass = (s: string) =>
  s === 'operational' ? 'admin-status--green' :
  s === 'degraded' ? 'admin-status--amber' : 'admin-status--red';

const activityStatusClass = (s: string) =>
  s === 'approved' || s === 'completed' ? 'mtrx-badge--success' :
  s === 'flagged' || s === 'dispute' ? 'mtrx-badge--danger' :
  'mtrx-badge--warning';

export function DashboardPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Admin Dashboard</h1>
          <p className="admin-page__subtitle">Platform overview and system health</p>
        </div>
        <div className="admin-page__date">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <span className="admin-stat-card__label">{s.label}</span>
            <span className="admin-stat-card__value">{s.value}</span>
            <span className={`admin-stat-card__change admin-stat-card__change--${s.type}`}>
              {s.change}
            </span>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <Card title="Recent Activity">
          <div className="admin-activity">
            {recentActivity.map((a, i) => (
              <div key={i} className="admin-activity__item">
                <div className="admin-activity__time">{a.time}</div>
                <div className="admin-activity__body">
                  <span className="admin-activity__event">{a.event}</span>
                  <span className="admin-activity__detail">{a.detail}</span>
                </div>
                <span className={`mtrx-badge ${activityStatusClass(a.status)}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Health">
          <div className="admin-health">
            {systemHealth.map((h) => (
              <div key={h.service} className="admin-health__item">
                <div className="admin-health__left">
                  <span className={`admin-health__dot ${statusClass(h.status)}`} />
                  <span className="admin-health__service">{h.service}</span>
                </div>
                <div className="admin-health__right">
                  <span className={`admin-health__status ${statusClass(h.status)}`}>{h.status}</span>
                  <span className="admin-health__uptime">{h.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-health__footer">
            <div className="admin-escrow-info">
              <h4>Escrow Summary</h4>
              <div className="admin-escrow-row">
                <span>72hr hold period</span>
                <span className="admin-escrow-val">£890,420</span>
              </div>
              <div className="admin-escrow-row">
                <span>Ready for release</span>
                <span className="admin-escrow-val">£234,100</span>
              </div>
              <div className="admin-escrow-row">
                <span>Under investigation</span>
                <span className="admin-escrow-val admin-escrow-val--warn">£12,800</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
