import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, StatCard } from '@mtrx/ui';

type AppStatus = 'pending_review' | 'under_review' | 'info_requested' | 'approved' | 'rejected' | 'escalated';
type DocStatus = 'uploaded' | 'verified' | 'rejected' | 'missing' | 'under_review';

interface Director {
  name: string;
  role: string;
  nationality: string;
  dob: string;
  ownershipPercent: number;
  idVerified: boolean;
  pep: boolean;
  sanctions: boolean;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string | null;
  fileSize: string | null;
  status: DocStatus;
  reviewedBy: string | null;
  notes: string;
}

interface ApplicationDetail {
  id: string;
  status: AppStatus;
  submittedAt: string;
  lastUpdated: string;
  assignedTo: string | null;
  riskCategory: 'High' | 'Medium' | 'Low';
  riskScore: number;

  // Business info
  businessName: string;
  tradingName: string;
  registrationNumber: string;
  incorporationDate: string;
  businessType: string;
  industry: string;
  website: string;
  registeredAddress: string;
  tradingAddress: string;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;

  // Processing
  expectedVolume: string;
  averageTransaction: string;
  currencies: string[];
  country: string;
  processingHistory: string;

  // KYC/KYB
  accountType: 'individual' | 'business';
  kycStatus: 'not_started' | 'in_progress' | 'complete' | 'failed';
  directors: Director[];
  documents: Document[];

  // Timeline
  timeline: { time: string; actor: string; event: string; detail: string }[];

  // Internal
  notes: { author: string; time: string; text: string }[];
}

const mockApplications: Record<string, ApplicationDetail> = {
  'APP-001': {
    id: 'APP-001', status: 'under_review', submittedAt: '2026-03-20', lastUpdated: '2026-03-23', assignedTo: 'James M.', riskCategory: 'High', riskScore: 78,
    businessName: 'CryptoVault Ltd', tradingName: 'CryptoVault Exchange', registrationNumber: 'DE-HRB-294817', incorporationDate: '2024-06-15', businessType: 'GmbH (Limited)', industry: 'Cryptocurrency & Web3', website: 'cryptovault.com', registeredAddress: 'Friedrichstraße 123, 10117 Berlin, Germany', tradingAddress: 'Same as registered',
    contactName: 'Elena Voss', contactEmail: 'elena@cryptovault.com', contactPhone: '+49 30 1234 5678', contactRole: 'CEO & Co-Founder',
    expectedVolume: '£500,000/mo', averageTransaction: '£2,400', currencies: ['EUR', 'GBP', 'USD'], country: 'DE', processingHistory: '18 months with previous processor (Stripe — terminated due to industry restrictions)',
    accountType: 'business', kycStatus: 'complete',
    directors: [
      { name: 'Elena Voss', role: 'CEO & Co-Founder', nationality: 'German', dob: '1988-04-22', ownershipPercent: 45, idVerified: true, pep: false, sanctions: false },
      { name: 'Marcus Weber', role: 'CTO & Co-Founder', nationality: 'German', dob: '1990-11-08', ownershipPercent: 45, idVerified: true, pep: false, sanctions: false },
      { name: 'Innovation Capital GmbH', role: 'Investor', nationality: 'Germany', dob: '-', ownershipPercent: 10, idVerified: true, pep: false, sanctions: false },
    ],
    documents: [
      { id: 'D1', name: 'Certificate of Incorporation', type: 'Company Registration', uploadedAt: '2026-03-20', fileSize: '1.2 MB', status: 'verified', reviewedBy: 'James M.', notes: '' },
      { id: 'D2', name: 'Director ID — Elena Voss (Passport)', type: 'Identity Document', uploadedAt: '2026-03-20', fileSize: '3.4 MB', status: 'verified', reviewedBy: 'James M.', notes: '' },
      { id: 'D3', name: 'Director ID — Marcus Weber (Passport)', type: 'Identity Document', uploadedAt: '2026-03-20', fileSize: '2.8 MB', status: 'verified', reviewedBy: 'James M.', notes: '' },
      { id: 'D4', name: 'Proof of Address — Utility Bill', type: 'Address Verification', uploadedAt: '2026-03-20', fileSize: '890 KB', status: 'verified', reviewedBy: 'James M.', notes: '' },
      { id: 'D5', name: 'Bank Statement (3 months)', type: 'Financial Document', uploadedAt: '2026-03-21', fileSize: '2.1 MB', status: 'under_review', reviewedBy: null, notes: '' },
      { id: 'D6', name: 'AML/KYC Policy Document', type: 'Compliance', uploadedAt: '2026-03-21', fileSize: '4.5 MB', status: 'under_review', reviewedBy: null, notes: '' },
      { id: 'D7', name: 'Previous Processing Statements', type: 'Financial Document', uploadedAt: '2026-03-21', fileSize: '6.2 MB', status: 'verified', reviewedBy: 'James M.', notes: 'Shows 18-month Stripe history, clean record.' },
    ],
    timeline: [
      { time: '2026-03-23 10:15', actor: 'James M.', event: 'Documents reviewed', detail: 'Verified incorporation certificate, director IDs, and proof of address. Bank statements and AML policy still under review.' },
      { time: '2026-03-22 14:00', actor: 'System', event: 'Risk assessment completed', detail: 'Risk score: 78/100 (High) — Cryptocurrency industry, high monthly volume, cross-border processing.' },
      { time: '2026-03-21 09:30', actor: 'Elena Voss', event: 'Additional documents uploaded', detail: 'Bank statement, AML policy, and processing history uploaded.' },
      { time: '2026-03-20 16:45', actor: 'James M.', event: 'Application assigned', detail: 'Assigned to James M. for initial review.' },
      { time: '2026-03-20 11:00', actor: 'Elena Voss', event: 'Application submitted', detail: 'Initial application with incorporation docs and director IDs.' },
    ],
    notes: [
      { author: 'James M.', time: '2026-03-23 10:20', text: 'Core documents look solid. Company has 18 months of clean processing history with Stripe before they were offboarded due to crypto industry policy. AML policy document appears comprehensive — sending to compliance for final sign-off.' },
      { author: 'James M.', time: '2026-03-20 17:00', text: 'High-risk sector but applicant has legitimate processing history. Proceeding with enhanced due diligence.' },
    ],
  },
  'APP-002': {
    id: 'APP-002', status: 'pending_review', submittedAt: '2026-03-22', lastUpdated: '2026-03-22', assignedTo: null, riskCategory: 'High', riskScore: 85,
    businessName: 'BetKing International Ltd', tradingName: 'BetKing', registrationNumber: 'C-91284', incorporationDate: '2023-02-10', businessType: 'Ltd (Malta)', industry: 'Gaming & iGaming', website: 'betking.mt', registeredAddress: '18 Republic Street, Valletta VLT 1000, Malta', tradingAddress: 'Same as registered',
    contactName: 'Alexei Petrov', contactEmail: 'alexei@betking.mt', contactPhone: '+356 21 234567', contactRole: 'CFO',
    expectedVolume: '£2,000,000/mo', averageTransaction: '£85', currencies: ['EUR', 'GBP', 'USD', 'AED'], country: 'MT', processingHistory: '3 years with Nuvei. Seeking additional processor for redundancy.',
    accountType: 'business', kycStatus: 'in_progress',
    directors: [
      { name: 'Alexei Petrov', role: 'CFO', nationality: 'Maltese', dob: '1985-07-14', ownershipPercent: 30, idVerified: true, pep: false, sanctions: false },
      { name: 'Marco Borg', role: 'CEO', nationality: 'Maltese', dob: '1982-03-22', ownershipPercent: 50, idVerified: false, pep: false, sanctions: false },
      { name: 'GamingVentures Holdings', role: 'Investor', nationality: 'Malta', dob: '-', ownershipPercent: 20, idVerified: false, pep: false, sanctions: false },
    ],
    documents: [
      { id: 'D1', name: 'Certificate of Incorporation', type: 'Company Registration', uploadedAt: '2026-03-22', fileSize: '980 KB', status: 'uploaded', reviewedBy: null, notes: '' },
      { id: 'D2', name: 'MGA Gaming Licence', type: 'Industry Licence', uploadedAt: '2026-03-22', fileSize: '1.8 MB', status: 'uploaded', reviewedBy: null, notes: '' },
      { id: 'D3', name: 'Director ID — Alexei Petrov', type: 'Identity Document', uploadedAt: null, fileSize: null, status: 'missing', reviewedBy: null, notes: '' },
      { id: 'D4', name: 'Director ID — Marco Borg', type: 'Identity Document', uploadedAt: null, fileSize: null, status: 'missing', reviewedBy: null, notes: '' },
      { id: 'D5', name: 'Proof of Address', type: 'Address Verification', uploadedAt: null, fileSize: null, status: 'missing', reviewedBy: null, notes: '' },
      { id: 'D6', name: 'Bank Statement (3 months)', type: 'Financial Document', uploadedAt: null, fileSize: null, status: 'missing', reviewedBy: null, notes: '' },
    ],
    timeline: [
      { time: '2026-03-22 15:30', actor: 'Alexei Petrov', event: 'Application submitted', detail: 'Initial submission with incorporation certificate and gaming licence.' },
    ],
    notes: [],
  },
};

const statusVariant = (s: AppStatus) =>
  s === 'approved' ? 'success' as const :
  s === 'rejected' || s === 'escalated' ? 'danger' as const :
  s === 'info_requested' ? 'warning' as const :
  s === 'under_review' ? 'info' as const :
  'default' as const;

const riskVariant = (r: string) =>
  r === 'High' ? 'danger' as const :
  r === 'Medium' ? 'warning' as const :
  'success' as const;

const docStatusVariant = (s: DocStatus) =>
  s === 'verified' ? 'success' as const :
  s === 'rejected' ? 'danger' as const :
  s === 'under_review' ? 'info' as const :
  s === 'uploaded' ? 'warning' as const :
  'default' as const;

const docStatusLabel: Record<DocStatus, string> = {
  uploaded: 'Uploaded',
  verified: 'Verified',
  rejected: 'Rejected',
  missing: 'Missing',
  under_review: 'Under Review',
};

const statusLabel: Record<AppStatus, string> = {
  pending_review: 'Pending Review',
  under_review: 'Under Review',
  info_requested: 'Info Requested',
  approved: 'Approved',
  rejected: 'Rejected',
  escalated: 'Escalated',
};

type Tab = 'overview' | 'documents' | 'directors' | 'timeline' | 'notes';

type ModalType = 'approve' | 'reject' | 'request_info' | 'escalate' | 'assign' | null;

export function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const [tab, setTab] = useState<Tab>('overview');
  const [newNote, setNewNote] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalReason, setModalReason] = useState('');
  const [modalNote, setModalNote] = useState('');
  const [assignee, setAssignee] = useState('');

  // Local mutable state for demo
  const [appStatus, setAppStatus] = useState<AppStatus | null>(null);
  const [localNotes, setLocalNotes] = useState<{ author: string; time: string; text: string }[]>([]);
  const [localTimeline, setLocalTimeline] = useState<{ time: string; actor: string; event: string; detail: string }[]>([]);
  const [initialized, setInitialized] = useState(false);

  const raw = mockApplications[applicationId || ''];

  // Initialize local state from mock data once
  if (raw && !initialized) {
    setAppStatus(raw.status);
    setLocalNotes([...raw.notes]);
    setLocalTimeline([...raw.timeline]);
    setInitialized(true);
  }

  const app = raw ? { ...raw, status: appStatus || raw.status, notes: localNotes, timeline: localTimeline } : null;

  const now = () => new Date().toISOString().replace('T', ' ').slice(0, 16);

  const addTimelineEntry = (event: string, detail: string) => {
    setLocalTimeline(prev => [{ time: now(), actor: 'You', event, detail }, ...prev]);
  };

  const addNoteEntry = (text: string) => {
    setLocalNotes(prev => [{ author: 'You', time: now(), text }, ...prev]);
  };

  const handleApprove = () => {
    setAppStatus('approved');
    addTimelineEntry('Application approved', modalNote || 'Application approved by admin.');
    if (modalNote) addNoteEntry(modalNote);
    setActiveModal(null);
    setModalNote('');
  };

  const handleReject = () => {
    if (!modalReason.trim()) return;
    setAppStatus('rejected');
    addTimelineEntry('Application rejected', `Reason: ${modalReason}`);
    addNoteEntry(`Rejected — ${modalReason}`);
    setActiveModal(null);
    setModalReason('');
    setModalNote('');
  };

  const handleRequestInfo = () => {
    if (!modalReason.trim()) return;
    setAppStatus('info_requested');
    addTimelineEntry('Information requested', modalReason);
    addNoteEntry(`Requested information: ${modalReason}`);
    setActiveModal(null);
    setModalReason('');
  };

  const handleEscalate = () => {
    setAppStatus('escalated');
    addTimelineEntry('Application escalated', modalNote || 'Escalated for senior compliance review.');
    if (modalNote) addNoteEntry(modalNote);
    setActiveModal(null);
    setModalNote('');
  };

  const handleAssign = () => {
    if (!assignee) return;
    addTimelineEntry('Reviewer assigned', `Assigned to ${assignee}`);
    setActiveModal(null);
    setAssignee('');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteEntry(newNote);
    addTimelineEntry('Note added', newNote.length > 80 ? newNote.slice(0, 80) + '...' : newNote);
    setNewNote('');
  };

  if (!app) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Application Not Found</h1>
            <p className="admin-page__subtitle">
              <Link to="/applications">← Back to Applications</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const docsVerified = app.documents.filter(d => d.status === 'verified').length;
  const docsTotal = app.documents.length;
  const docsMissing = app.documents.filter(d => d.status === 'missing').length;
  const directorsVerified = app.directors.filter(d => d.idVerified).length;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page__header">
        <div>
          <p className="admin-page__subtitle" style={{ marginBottom: 8 }}>
            <Link to="/applications">← Applications</Link> / {app.id}
          </p>
          <h1 className="admin-page__title">{app.businessName}</h1>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant={statusVariant(app.status)}>{statusLabel[app.status]}</Badge>
            <Badge variant={riskVariant(app.riskCategory)}>{app.riskCategory} Risk</Badge>
            <span className="admin-muted">{app.industry}</span>
            <span className="admin-muted">•</span>
            <span className="admin-muted">{app.country}</span>
          </div>
        </div>
        <div className="admin-page__actions">
          {!app.assignedTo && app.status !== 'approved' && app.status !== 'rejected' && (
            <button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm" onClick={() => setActiveModal('assign')}>Assign</button>
          )}
          {(app.status === 'pending_review' || app.status === 'under_review') && (
            <>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal('request_info')}>Request Info</button>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal('escalate')}>Escalate</button>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm mtrx-btn--danger" onClick={() => setActiveModal('reject')}>Reject</button>
              <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={() => setActiveModal('approve')}>Approve</button>
            </>
          )}
          {app.status === 'info_requested' && (
            <>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal('request_info')}>Send Reminder</button>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm mtrx-btn--danger" onClick={() => setActiveModal('reject')}>Reject</button>
              <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={() => setActiveModal('approve')}>Approve</button>
            </>
          )}
          {app.status === 'escalated' && (
            <>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal('assign')}>Assign Senior Review</button>
              <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm mtrx-btn--danger" onClick={() => setActiveModal('reject')}>Reject</button>
              <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={() => setActiveModal('approve')}>Approve</button>
            </>
          )}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="admin-stats-row">
        <StatCard label="Risk Score" value={`${app.riskScore}/100`} change={app.riskCategory} changeType={app.riskCategory === 'High' ? 'negative' : app.riskCategory === 'Low' ? 'positive' : 'neutral'} />
        <StatCard label="Documents" value={`${docsVerified}/${docsTotal}`} change={docsMissing > 0 ? `${docsMissing} missing` : 'All uploaded'} changeType={docsMissing > 0 ? 'negative' : 'positive'} />
        <StatCard label="Directors Verified" value={`${directorsVerified}/${app.directors.length}`} change={directorsVerified === app.directors.length ? 'All verified' : 'Incomplete'} changeType={directorsVerified === app.directors.length ? 'positive' : 'negative'} />
        <StatCard label="Expected Volume" value={app.expectedVolume} change={`Avg txn: ${app.averageTransaction}`} changeType="neutral" />
      </div>

      {/* Tabs */}
      <div className="admin-filters">
        {(['overview', 'documents', 'directors', 'timeline', 'notes'] as Tab[]).map(t => (
          <button
            key={t}
            className={`admin-filter-btn${tab === t ? ' admin-filter-btn--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'documents' && docsMissing > 0 && (
              <span className="admin-filter-btn__count" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--hp-red)' }}>{docsMissing}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="admin-grid-2">
          <Card title="Business Information">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>Legal Name</span><strong>{app.businessName}</strong></div>
              <div className="admin-detail-row"><span>Trading Name</span><span>{app.tradingName}</span></div>
              <div className="admin-detail-row"><span>Registration No.</span><span className="admin-mono">{app.registrationNumber}</span></div>
              <div className="admin-detail-row"><span>Incorporated</span><span>{app.incorporationDate}</span></div>
              <div className="admin-detail-row"><span>Business Type</span><span>{app.businessType}</span></div>
              <div className="admin-detail-row"><span>Industry</span><span>{app.industry}</span></div>
              <div className="admin-detail-row"><span>Website</span><span>{app.website}</span></div>
              <div className="admin-detail-row"><span>Registered Address</span><span>{app.registeredAddress}</span></div>
              <div className="admin-detail-row"><span>Trading Address</span><span>{app.tradingAddress}</span></div>
            </div>
          </Card>

          <Card title="Contact & Processing">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>Contact</span><strong>{app.contactName}</strong></div>
              <div className="admin-detail-row"><span>Role</span><span>{app.contactRole}</span></div>
              <div className="admin-detail-row"><span>Email</span><span>{app.contactEmail}</span></div>
              <div className="admin-detail-row"><span>Phone</span><span>{app.contactPhone}</span></div>
              <div className="admin-detail-row"><span>Expected Volume</span><strong>{app.expectedVolume}</strong></div>
              <div className="admin-detail-row"><span>Avg Transaction</span><span>{app.averageTransaction}</span></div>
              <div className="admin-detail-row"><span>Currencies</span><span>{app.currencies.join(', ')}</span></div>
              <div className="admin-detail-row"><span>Processing History</span><span>{app.processingHistory}</span></div>
            </div>
          </Card>

          <Card title="KYC/KYB Status">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>Account Type</span><Badge variant="default">{app.accountType === 'business' ? 'Business (KYB)' : 'Individual (KYC)'}</Badge></div>
              <div className="admin-detail-row"><span>Verification Status</span><Badge variant={app.kycStatus === 'complete' ? 'success' : app.kycStatus === 'failed' ? 'danger' : 'warning'}>{app.kycStatus.replace('_', ' ')}</Badge></div>
              <div className="admin-detail-row"><span>Documents</span><span>{docsVerified} verified / {docsTotal} total</span></div>
              <div className="admin-detail-row"><span>Directors Verified</span><span>{directorsVerified} / {app.directors.length}</span></div>
              <div className="admin-detail-row"><span>Assigned Reviewer</span><span>{app.assignedTo || 'Unassigned'}</span></div>
            </div>
          </Card>

          <Card title="Application Meta">
            <div className="admin-detail-rows">
              <div className="admin-detail-row"><span>Application ID</span><span className="admin-mono">{app.id}</span></div>
              <div className="admin-detail-row"><span>Status</span><Badge variant={statusVariant(app.status)}>{statusLabel[app.status]}</Badge></div>
              <div className="admin-detail-row"><span>Risk Score</span><strong>{app.riskScore}/100</strong></div>
              <div className="admin-detail-row"><span>Submitted</span><span>{app.submittedAt}</span></div>
              <div className="admin-detail-row"><span>Last Updated</span><span>{app.lastUpdated}</span></div>
            </div>
          </Card>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        <>
          <div className="admin-stats-row" style={{ marginBottom: 20 }}>
            <StatCard label="Total Documents" value={docsTotal} />
            <StatCard label="Verified" value={docsVerified} changeType="positive" change={`${Math.round((docsVerified / docsTotal) * 100)}%`} />
            <StatCard label="Under Review" value={app.documents.filter(d => d.status === 'under_review').length} />
            <StatCard label="Missing" value={docsMissing} changeType={docsMissing > 0 ? 'negative' : 'positive'} change={docsMissing > 0 ? 'Action required' : 'Complete'} />
          </div>
          <Card padding="none">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Uploaded</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Reviewed By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {app.documents.map(doc => (
                    <tr key={doc.id}>
                      <td><strong>{doc.name}</strong></td>
                      <td className="admin-muted">{doc.type}</td>
                      <td>{doc.uploadedAt || <span className="admin-muted">—</span>}</td>
                      <td className="admin-muted">{doc.fileSize || '—'}</td>
                      <td><Badge variant={docStatusVariant(doc.status)}>{docStatusLabel[doc.status]}</Badge></td>
                      <td>{doc.reviewedBy || <span className="admin-muted">—</span>}</td>
                      <td>
                        <div className="admin-row-actions">
                          {doc.status !== 'missing' && (
                            <button className="admin-action-btn" title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            </button>
                          )}
                          {(doc.status === 'uploaded' || doc.status === 'under_review') && (
                            <>
                              <button className="admin-action-btn admin-action-btn--success" title="Verify">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                              </button>
                              <button className="admin-action-btn admin-action-btn--danger" title="Reject">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                              </button>
                            </>
                          )}
                          {doc.status === 'missing' && (
                            <button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Request</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Directors Tab */}
      {tab === 'directors' && (
        <div className="admin-directors-grid">
          {app.directors.map((dir, i) => (
            <Card key={i}>
              <div className="admin-director-card">
                <div className="admin-director-card__header">
                  <div className="admin-director-card__avatar">
                    {dir.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <strong>{dir.name}</strong>
                    <span className="admin-muted" style={{ display: 'block', fontSize: '0.78rem' }}>{dir.role}</span>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <Badge variant={dir.idVerified ? 'success' : 'warning'}>{dir.idVerified ? 'Verified' : 'Unverified'}</Badge>
                  </div>
                </div>
                <div className="admin-detail-rows" style={{ marginTop: 16 }}>
                  <div className="admin-detail-row"><span>Nationality</span><span>{dir.nationality}</span></div>
                  <div className="admin-detail-row"><span>Date of Birth</span><span>{dir.dob}</span></div>
                  <div className="admin-detail-row"><span>Ownership</span><strong>{dir.ownershipPercent}%</strong></div>
                  <div className="admin-detail-row"><span>PEP Screening</span><Badge variant={dir.pep ? 'danger' : 'success'}>{dir.pep ? 'PEP Match' : 'Clear'}</Badge></div>
                  <div className="admin-detail-row"><span>Sanctions Screening</span><Badge variant={dir.sanctions ? 'danger' : 'success'}>{dir.sanctions ? 'Match Found' : 'Clear'}</Badge></div>
                </div>
                {!dir.idVerified && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" style={{ flex: 1 }}>Request ID</button>
                    <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" style={{ flex: 1 }}>Verify</button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline Tab */}
      {tab === 'timeline' && (
        <Card title="Activity Timeline">
          <div className="admin-activity">
            {app.timeline.map((e, i) => (
              <div key={i} className="admin-activity__item">
                <div className="admin-activity__time">{e.time}</div>
                <div className="admin-activity__body">
                  <span className="admin-activity__event"><strong>{e.actor}</strong> — {e.event}</span>
                  <span className="admin-activity__detail">{e.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notes Tab */}
      {tab === 'notes' && (
        <>
          <Card>
            <div className="admin-notes-compose">
              <textarea
                className="admin-notes-textarea"
                placeholder="Add an internal note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </button>
              </div>
            </div>
          </Card>

          {app.notes.length === 0 ? (
            <div className="admin-empty" style={{ marginTop: 20 }}>No notes yet.</div>
          ) : (
            <div className="admin-notes-list">
              {app.notes.map((note, i) => (
                <Card key={i}>
                  <div className="admin-note">
                    <div className="admin-note__header">
                      <strong>{note.author}</strong>
                      <span className="admin-muted">{note.time}</span>
                    </div>
                    <p className="admin-note__text">{note.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Action Modals ── */}
      {activeModal && (
        <div className="admin-modal-overlay" onClick={() => { setActiveModal(null); setModalReason(''); setModalNote(''); setAssignee(''); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>

            {/* Approve Modal */}
            {activeModal === 'approve' && (
              <>
                <div className="admin-modal__header">
                  <div className="admin-modal__icon admin-modal__icon--success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3>Approve Application</h3>
                  <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="admin-modal__body">
                  <p className="admin-modal__text">
                    Approve <strong>{app.businessName}</strong> for merchant onboarding. This will trigger account activation and welcome communications.
                  </p>
                  <div className="admin-modal__field">
                    <label>Note (optional)</label>
                    <textarea
                      className="admin-notes-textarea"
                      placeholder="Add a note about this approval..."
                      value={modalNote}
                      onChange={(e) => setModalNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="admin-modal__footer">
                  <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={handleApprove}>Confirm Approval</button>
                </div>
              </>
            )}

            {/* Reject Modal */}
            {activeModal === 'reject' && (
              <>
                <div className="admin-modal__header">
                  <div className="admin-modal__icon admin-modal__icon--danger">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </div>
                  <h3>Reject Application</h3>
                  <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="admin-modal__body">
                  <p className="admin-modal__text">
                    Reject the application from <strong>{app.businessName}</strong>. The applicant will be notified with the reason provided.
                  </p>
                  <div className="admin-modal__field">
                    <label>Rejection Reason <span style={{ color: 'var(--hp-red)' }}>*</span></label>
                    <select className="admin-select" style={{ width: '100%', marginBottom: 12 }} value={modalReason} onChange={(e) => setModalReason(e.target.value)}>
                      <option value="">Select a reason...</option>
                      <option value="Incomplete documentation">Incomplete documentation</option>
                      <option value="Failed KYC/KYB verification">Failed KYC/KYB verification</option>
                      <option value="Unable to verify beneficial ownership">Unable to verify beneficial ownership</option>
                      <option value="Prohibited industry or activity">Prohibited industry or activity</option>
                      <option value="Sanctions or PEP match">Sanctions or PEP match</option>
                      <option value="Excessive risk profile">Excessive risk profile</option>
                      <option value="Fraudulent application">Fraudulent application</option>
                      <option value="Other">Other</option>
                    </select>
                    {modalReason === 'Other' && (
                      <textarea
                        className="admin-notes-textarea"
                        placeholder="Provide details..."
                        value={modalNote}
                        onChange={(e) => setModalNote(e.target.value)}
                        rows={2}
                      />
                    )}
                  </div>
                </div>
                <div className="admin-modal__footer">
                  <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm mtrx-btn--danger" onClick={handleReject} disabled={!modalReason.trim()}>Confirm Rejection</button>
                </div>
              </>
            )}

            {/* Request Info Modal */}
            {activeModal === 'request_info' && (
              <>
                <div className="admin-modal__header">
                  <div className="admin-modal__icon admin-modal__icon--info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </div>
                  <h3>Request Information</h3>
                  <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="admin-modal__body">
                  <p className="admin-modal__text">
                    Request additional information from <strong>{app.contactName}</strong> ({app.contactEmail}). They will receive an email with your message.
                  </p>
                  <div className="admin-modal__field">
                    <label>What do you need? <span style={{ color: 'var(--hp-red)' }}>*</span></label>
                    <textarea
                      className="admin-notes-textarea"
                      placeholder="e.g. Please provide your most recent bank statement and a copy of your AML policy..."
                      value={modalReason}
                      onChange={(e) => setModalReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <div className="admin-modal__footer">
                  <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={handleRequestInfo} disabled={!modalReason.trim()}>Send Request</button>
                </div>
              </>
            )}

            {/* Escalate Modal */}
            {activeModal === 'escalate' && (
              <>
                <div className="admin-modal__header">
                  <div className="admin-modal__icon admin-modal__icon--warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </div>
                  <h3>Escalate Application</h3>
                  <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="admin-modal__body">
                  <p className="admin-modal__text">
                    Escalate <strong>{app.businessName}</strong> for senior compliance review. This flags the application for higher-level assessment.
                  </p>
                  <div className="admin-modal__field">
                    <label>Escalation reason (optional)</label>
                    <textarea
                      className="admin-notes-textarea"
                      placeholder="Why is this being escalated?"
                      value={modalNote}
                      onChange={(e) => setModalNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="admin-modal__footer">
                  <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={handleEscalate}>Confirm Escalation</button>
                </div>
              </>
            )}

            {/* Assign Modal */}
            {activeModal === 'assign' && (
              <>
                <div className="admin-modal__header">
                  <div className="admin-modal__icon admin-modal__icon--info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                  </div>
                  <h3>Assign Reviewer</h3>
                  <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="admin-modal__body">
                  <p className="admin-modal__text">
                    Assign a compliance reviewer to <strong>{app.businessName}</strong>.
                  </p>
                  <div className="admin-modal__field">
                    <label>Reviewer <span style={{ color: 'var(--hp-red)' }}>*</span></label>
                    <select className="admin-select" style={{ width: '100%' }} value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                      <option value="">Select reviewer...</option>
                      <option value="James M.">James M. — Compliance Analyst</option>
                      <option value="Sarah K.">Sarah K. — Senior Compliance</option>
                      <option value="David R.">David R. — Head of Compliance</option>
                    </select>
                  </div>
                </div>
                <div className="admin-modal__footer">
                  <button className="mtrx-btn mtrx-btn--outline mtrx-btn--sm" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm" onClick={handleAssign} disabled={!assignee}>Assign</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
