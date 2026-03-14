import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface ComplianceDoc {
  id: string;
  name: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected' | 'required';
  uploadedAt?: string;
  expiresAt?: string;
  notes?: string;
}

const mockDocuments: ComplianceDoc[] = [
  { id: 'DOC-001', name: 'Certificate of Incorporation', type: 'company', status: 'approved', uploadedAt: '2026-01-10', expiresAt: '2027-01-10' },
  { id: 'DOC-002', name: 'Proof of Address (Business)', type: 'company', status: 'approved', uploadedAt: '2026-01-10' },
  { id: 'DOC-003', name: 'Director ID - John Smith', type: 'identity', status: 'approved', uploadedAt: '2026-01-10', expiresAt: '2031-05-15' },
  { id: 'DOC-004', name: 'Bank Statement', type: 'financial', status: 'pending', uploadedAt: '2026-01-14', notes: 'Under review - expect response within 24 hours' },
  { id: 'DOC-005', name: 'Processing History', type: 'financial', status: 'required', notes: 'Please upload 3 months of processing statements' },
  { id: 'DOC-006', name: 'AML Policy Document', type: 'compliance', status: 'rejected', uploadedAt: '2026-01-12', notes: 'Document is outdated. Please upload current version.' },
];

const complianceChecks = [
  { name: 'KYB Verification', status: 'complete', date: '2026-01-10' },
  { name: 'Director Verification', status: 'complete', date: '2026-01-10' },
  { name: 'Bank Account Verification', status: 'pending', date: null },
  { name: 'AML Policy Review', status: 'action_required', date: null },
  { name: 'Website Compliance Check', status: 'complete', date: '2026-01-11' },
];

const statusIcons = {
  approved: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  pending: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  rejected: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  required: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};

export function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'checks'>('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const approvedCount = mockDocuments.filter(d => d.status === 'approved').length;
  const pendingCount = mockDocuments.filter(d => d.status === 'pending').length;
  const actionCount = mockDocuments.filter(d => d.status === 'rejected' || d.status === 'required').length;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved': case 'complete': return 'completed';
      case 'pending': return 'pending';
      case 'rejected': case 'action_required': return 'failed';
      default: return 'pending';
    }
  };

  const getIcon = (status: string) => {
    if (status === 'complete') return statusIcons.approved;
    if (status === 'action_required') return statusIcons.rejected;
    return statusIcons[status as keyof typeof statusIcons] || statusIcons.required;
  };

  return (
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Compliance Centre</h1>
      </div>

      {/* Status Overview */}
      <div className="hp-dash__metrics" style={{ marginBottom: 24 }}>
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon" style={{ color: 'var(--hp-green)' }}>
            {statusIcons.approved}
          </div>
          <span className="hp-dash__metric-label">Approved</span>
          <span className="hp-dash__metric-value" style={{ color: 'var(--hp-green)' }}>{approvedCount}</span>
        </div>
        <div className="hp-dash__metric-card">
          <div className="hp-dash__metric-icon">
            {statusIcons.pending}
          </div>
          <span className="hp-dash__metric-label">Pending Review</span>
          <span className="hp-dash__metric-value">{pendingCount}</span>
        </div>
        <div className="hp-dash__metric-card hp-dash__metric-card--warn">
          <div className="hp-dash__metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span className="hp-dash__metric-label">Action Required</span>
          <span className="hp-dash__metric-value">{actionCount}</span>
        </div>
      </div>

      {actionCount > 0 && (
        <div className="hp-dash__alert hp-dash__alert--error" style={{ marginBottom: 24 }}>
          <span className="hp-dash__alert-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <span>You have {actionCount} document(s) requiring attention. Please review and upload the required documents.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="hp-dash__tabs">
        <button className={`hp-dash__tab${activeTab === 'documents' ? ' hp-dash__tab--active' : ''}`} onClick={() => setActiveTab('documents')}>Documents</button>
        <button className={`hp-dash__tab${activeTab === 'checks' ? ' hp-dash__tab--active' : ''}`} onClick={() => setActiveTab('checks')}>Compliance Checks</button>
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <section>
          <div className="hp-dash__section-header" style={{ marginBottom: 20 }}>
            <span className="hp-dash__section-label">Uploaded Documents</span>
            <button className="hp-dash__btn-gold" onClick={() => setShowUploadModal(true)}>Upload Document</button>
          </div>
          <div className="hp-dash__doc-list">
            {mockDocuments.map((doc) => (
              <div key={doc.id} className="hp-dash__doc-card">
                <div className="hp-dash__doc-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="hp-dash__doc-info">
                  <h4 className="hp-dash__doc-name">{doc.name}</h4>
                  <span className="hp-dash__doc-type">{doc.type}</span>
                  {doc.uploadedAt && <span className="hp-dash__text-muted">Uploaded: {doc.uploadedAt}</span>}
                  {doc.expiresAt && <span className="hp-dash__text-muted">Expires: {doc.expiresAt}</span>}
                  {doc.notes && <p className="hp-dash__doc-notes">{doc.notes}</p>}
                </div>
                <span className={`hp-dash__status hp-dash__status--${getStatusClass(doc.status)}`}>
                  {getIcon(doc.status)}
                  <span>{doc.status === 'required' ? 'Upload Required' : doc.status}</span>
                </span>
                {(doc.status === 'rejected' || doc.status === 'required') && (
                  <button className="hp-dash__btn-outline hp-dash__btn-sm">
                    {doc.status === 'required' ? 'Upload' : 'Re-upload'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Checks Tab */}
      {activeTab === 'checks' && (
        <section>
          <span className="hp-dash__section-label" style={{ marginBottom: 20, display: 'inline-flex' }}>Verification Status</span>
          <div className="hp-dash__check-list">
            {complianceChecks.map((check, i) => (
              <div key={i} className="hp-dash__check-item">
                <span className={`hp-dash__check-icon hp-dash__check-icon--${getStatusClass(check.status)}`}>
                  {getIcon(check.status)}
                </span>
                <div className="hp-dash__check-info">
                  <h4>{check.name}</h4>
                  {check.date && <span className="hp-dash__text-muted">Completed: {check.date}</span>}
                  {check.status === 'action_required' && <span className="hp-dash__text-red">Action required - Please upload missing documents</span>}
                  {check.status === 'pending' && <span className="hp-dash__text-gold">Under review</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="hp-dash__modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="hp-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dash__modal-header">
              <h3>Upload Document</h3>
              <button className="hp-dash__modal-close" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <div className="hp-dash__modal-body">
              <div className="hp-dash__field">
                <label>Document Type</label>
                <select>
                  <option value="">Select document type...</option>
                  <option value="company">Company Document</option>
                  <option value="identity">Identity Document</option>
                  <option value="financial">Financial Document</option>
                  <option value="compliance">Compliance Document</option>
                </select>
              </div>
              <div className="hp-dash__field">
                <label>Document Name</label>
                <input type="text" placeholder="e.g., Certificate of Incorporation" />
              </div>
              <div className="hp-dash__upload-area">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p>Drag and drop your file here, or click to browse</p>
                <span>PDF, JPG, PNG up to 10MB</span>
              </div>
            </div>
            <div className="hp-dash__modal-footer">
              <button className="hp-dash__modal-cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="hp-dash__modal-send">Upload</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
