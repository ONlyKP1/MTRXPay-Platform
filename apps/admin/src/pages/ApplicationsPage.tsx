import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, StatCard } from '@mtrx/ui';

type AppStatus = 'pending_review' | 'under_review' | 'info_requested' | 'approved' | 'rejected' | 'escalated';
type RiskLevel = 'High' | 'Medium' | 'Low';

interface Application {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  accountType: 'individual' | 'business';
  industry: string;
  riskCategory: RiskLevel;
  submittedDate: string;
  lastUpdated: string;
  status: AppStatus;
  assignedTo: string | null;
  expectedVolume: string;
  country: string;
  kycComplete: boolean;
  documentsUploaded: number;
  documentsRequired: number;
  notes: string;
}

const mockApplications: Application[] = [
  { id: 'APP-001', businessName: 'CryptoVault Ltd', contactName: 'Elena Voss', email: 'elena@cryptovault.com', accountType: 'business', industry: 'Cryptocurrency & Web3', riskCategory: 'High', submittedDate: '2026-03-20', lastUpdated: '2026-03-23', status: 'under_review', assignedTo: 'James M.', expectedVolume: '£500K/mo', country: 'DE', kycComplete: true, documentsUploaded: 5, documentsRequired: 5, notes: 'KYB verified. Pending final compliance check.' },
  { id: 'APP-002', businessName: 'BetKing International', contactName: 'Alexei Petrov', email: 'alexei@betking.mt', accountType: 'business', industry: 'Gaming & iGaming', riskCategory: 'High', submittedDate: '2026-03-22', lastUpdated: '2026-03-22', status: 'pending_review', assignedTo: null, expectedVolume: '£2M/mo', country: 'MT', kycComplete: false, documentsUploaded: 2, documentsRequired: 6, notes: '' },
  { id: 'APP-003', businessName: 'GreenLeaf Wellness', contactName: 'Tom Richards', email: 'tom@greenleafcbd.co.uk', accountType: 'business', industry: 'CBD & Cannabis', riskCategory: 'Medium', submittedDate: '2026-03-18', lastUpdated: '2026-03-21', status: 'info_requested', assignedTo: 'Sarah K.', expectedVolume: '£150K/mo', country: 'GB', kycComplete: true, documentsUploaded: 3, documentsRequired: 5, notes: 'Awaiting product licence documentation.' },
  { id: 'APP-004', businessName: 'TradeFX Pro', contactName: 'Hassan Al-Rashid', email: 'hassan@tradefxpro.com', accountType: 'business', industry: 'Forex & Trading', riskCategory: 'High', submittedDate: '2026-03-14', lastUpdated: '2026-03-19', status: 'approved', assignedTo: 'James M.', expectedVolume: '£1.5M/mo', country: 'CY', kycComplete: true, documentsUploaded: 6, documentsRequired: 6, notes: 'Fully approved. Account activated.' },
  { id: 'APP-005', businessName: 'CloudRetail UK', contactName: 'Emily Chen', email: 'emily@cloudretail.co.uk', accountType: 'business', industry: 'E-commerce & Retail', riskCategory: 'Low', submittedDate: '2026-03-14', lastUpdated: '2026-03-16', status: 'approved', assignedTo: 'Sarah K.', expectedVolume: '£80K/mo', country: 'GB', kycComplete: true, documentsUploaded: 4, documentsRequired: 4, notes: '' },
  { id: 'APP-006', businessName: 'NutraBoost Inc', contactName: 'Rachel Kim', email: 'rachel@nutraboost.com', accountType: 'business', industry: 'Nutraceuticals', riskCategory: 'Medium', submittedDate: '2026-03-13', lastUpdated: '2026-03-15', status: 'rejected', assignedTo: 'James M.', expectedVolume: '£200K/mo', country: 'US', kycComplete: false, documentsUploaded: 2, documentsRequired: 5, notes: 'Unable to verify beneficial ownership structure.' },
  { id: 'APP-007', businessName: 'Paradise Resorts', contactName: 'Amara Osei', email: 'amara@paradiseresorts.ae', accountType: 'business', industry: 'Travel & Tourism', riskCategory: 'Low', submittedDate: '2026-03-23', lastUpdated: '2026-03-23', status: 'pending_review', assignedTo: null, expectedVolume: '£350K/mo', country: 'AE', kycComplete: false, documentsUploaded: 0, documentsRequired: 4, notes: '' },
  { id: 'APP-008', businessName: 'Elite Companions', contactName: 'Sophie Laurent', email: 'sophie@elitecompanions.com', accountType: 'business', industry: 'Adult Entertainment', riskCategory: 'High', submittedDate: '2026-03-10', lastUpdated: '2026-03-22', status: 'escalated', assignedTo: 'Sarah K.', expectedVolume: '£500K/mo', country: 'GB', kycComplete: true, documentsUploaded: 5, documentsRequired: 5, notes: 'Escalated — requires senior compliance review for high-risk sector.' },
  { id: 'APP-009', businessName: 'Mike Johnson', contactName: 'Mike Johnson', email: 'mike@freelance.dev', accountType: 'individual', industry: 'SaaS & Technology', riskCategory: 'Low', submittedDate: '2026-03-24', lastUpdated: '2026-03-24', status: 'pending_review', assignedTo: null, expectedVolume: '£10K/mo', country: 'US', kycComplete: false, documentsUploaded: 1, documentsRequired: 3, notes: '' },
];

const statusLabel: Record<AppStatus, string> = {
  pending_review: 'Pending Review',
  under_review: 'Under Review',
  info_requested: 'Info Requested',
  approved: 'Approved',
  rejected: 'Rejected',
  escalated: 'Escalated',
};

const statusVariant = (s: AppStatus) =>
  s === 'approved' ? 'success' as const :
  s === 'rejected' ? 'danger' as const :
  s === 'info_requested' ? 'warning' as const :
  s === 'under_review' ? 'info' as const :
  s === 'escalated' ? 'danger' as const :
  'default' as const;

const riskVariant = (r: RiskLevel) =>
  r === 'High' ? 'danger' as const :
  r === 'Medium' ? 'warning' as const :
  'success' as const;

type Filter = 'all' | AppStatus;

const quickFilters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending_review', label: 'New' },
  { key: 'under_review', label: 'In Review' },
  { key: 'info_requested', label: 'Info Requested' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const industries = [...new Set(mockApplications.map(a => a.industry))].sort();

  const countByStatus = (status: AppStatus) => mockApplications.filter(a => a.status === status).length;

  const filtered = mockApplications.filter(app => {
    const matchesStatus = filter === 'all' || app.status === filter;
    const matchesSearch =
      !searchTerm ||
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || app.riskCategory === riskFilter;
    const matchesIndustry = industryFilter === 'all' || app.industry === industryFilter;
    return matchesStatus && matchesSearch && matchesRisk && matchesIndustry;
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Merchant Applications</h1>
          <p className="admin-page__subtitle">Review and process new merchant onboarding applications</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm">Export CSV</button>
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">Export Queue</button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="admin-stats-row">
        <StatCard label="New Applications" value={countByStatus('pending_review')} change="Awaiting review" changeType="neutral" />
        <StatCard label="In Review" value={countByStatus('under_review')} change="Being processed" changeType="neutral" />
        <StatCard label="Needs Attention" value={countByStatus('info_requested') + countByStatus('escalated')} change={`${countByStatus('escalated')} escalated`} changeType="negative" />
        <StatCard label="Approved" value={countByStatus('approved')} change={`${countByStatus('rejected')} rejected`} changeType="neutral" />
      </div>

      {/* Quick Filters */}
      <div className="admin-filters">
        {quickFilters.map(qf => (
          <button
            key={qf.key}
            className={`admin-filter-btn${filter === qf.key ? ' admin-filter-btn--active' : ''}`}
            onClick={() => setFilter(qf.key)}
          >
            {qf.label}
            <span className="admin-filter-btn__count">
              {qf.key === 'all' ? mockApplications.length : countByStatus(qf.key as AppStatus)}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Additional Filters */}
      <div className="admin-search-row">
        <div className="admin-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search__input"
          />
        </div>
        <select
          className="admin-select"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
        >
          <option value="all">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
        </select>
        <select
          className="admin-select"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="all">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
      <Card padding="none">
        <div className="admin-table-header">
          <span className="admin-table-header__label">Applications ({filtered.length})</span>
        </div>
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Industry</th>
                <th>Risk</th>
                <th>Documents</th>
                <th>Volume</th>
                <th>Country</th>
                <th>Submitted</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="mtrx-table__row--clickable" onClick={() => navigate(`/applications/${app.id}`)}>
                  <td>
                    <div className="admin-applicant-cell">
                      <strong>{app.businessName}</strong>
                      <span className="admin-muted">{app.email}</span>
                      <span className="admin-mono admin-muted">{app.id}</span>
                    </div>
                  </td>
                  <td>{app.industry}</td>
                  <td><Badge variant={riskVariant(app.riskCategory)}>{app.riskCategory}</Badge></td>
                  <td>
                    <div className="admin-docs-cell">
                      <div className="admin-docs-bar">
                        <div
                          className={`admin-docs-bar__fill${app.documentsUploaded >= app.documentsRequired ? ' admin-docs-bar__fill--complete' : ''}`}
                          style={{ width: `${(app.documentsUploaded / app.documentsRequired) * 100}%` }}
                        />
                      </div>
                      <span className="admin-muted">{app.documentsUploaded}/{app.documentsRequired}</span>
                    </div>
                  </td>
                  <td>{app.expectedVolume}</td>
                  <td>{app.country}</td>
                  <td>{app.submittedDate}</td>
                  <td>{app.assignedTo || <span className="admin-muted">Unassigned</span>}</td>
                  <td><Badge variant={statusVariant(app.status)}>{statusLabel[app.status]}</Badge></td>
                  <td>
                    <div className="admin-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="admin-action-btn" title="Review" onClick={() => navigate(`/applications/${app.id}`)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      {(app.status === 'pending_review' || app.status === 'under_review') && (
                        <>
                          <button className="admin-action-btn admin-action-btn--success" title="Approve">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                          </button>
                          <button className="admin-action-btn admin-action-btn--danger" title="Reject">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="admin-empty">No applications found matching your filters.</div>
        )}
      </Card>

      {/* Detail Slide-over Panel */}
      {selectedApp && (
        <div className="admin-panel-overlay" onClick={() => setSelectedApp(null)}>
          <div className="admin-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-detail-panel__header">
              <h3>{selectedApp.businessName}</h3>
              <button className="admin-detail-panel__close" onClick={() => setSelectedApp(null)}>&times;</button>
            </div>
            <div className="admin-detail-panel__body">
              <div className="admin-detail-panel__status-row">
                <Badge variant={statusVariant(selectedApp.status)}>{statusLabel[selectedApp.status]}</Badge>
                <Badge variant={riskVariant(selectedApp.riskCategory)}>{selectedApp.riskCategory} Risk</Badge>
              </div>

              <div className="admin-detail-grid">
                {[
                  ['Application ID', selectedApp.id],
                  ['Contact', selectedApp.contactName],
                  ['Email', selectedApp.email],
                  ['Account Type', selectedApp.accountType === 'business' ? 'Business' : 'Individual'],
                  ['Industry', selectedApp.industry],
                  ['Country', selectedApp.country],
                  ['Expected Volume', selectedApp.expectedVolume],
                  ['KYC/KYB Complete', selectedApp.kycComplete ? '✓ Yes' : '✗ No'],
                  ['Documents', `${selectedApp.documentsUploaded} / ${selectedApp.documentsRequired}`],
                  ['Assigned To', selectedApp.assignedTo || 'Unassigned'],
                  ['Submitted', selectedApp.submittedDate],
                  ['Last Updated', selectedApp.lastUpdated],
                ].map(([label, value]) => (
                  <div key={label} className="admin-detail-row">
                    <span className="admin-detail-row__label">{label}</span>
                    <span className="admin-detail-row__value">{value}</span>
                  </div>
                ))}
              </div>

              {selectedApp.notes && (
                <div className="admin-detail-notes">
                  <span className="admin-detail-row__label">Notes</span>
                  <p>{selectedApp.notes}</p>
                </div>
              )}

              <div className="admin-detail-actions">
                {(selectedApp.status === 'pending_review' || selectedApp.status === 'under_review') && (
                  <>
                    <button className="mtrx-btn mtrx-btn--primary">Approve Application</button>
                    <button className="mtrx-btn mtrx-btn--outline">Request Information</button>
                    <button className="mtrx-btn mtrx-btn--outline mtrx-btn--danger">Reject Application</button>
                  </>
                )}
                {selectedApp.status === 'info_requested' && (
                  <button className="mtrx-btn mtrx-btn--outline">Send Reminder</button>
                )}
                {selectedApp.status === 'escalated' && (
                  <button className="mtrx-btn mtrx-btn--primary">Assign to Senior Compliance</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
