import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/common';

type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';

// Mock data - replace with real API data later
const mockBalances: Record<Currency, number> = {
  GBP: 124580.50,
  EUR: 145230.75,
  USD: 158420.00,
  AED: 582150.25,
};

const mockEscrowTotal: Record<Currency, number> = {
  GBP: 8700.50,
  EUR: 3200.00,
  USD: 5400.00,
  AED: 12500.00,
};

const mockMetrics = {
  totalProcessed: 1245890.00,
  currentAccount: 124580.50,
  nextScheduledPayment: 15420.00,
  nextPaymentDate: '2026-01-20',
  openChargebacks: 3,
  chargebackAmount: 2450.00,
};

const mockAlerts = [
  { id: 1, type: 'error' as const, message: 'Chargeback CB-2024-001 requires response by Jan 18, 2026' },
  { id: 2, type: 'info' as const, message: 'Scheduled payout of £15,420.00 on Jan 20, 2026' },
  { id: 3, type: 'success' as const, message: 'KYC verification approved' },
];

const mockTransactions = [
  { id: 'TXN-001', date: '2026-01-15', amount: 1250.00, currency: 'GBP', status: 'completed', customer: 'John Smith' },
  { id: 'TXN-002', date: '2026-01-15', amount: 890.50, currency: 'GBP', status: 'completed', customer: 'Emma Wilson' },
  { id: 'TXN-003', date: '2026-01-14', amount: 2100.00, currency: 'EUR', status: 'pending', customer: 'Hans Mueller' },
  { id: 'TXN-004', date: '2026-01-14', amount: 450.00, currency: 'GBP', status: 'completed', customer: 'Sarah Brown' },
  { id: 'TXN-005', date: '2026-01-13', amount: 3200.00, currency: 'USD', status: 'completed', customer: 'Mike Johnson' },
];

const mockMessages = [
  { id: 1, from: 'MTRX Support', subject: 'Welcome to MTRX Pay', preview: 'Thank you for joining MTRX Pay. Your account has been...', date: '2026-01-15', read: true },
  { id: 2, from: 'Compliance Team', subject: 'Document Request', preview: 'Please upload the following documents to complete your...', date: '2026-01-14', read: false },
  { id: 3, from: 'MTRX Support', subject: 'Payout Schedule Update', preview: 'Your payout schedule has been updated. Next payout...', date: '2026-01-12', read: true },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('GBP');
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: 'support', subject: '', body: '' });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    const symbols: Record<Currency, string> = { GBP: '£', EUR: '€', USD: '$', AED: 'د.إ' };
    return `${symbols[currency]}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
  };

  const handleSendMessage = () => {
    // Mock send - in real app would call API
    alert(`Message sent to ${newMessage.to}!`);
    setNewMessage({ to: 'support', subject: '', body: '' });
    setShowCompose(false);
  };

  const unreadCount = mockMessages.filter(m => !m.read).length;

  const getStatusBadge = () => {
    switch (user?.kycStatus) {
      case 'approved':
        return <span className="status-badge verified">Verified</span>;
      case 'pending':
        return <span className="status-badge pending">Pending Review</span>;
      case 'rejected':
        return <span className="status-badge rejected">Rejected</span>;
      default:
        return <span className="status-badge unverified">Not Started</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <img src="/logo.png" alt="MTRX Pay" className="dashboard-logo-img" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {getStatusBadge()}
            <Button variant="ghost" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </header>

        {/* Welcome */}
        <h1 className="dashboard-welcome">
          Welcome, {user?.firstName}
        </h1>

        {/* Main Balance Card */}
        <div className="balance-card">
          <div className="balance-header">
            <span className="balance-label">Available Balance</span>
            <div className="currency-selector">
              {(['GBP', 'EUR', 'USD', 'AED'] as Currency[]).map((currency) => (
                <button
                  key={currency}
                  className={`currency-btn ${selectedCurrency === currency ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency(currency)}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>
          <div className="balance-amount">
            {formatCurrency(mockBalances[selectedCurrency], selectedCurrency)}
          </div>
          <div className="balance-escrow">
            <span className="escrow-label">In Escrow (72hr hold):</span>
            <span className="escrow-value">{formatCurrency(mockEscrowTotal[selectedCurrency], selectedCurrency)}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <span className="metric-label">Total Processed</span>
              <span className="metric-value">{formatCurrency(mockMetrics.totalProcessed, selectedCurrency)}</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <span className="metric-label">Current Account</span>
              <span className="metric-value">{formatCurrency(mockMetrics.currentAccount, selectedCurrency)}</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <span className="metric-label">Next Scheduled Payment</span>
              <span className="metric-value">{formatCurrency(mockMetrics.nextScheduledPayment, selectedCurrency)}</span>
              <span className="metric-subtext">{mockMetrics.nextPaymentDate}</span>
            </div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <span className="metric-label">Open Chargebacks</span>
              <span className="metric-value">{mockMetrics.openChargebacks}</span>
              <span className="metric-subtext">{formatCurrency(mockMetrics.chargebackAmount, selectedCurrency)}</span>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="alerts-section">
          <h3 className="section-title">Alerts</h3>
          <div className="alerts-list">
            {mockAlerts.map((alert) => (
              <Alert key={alert.id} type={alert.type}>
                {alert.message}
              </Alert>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="quick-actions-grid">
          <div className="action-card" onClick={() => navigate('/transactions')}>
            <div className="action-icon">📋</div>
            <h4>Transaction Data</h4>
            <p>View all transactions, search and export</p>
          </div>
          <div className="action-card" onClick={() => navigate('/compliance')}>
            <div className="action-icon">🛡️</div>
            <h4>Compliance Centre</h4>
            <p>Manage compliance documents and status</p>
          </div>
          <div className="action-card" onClick={() => navigate('/help')}>
            <div className="action-icon">📚</div>
            <h4>Help & Guide</h4>
            <p>Documentation and developer API</p>
            <span className="action-badge">Dev API</span>
          </div>
          <div className="action-card" onClick={() => navigate('/trust')}>
            <div className="action-icon">⭐</div>
            <h4>Merchant Trust Level</h4>
            <p>Your current trust score and history</p>
            <div className="trust-level">
              <div className="trust-bar">
                <div className="trust-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="trust-score">85/100</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="section-header">
            <h3 className="section-title">Recent Transactions</h3>
            <button className="view-all-btn" onClick={() => navigate('/transactions')}>
              View All →
            </button>
          </div>
          <div className="transactions-table">
            <div className="table-header">
              <span>Transaction ID</span>
              <span>Date</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {mockTransactions.map((txn) => (
              <div key={txn.id} className="table-row">
                <span className="txn-id">{txn.id}</span>
                <span>{txn.date}</span>
                <span>{txn.customer}</span>
                <span>{formatCurrency(txn.amount, txn.currency as Currency)}</span>
                <span className={`txn-status ${txn.status}`}>{txn.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inbox Section */}
        <div className="inbox-section">
          <div className="section-header">
            <h3 className="section-title">
              Inbox
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </h3>
            <button className="compose-btn" onClick={() => setShowCompose(true)}>
              + Compose
            </button>
          </div>
          <div className="messages-list">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`message-item ${!msg.read ? 'unread' : ''}`}>
                <div className="message-indicator">{!msg.read && <span className="unread-dot"></span>}</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-from">{msg.from}</span>
                    <span className="message-date">{msg.date}</span>
                  </div>
                  <div className="message-subject">{msg.subject}</div>
                  <div className="message-preview">{msg.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="modal-overlay" onClick={() => setShowCompose(false)}>
            <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>New Message</h3>
                <button className="modal-close" onClick={() => setShowCompose(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>To</label>
                  <select
                    value={newMessage.to}
                    onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                    className="form-select"
                  >
                    <option value="support">MTRX Support</option>
                    <option value="compliance">Compliance Team</option>
                    <option value="finance">Finance Team</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    placeholder="Enter subject..."
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={newMessage.body}
                    onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                    placeholder="Write your message..."
                    className="form-textarea"
                    rows={6}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowCompose(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
