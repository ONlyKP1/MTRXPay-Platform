import { Card, Badge } from '@mtrx/ui';

interface Review {
  id: string;
  merchantName: string;
  type: 'KYC' | 'KYB' | 'EDD';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'pending' | 'in_progress' | 'escalated' | 'completed' | 'failed';
  assignee: string;
  submittedDate: string;
  sla: string;
  slaBreached: boolean;
  checks: { aml: boolean; pep: boolean; sanctions: boolean; adverse: boolean };
}

const mockReviews: Review[] = [
  { id: 'REV-201', merchantName: 'CryptoVault Ltd', type: 'KYB', riskLevel: 'High', status: 'pending', assignee: 'Unassigned', submittedDate: '2026-03-17', sla: '4h remaining', slaBreached: false, checks: { aml: true, pep: false, sanctions: false, adverse: false } },
  { id: 'REV-200', merchantName: 'BetKing International', type: 'EDD', riskLevel: 'Critical', status: 'in_progress', assignee: 'James M.', submittedDate: '2026-03-16', sla: '2h remaining', slaBreached: false, checks: { aml: true, pep: true, sanctions: true, adverse: false } },
  { id: 'REV-199', merchantName: 'Paradise Resorts', type: 'KYC', riskLevel: 'Low', status: 'completed', assignee: 'Sarah K.', submittedDate: '2026-03-15', sla: 'Met', slaBreached: false, checks: { aml: true, pep: true, sanctions: true, adverse: true } },
  { id: 'REV-198', merchantName: 'NutraBoost Inc', type: 'KYB', riskLevel: 'High', status: 'failed', assignee: 'James M.', submittedDate: '2026-03-14', sla: 'Breached', slaBreached: true, checks: { aml: true, pep: true, sanctions: false, adverse: false } },
  { id: 'REV-197', merchantName: 'Web3 Payments AG', type: 'EDD', riskLevel: 'Medium', status: 'escalated', assignee: 'Compliance Team', submittedDate: '2026-03-13', sla: '1h remaining', slaBreached: false, checks: { aml: true, pep: false, sanctions: true, adverse: false } },
];

const statusVariant = (s: string) =>
  s === 'completed' ? 'success' as const :
  s === 'failed' ? 'danger' as const :
  s === 'escalated' ? 'warning' as const :
  s === 'in_progress' ? 'info' as const :
  'default' as const;

const riskVariant = (r: string) =>
  r === 'Critical' || r === 'High' ? 'danger' as const :
  r === 'Medium' ? 'warning' as const :
  'success' as const;

export function ReviewsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">KYC/KYB Reviews</h1>
          <p className="admin-page__subtitle">Compliance verification queue with SLA tracking and AML screening results</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Auto-Assign Queue</button>
        </div>
      </div>

      <div className="admin-stats admin-stats--compact">
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Pending</span>
          <span className="admin-stat-card__value">12</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">In Progress</span>
          <span className="admin-stat-card__value">5</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">SLA Breached</span>
          <span className="admin-stat-card__value admin-text--danger">3</span>
        </div>
        <div className="admin-stat-card admin-stat-card--sm">
          <span className="admin-stat-card__label">Avg Review Time</span>
          <span className="admin-stat-card__value">2.4h</span>
        </div>
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Merchant</th>
                <th>Type</th>
                <th>Risk</th>
                <th>AML</th>
                <th>PEP</th>
                <th>Sanctions</th>
                <th>Adverse Media</th>
                <th>Assignee</th>
                <th>SLA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReviews.map(r => (
                <tr key={r.id} className="mtrx-table__row--clickable">
                  <td className="admin-mono">{r.id}</td>
                  <td><strong>{r.merchantName}</strong></td>
                  <td><Badge variant="default">{r.type}</Badge></td>
                  <td><Badge variant={riskVariant(r.riskLevel)}>{r.riskLevel}</Badge></td>
                  <td>{r.checks.aml ? <span className="admin-check admin-check--pass">Pass</span> : <span className="admin-check admin-check--pending">...</span>}</td>
                  <td>{r.checks.pep ? <span className="admin-check admin-check--pass">Clear</span> : <span className="admin-check admin-check--pending">...</span>}</td>
                  <td>{r.checks.sanctions ? <span className="admin-check admin-check--pass">Clear</span> : <span className="admin-check admin-check--fail">Hit</span>}</td>
                  <td>{r.checks.adverse ? <span className="admin-check admin-check--pass">Clear</span> : <span className="admin-check admin-check--pending">...</span>}</td>
                  <td>{r.assignee}</td>
                  <td className={r.slaBreached ? 'admin-text--danger' : ''}>{r.sla}</td>
                  <td><Badge variant={statusVariant(r.status)}>{r.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
