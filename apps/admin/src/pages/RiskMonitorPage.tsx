import { Card, Badge } from '@mtrx/ui';

interface RiskAlert {
  id: string;
  type: 'velocity' | 'amount' | 'geo' | 'pattern' | 'chargeback' | 'sanctions';
  severity: 'critical' | 'high' | 'medium' | 'low';
  merchant: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignee: string;
}

const mockAlerts: RiskAlert[] = [
  { id: 'RSK-091', type: 'velocity', severity: 'critical', merchant: 'Web3 Payments AG', description: '47 transactions in 5 minutes from same IP — velocity threshold exceeded by 340%', timestamp: '2026-03-18 14:15', status: 'open', assignee: 'Unassigned' },
  { id: 'RSK-090', type: 'amount', severity: 'high', merchant: 'BetKing International', description: 'Single transaction £45,200 exceeds merchant daily limit (£30K)', timestamp: '2026-03-18 14:12', status: 'investigating', assignee: 'Risk Team' },
  { id: 'RSK-089', type: 'geo', severity: 'medium', merchant: 'TradeFX Pro', description: 'Card issued in Nigeria, billing address UK, IP location Germany — geo mismatch', timestamp: '2026-03-18 13:55', status: 'investigating', assignee: 'James M.' },
  { id: 'RSK-088', type: 'chargeback', severity: 'high', merchant: 'VapeWorld Direct', description: 'Chargeback rate 3.2% — exceeds 1% threshold. Card scheme warning imminent', timestamp: '2026-03-18 13:30', status: 'open', assignee: 'Compliance Team' },
  { id: 'RSK-087', type: 'pattern', severity: 'medium', merchant: 'CryptoVault Ltd', description: 'Repeated £999 transactions (just below £1K reporting threshold) — structuring pattern', timestamp: '2026-03-18 12:45', status: 'investigating', assignee: 'Sarah K.' },
  { id: 'RSK-086', type: 'sanctions', severity: 'critical', merchant: 'Paradise Resorts', description: 'Incoming payment from sanctioned jurisdiction — auto-blocked', timestamp: '2026-03-18 11:20', status: 'resolved', assignee: 'Compliance Team' },
];

const severityVariant = (s: string) =>
  s === 'critical' ? 'danger' as const :
  s === 'high' ? 'warning' as const :
  s === 'medium' ? 'info' as const :
  'default' as const;

const statusVariant = (s: string) =>
  s === 'resolved' || s === 'false_positive' ? 'success' as const :
  s === 'investigating' ? 'warning' as const :
  'danger' as const;

const typeLabels: Record<string, string> = {
  velocity: 'Velocity',
  amount: 'Amount Limit',
  geo: 'Geo Mismatch',
  pattern: 'Pattern',
  chargeback: 'Chargeback',
  sanctions: 'Sanctions',
};

export function RiskMonitorPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Risk Monitor</h1>
          <p className="admin-page__subtitle">Real-time fraud detection, AML alerts, and risk scoring engine</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--danger mtrx-btn--sm">Emergency Freeze</button>
        </div>
      </div>

      <div className="admin-stats admin-stats--compact">
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Open Alerts</span>
          <span className="admin-stat-card__value admin-text--danger">7</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Critical</span>
          <span className="admin-stat-card__value admin-text--danger">2</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Investigating</span>
          <span className="admin-stat-card__value">3</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Blocked Today</span>
          <span className="admin-stat-card__value">£67,400</span>
        </div>
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Severity</th>
                <th>Type</th>
                <th>Merchant</th>
                <th>Description</th>
                <th>Time</th>
                <th>Assignee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map(a => (
                <tr key={a.id} className={`mtrx-table__row--clickable ${a.severity === 'critical' ? 'admin-row--critical' : ''}`}>
                  <td className="admin-mono">{a.id}</td>
                  <td><Badge variant={severityVariant(a.severity)}>{a.severity}</Badge></td>
                  <td>{typeLabels[a.type]}</td>
                  <td><strong>{a.merchant}</strong></td>
                  <td className="admin-desc-cell">{a.description}</td>
                  <td className="admin-muted">{a.timestamp}</td>
                  <td>{a.assignee}</td>
                  <td><Badge variant={statusVariant(a.status)}>{a.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
