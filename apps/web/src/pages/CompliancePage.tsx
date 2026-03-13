import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/common';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected' | 'required';
  uploadedAt?: string;
  expiresAt?: string;
  notes?: string;
}

const mockDocuments: Document[] = [
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

export function CompliancePage() {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [activeTab, setActiveTab] = useState<'documents' | 'checks'>('documents');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'complete':
        return 'status-success';
      case 'pending':
        return 'status-pending';
      case 'rejected':
      case 'action_required':
        return 'status-error';
      default:
        return 'status-required';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'complete':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        );
      case 'pending':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        );
      case 'rejected':
      case 'action_required':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        );
    }
  };

  const approvedCount = mockDocuments.filter(d => d.status === 'approved').length;
  const pendingCount = mockDocuments.filter(d => d.status === 'pending').length;
  const actionCount = mockDocuments.filter(d => d.status === 'rejected' || d.status === 'required').length;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-back" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Dashboard</span>
          </div>
          <img src="/logo.png" alt="MTRX Pay" className="dashboard-logo-img" />
        </header>

        <h1 className="page-title">Compliance Centre</h1>

        {/* Status Overview */}
        <div className="compliance-overview">
          <div className="compliance-status-card approved">
            <div className="status-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="status-info">
              <span className="status-count">{approvedCount}</span>
              <span className="status-label">Approved</span>
            </div>
          </div>
          <div className="compliance-status-card pending">
            <div className="status-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="status-info">
              <span className="status-count">{pendingCount}</span>
              <span className="status-label">Pending Review</span>
            </div>
          </div>
          <div className="compliance-status-card action">
            <div className="status-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="status-info">
              <span className="status-count">{actionCount}</span>
              <span className="status-label">Action Required</span>
            </div>
          </div>
        </div>

        {actionCount > 0 && (
          <Alert type="error">
            You have {actionCount} document(s) requiring attention. Please review and upload the required documents to maintain your account status.
          </Alert>
        )}

        {/* Tabs */}
        <div className="compliance-tabs">
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`tab-btn ${activeTab === 'checks' ? 'active' : ''}`}
            onClick={() => setActiveTab('checks')}
          >
            Compliance Checks
          </button>
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="compliance-section">
            <div className="section-header">
              <h3 className="section-title">Uploaded Documents</h3>
              <Button onClick={() => setShowUploadModal(true)}>
                Upload Document
              </Button>
            </div>
            <div className="documents-list">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className={`document-card ${doc.status}`}>
                  <div className="document-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="document-info">
                    <h4>{doc.name}</h4>
                    <span className="document-type">{doc.type}</span>
                    {doc.uploadedAt && <span className="document-date">Uploaded: {doc.uploadedAt}</span>}
                    {doc.expiresAt && <span className="document-expiry">Expires: {doc.expiresAt}</span>}
                    {doc.notes && <p className="document-notes">{doc.notes}</p>}
                  </div>
                  <div className={`document-status ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    <span>{doc.status === 'required' ? 'Upload Required' : doc.status}</span>
                  </div>
                  {(doc.status === 'rejected' || doc.status === 'required') && (
                    <Button variant="secondary" className="btn-small">
                      {doc.status === 'required' ? 'Upload' : 'Re-upload'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checks Tab */}
        {activeTab === 'checks' && (
          <div className="compliance-section">
            <div className="section-header">
              <h3 className="section-title">Verification Status</h3>
            </div>
            <div className="checks-list">
              {complianceChecks.map((check, index) => (
                <div key={index} className={`check-item ${check.status}`}>
                  <div className={`check-status ${getStatusColor(check.status)}`}>
                    {getStatusIcon(check.status)}
                  </div>
                  <div className="check-info">
                    <h4>{check.name}</h4>
                    {check.date && <span className="check-date">Completed: {check.date}</span>}
                    {check.status === 'action_required' && (
                      <span className="check-action">Action required - Please upload missing documents</span>
                    )}
                    {check.status === 'pending' && (
                      <span className="check-pending">Under review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload Document</h3>
                <button className="modal-close" onClick={() => setShowUploadModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Document Type</label>
                  <select className="form-select">
                    <option value="">Select document type...</option>
                    <option value="company">Company Document</option>
                    <option value="identity">Identity Document</option>
                    <option value="financial">Financial Document</option>
                    <option value="compliance">Compliance Document</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Document Name</label>
                  <input type="text" className="form-input" placeholder="e.g., Certificate of Incorporation" />
                </div>
                <div className="upload-area">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p>Drag and drop your file here, or click to browse</p>
                  <span>PDF, JPG, PNG up to 10MB</span>
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
