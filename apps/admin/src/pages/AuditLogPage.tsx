import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  detail: string;
  ipAddress: string;
  category: 'auth' | 'merchant' | 'transaction' | 'compliance' | 'system' | 'config';
}

const mockAudit: AuditEntry[] = [
  { id: 'AUD-9921', timestamp: '2026-03-18 14:22:01', actor: 'James M.', actorRole: 'Compliance Officer', action: 'REVIEW_APPROVED', resource: 'REV-200', detail: 'KYB review approved for BetKing International', ipAddress: '192.168.1.42', category: 'compliance' },
  { id: 'AUD-9920', timestamp: '2026-03-18 14:18:45', actor: 'System', actorRole: 'Automated', action: 'SETTLEMENT_PROCESSED', resource: 'STL-4819', detail: 'Settlement batch processed — £12,340 to CloudRetail UK', ipAddress: '—', category: 'transaction' },
  { id: 'AUD-9919', timestamp: '2026-03-18 14:15:30', actor: 'Risk Engine', actorRole: 'Automated', action: 'ALERT_CREATED', resource: 'RSK-091', detail: 'Velocity threshold exceeded — Web3 Payments AG', ipAddress: '—', category: 'system' },
  { id: 'AUD-9918', timestamp: '2026-03-18 14:12:00', actor: 'Sarah K.', actorRole: 'Admin', action: 'MERCHANT_SUSPENDED', resource: 'MRC-1004', detail: 'VapeWorld Direct suspended — chargeback rate 3.2%', ipAddress: '192.168.1.88', category: 'merchant' },
  { id: 'AUD-9917', timestamp: '2026-03-18 13:55:12', actor: 'Admin API', actorRole: 'System', action: 'CONFIG_UPDATED', resource: 'risk-thresholds', detail: 'Velocity threshold updated: 30 → 25 txns/5min', ipAddress: '10.0.0.1', category: 'config' },
  { id: 'AUD-9916', timestamp: '2026-03-18 13:40:00', actor: 'James M.', actorRole: 'Compliance Officer', action: 'LOGIN', resource: 'admin-portal', detail: 'Successful login via SSO', ipAddress: '192.168.1.42', category: 'auth' },
];

const categoryVariant = (c: string) =>
  c === 'compliance' ? 'warning' as const :
  c === 'transaction' ? 'info' as const :
  c === 'system' ? 'default' as const :
  c === 'merchant' ? 'success' as const :
  c === 'config' ? 'info' as const :
  'default' as const;

type CatFilter = 'all' | 'auth' | 'merchant' | 'transaction' | 'compliance' | 'system' | 'config';

export function AuditLogPage() {
  const [filter, setFilter] = useState<CatFilter>('all');
  const filtered = filter === 'all' ? mockAudit : mockAudit.filter(a => a.category === filter);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Audit Log</h1>
          <p className="admin-page__subtitle">Immutable record of all administrative actions — FCA compliance ready</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Export Log</button>
        </div>
      </div>

      <div className="admin-filters">
        {(['all', 'auth', 'merchant', 'transaction', 'compliance', 'system', 'config'] as CatFilter[]).map(f => (
          <button
            key={f}
            className={`admin-filter-btn${filter === f ? ' admin-filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Events' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Detail</th>
                <th>IP</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="admin-mono">{a.id}</td>
                  <td className="admin-muted">{a.timestamp}</td>
                  <td><strong>{a.actor}</strong></td>
                  <td className="admin-muted">{a.actorRole}</td>
                  <td className="admin-mono">{a.action}</td>
                  <td className="admin-mono">{a.resource}</td>
                  <td className="admin-desc-cell">{a.detail}</td>
                  <td className="admin-mono admin-muted">{a.ipAddress}</td>
                  <td><Badge variant={categoryVariant(a.category)}>{a.category}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
