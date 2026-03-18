import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

interface Application {
  id: string;
  businessName: string;
  industry: string;
  riskCategory: string;
  submittedDate: string;
  status: 'pending_review' | 'under_review' | 'info_requested' | 'approved' | 'rejected';
  assignedTo: string | null;
  expectedVolume: string;
  country: string;
}

const mockApplications: Application[] = [
  { id: 'APP-001', businessName: 'CryptoVault Ltd', industry: 'Cryptocurrency & Web3', riskCategory: 'High', submittedDate: '2026-03-17', status: 'pending_review', assignedTo: null, expectedVolume: '£500K/mo', country: 'GB' },
  { id: 'APP-002', businessName: 'BetKing International', industry: 'Gaming & iGaming', riskCategory: 'High', submittedDate: '2026-03-16', status: 'under_review', assignedTo: 'James M.', expectedVolume: '£2M/mo', country: 'MT' },
  { id: 'APP-003', businessName: 'GreenLeaf Wellness', industry: 'CBD & Cannabis', riskCategory: 'Medium', submittedDate: '2026-03-15', status: 'info_requested', assignedTo: 'Sarah K.', expectedVolume: '£150K/mo', country: 'GB' },
  { id: 'APP-004', businessName: 'TradeFX Pro', industry: 'Forex & Trading', riskCategory: 'High', submittedDate: '2026-03-14', status: 'approved', assignedTo: 'James M.', expectedVolume: '£1.5M/mo', country: 'CY' },
  { id: 'APP-005', businessName: 'CloudRetail UK', industry: 'E-commerce & Retail', riskCategory: 'Low', submittedDate: '2026-03-14', status: 'approved', assignedTo: 'Sarah K.', expectedVolume: '£80K/mo', country: 'GB' },
  { id: 'APP-006', businessName: 'NutraBoost Inc', industry: 'Nutraceuticals', riskCategory: 'Medium', submittedDate: '2026-03-13', status: 'rejected', assignedTo: 'James M.', expectedVolume: '£200K/mo', country: 'US' },
  { id: 'APP-007', businessName: 'Paradise Resorts', industry: 'Travel & Tourism', riskCategory: 'Low', submittedDate: '2026-03-13', status: 'pending_review', assignedTo: null, expectedVolume: '£350K/mo', country: 'AE' },
];

const statusLabel: Record<string, string> = {
  pending_review: 'Pending Review',
  under_review: 'Under Review',
  info_requested: 'Info Requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

const statusVariant = (s: string) =>
  s === 'approved' ? 'success' as const :
  s === 'rejected' ? 'danger' as const :
  s === 'info_requested' ? 'warning' as const :
  s === 'under_review' ? 'info' as const :
  'default' as const;

const riskVariant = (r: string) =>
  r === 'High' ? 'danger' as const :
  r === 'Medium' ? 'warning' as const :
  'success' as const;

type Filter = 'all' | 'pending_review' | 'under_review' | 'info_requested' | 'approved' | 'rejected';

export function ApplicationsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? mockApplications : mockApplications.filter(a => a.status === filter);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Merchant Applications</h1>
          <p className="admin-page__subtitle">Review and process new merchant onboarding applications</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Export Queue</button>
        </div>
      </div>

      <div className="admin-filters">
        {(['all', 'pending_review', 'under_review', 'info_requested', 'approved', 'rejected'] as Filter[]).map(f => (
          <button
            key={f}
            className={`admin-filter-btn${filter === f ? ' admin-filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : statusLabel[f]}
            <span className="admin-filter-btn__count">
              {f === 'all' ? mockApplications.length : mockApplications.filter(a => a.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Business Name</th>
                <th>Industry</th>
                <th>Risk</th>
                <th>Volume</th>
                <th>Country</th>
                <th>Submitted</th>
                <th>Assigned To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="mtrx-table__row--clickable">
                  <td className="admin-mono">{app.id}</td>
                  <td><strong>{app.businessName}</strong></td>
                  <td>{app.industry}</td>
                  <td><Badge variant={riskVariant(app.riskCategory)}>{app.riskCategory}</Badge></td>
                  <td>{app.expectedVolume}</td>
                  <td>{app.country}</td>
                  <td>{app.submittedDate}</td>
                  <td>{app.assignedTo || <span className="admin-muted">Unassigned</span>}</td>
                  <td><Badge variant={statusVariant(app.status)}>{statusLabel[app.status]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
