import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';

type Currency = 'GBP' | 'EUR' | 'USD' | 'AED';
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type TransactionType = 'payment' | 'payout' | 'refund' | 'chargeback';

interface Transaction {
  id: string;
  date: string;
  time: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  type: TransactionType;
  customer: string;
  email: string;
  reference: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2026-01-15', time: '14:32', amount: 1250.00, currency: 'GBP', status: 'completed', type: 'payment', customer: 'John Smith', email: 'john@example.com', reference: 'ORD-2024-001' },
  { id: 'TXN-002', date: '2026-01-15', time: '12:15', amount: 890.50, currency: 'GBP', status: 'completed', type: 'payment', customer: 'Emma Wilson', email: 'emma@example.com', reference: 'ORD-2024-002' },
  { id: 'TXN-003', date: '2026-01-14', time: '16:45', amount: 2100.00, currency: 'EUR', status: 'pending', type: 'payment', customer: 'Hans Mueller', email: 'hans@example.de', reference: 'ORD-2024-003' },
  { id: 'TXN-004', date: '2026-01-14', time: '11:20', amount: 450.00, currency: 'GBP', status: 'completed', type: 'payment', customer: 'Sarah Brown', email: 'sarah@example.com', reference: 'ORD-2024-004' },
  { id: 'TXN-005', date: '2026-01-13', time: '09:55', amount: 3200.00, currency: 'USD', status: 'completed', type: 'payment', customer: 'Mike Johnson', email: 'mike@example.com', reference: 'ORD-2024-005' },
  { id: 'TXN-006', date: '2026-01-13', time: '08:30', amount: 15420.00, currency: 'GBP', status: 'completed', type: 'payout', customer: 'MTRX Payout', email: '-', reference: 'PAY-2024-001' },
  { id: 'TXN-007', date: '2026-01-12', time: '15:10', amount: 175.00, currency: 'GBP', status: 'refunded', type: 'refund', customer: 'Alice Cooper', email: 'alice@example.com', reference: 'REF-2024-001' },
  { id: 'TXN-008', date: '2026-01-12', time: '10:00', amount: 520.00, currency: 'EUR', status: 'failed', type: 'payment', customer: 'Pierre Dubois', email: 'pierre@example.fr', reference: 'ORD-2024-006' },
  { id: 'TXN-009', date: '2026-01-11', time: '17:25', amount: 1850.00, currency: 'GBP', status: 'completed', type: 'payment', customer: 'David Lee', email: 'david@example.com', reference: 'ORD-2024-007' },
  { id: 'TXN-010', date: '2026-01-11', time: '14:00', amount: 2450.00, currency: 'GBP', status: 'completed', type: 'chargeback', customer: 'Disputed', email: '-', reference: 'CB-2024-001' },
];

export function TransactionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const formatCurrency = (amount: number, currency: Currency) => {
    const symbols: Record<Currency, string> = { GBP: '£', EUR: '€', USD: '$', AED: 'د.إ' };
    return `${symbols[currency]}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
  };

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = filteredTransactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

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

        <h1 className="page-title">Transaction Data</h1>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Transactions</span>
            <span className="summary-value">{filteredTransactions.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Completed Payments</span>
            <span className="summary-value">{formatCurrency(totalAmount, 'GBP')}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Pending</span>
            <span className="summary-value">{filteredTransactions.filter(t => t.status === 'pending').length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Failed</span>
            <span className="summary-value">{filteredTransactions.filter(t => t.status === 'failed').length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by ID, customer, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="payout">Payouts</option>
              <option value="refund">Refunds</option>
              <option value="chargeback">Chargebacks</option>
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="filter-date"
              placeholder="From"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="filter-date"
              placeholder="To"
            />
          </div>
          <Button variant="secondary">
            Export CSV
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="transactions-section">
          <div className="transactions-table full">
            <div className="table-header">
              <span>Transaction ID</span>
              <span>Date & Time</span>
              <span>Customer</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {filteredTransactions.map((txn) => (
              <div key={txn.id} className="table-row clickable">
                <span className="txn-id">{txn.id}</span>
                <span>
                  <div>{txn.date}</div>
                  <div className="txn-time">{txn.time}</div>
                </span>
                <span>
                  <div>{txn.customer}</div>
                  <div className="txn-email">{txn.email}</div>
                </span>
                <span className={`txn-type ${txn.type}`}>{txn.type}</span>
                <span className={txn.type === 'refund' || txn.type === 'chargeback' ? 'amount-negative' : ''}>
                  {txn.type === 'refund' || txn.type === 'chargeback' ? '-' : ''}
                  {formatCurrency(txn.amount, txn.currency)}
                </span>
                <span className={`txn-status ${txn.status}`}>{txn.status}</span>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="empty-state">
              <p>No transactions found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
