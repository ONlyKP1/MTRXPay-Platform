import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

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
    <DashboardLayout>
      <div className="hp-dash__page-header">
        <h1 className="hp-dash__page-title">Transaction Data</h1>
      </div>

      {/* Summary Cards */}
      <div className="hp-dash__metrics">
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Total Transactions</span>
          <span className="hp-dash__metric-value">{filteredTransactions.length}</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Completed Payments</span>
          <span className="hp-dash__metric-value">{formatCurrency(totalAmount, 'GBP')}</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Pending</span>
          <span className="hp-dash__metric-value">{filteredTransactions.filter(t => t.status === 'pending').length}</span>
        </div>
        <div className="hp-dash__metric-card">
          <span className="hp-dash__metric-label">Failed</span>
          <span className="hp-dash__metric-value">{filteredTransactions.filter(t => t.status === 'failed').length}</span>
        </div>
      </div>

      {/* Filters */}
      <section className="hp-dash__filters">
        <div className="hp-dash__search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, customer, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hp-dash__search-input"
          />
        </div>
        <div className="hp-dash__filter-row">
          <div className="hp-dash__field hp-dash__field--inline">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="hp-dash__field hp-dash__field--inline">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}>
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="payout">Payouts</option>
              <option value="refund">Refunds</option>
              <option value="chargeback">Chargebacks</option>
            </select>
          </div>
          <div className="hp-dash__field hp-dash__field--inline">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="hp-dash__field hp-dash__field--inline">
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button className="hp-dash__btn-outline">Export CSV</button>
        </div>
      </section>

      {/* Transactions Table */}
      <section className="hp-dash__transactions">
        <div className="hp-dash__table-wrap">
          <table className="hp-dash__table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="hp-dash__txn-id">{txn.id}</td>
                  <td>
                    <div>{txn.date}</div>
                    <div className="hp-dash__text-muted">{txn.time}</div>
                  </td>
                  <td>
                    <div>{txn.customer}</div>
                    <div className="hp-dash__text-muted">{txn.email}</div>
                  </td>
                  <td><span className={`hp-dash__type-badge hp-dash__type-badge--${txn.type}`}>{txn.type}</span></td>
                  <td className={txn.type === 'refund' || txn.type === 'chargeback' ? 'hp-dash__text-red' : ''}>
                    {txn.type === 'refund' || txn.type === 'chargeback' ? '-' : ''}
                    {formatCurrency(txn.amount, txn.currency)}
                  </td>
                  <td><span className={`hp-dash__status hp-dash__status--${txn.status}`}>{txn.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="hp-dash__empty">
            <p>No transactions found matching your filters.</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
