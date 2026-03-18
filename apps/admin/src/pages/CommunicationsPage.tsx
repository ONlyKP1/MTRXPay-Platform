import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

const mockTickets = [
  { id: 'TKT-301', merchant: 'TradeFX Pro', subject: 'Request to increase daily processing limit', priority: 'medium', created: '2026-03-18 10:15', lastReply: '2 hrs ago', status: 'open' },
  { id: 'TKT-300', merchant: 'BetKing International', subject: 'Webhook delivery failures — 502 errors', priority: 'high', created: '2026-03-17 16:40', lastReply: '5 hrs ago', status: 'open' },
  { id: 'TKT-299', merchant: 'CloudRetail UK', subject: 'Add EUR currency to account', priority: 'low', created: '2026-03-17 09:00', lastReply: '1 day ago', status: 'pending' },
  { id: 'TKT-298', merchant: 'Web3 Payments AG', subject: 'Clarification on compliance document request', priority: 'high', created: '2026-03-16 14:20', lastReply: '2 days ago', status: 'pending' },
  { id: 'TKT-297', merchant: 'LuxTravel Group', subject: 'Settlement delay — batch STL-4817', priority: 'medium', created: '2026-03-15 11:00', lastReply: '3 days ago', status: 'resolved' },
  { id: 'TKT-296', merchant: 'GreenLeaf Wellness', subject: 'API integration support — test environment', priority: 'low', created: '2026-03-14 09:30', lastReply: '4 days ago', status: 'resolved' },
];

const templates = [
  { name: 'Onboarding Welcome', description: 'Sent when a new merchant application is received. Includes next steps and expected timeline.', lastEdited: '2026-02-20' },
  { name: 'Application Approved', description: 'Sent when KYC/KYB review passes. Contains API credentials and integration guide link.', lastEdited: '2026-02-20' },
  { name: 'Application Rejected', description: 'Sent when merchant fails compliance checks. Includes reason and reapplication guidance.', lastEdited: '2026-02-20' },
  { name: 'Compliance Document Request', description: 'Request additional documents for ongoing monitoring or EDD. Lists required items and deadline.', lastEdited: '2026-03-01' },
  { name: 'Account Suspended', description: 'Notification of account suspension with reason, impact, and appeals process.', lastEdited: '2026-01-15' },
  { name: 'Settlement Notification', description: 'Daily/weekly settlement summary with amounts, fees, and expected arrival date.', lastEdited: '2026-03-10' },
  { name: 'Chargeback Alert', description: 'Notification of incoming chargeback with deadline and evidence requirements.', lastEdited: '2026-03-05' },
  { name: 'Tier Upgrade Notification', description: 'Congratulations on tier upgrade with new rate schedule and benefits.', lastEdited: '2026-02-01' },
];

const priorityVariant = (p: string) =>
  p === 'high' ? 'danger' as const :
  p === 'medium' ? 'warning' as const :
  'default' as const;

const statusVariant = (s: string) =>
  s === 'resolved' ? 'success' as const :
  s === 'open' ? 'danger' as const :
  'warning' as const;

type Tab = 'tickets' | 'templates';

export function CommunicationsPage() {
  const [tab, setTab] = useState<Tab>('tickets');

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Communications</h1>
          <p className="admin-page__subtitle">Merchant support tickets and email template management</p>
        </div>
        <div className="admin-page__actions">
          <button className="mtrx-btn mtrx-btn--primary mtrx-btn--sm">New Announcement</button>
        </div>
      </div>

      <div className="admin-filters">
        <button className={`admin-filter-btn${tab === 'tickets' ? ' admin-filter-btn--active' : ''}`} onClick={() => setTab('tickets')}>
          Support Tickets <span className="admin-filter-btn__count">{mockTickets.length}</span>
        </button>
        <button className={`admin-filter-btn${tab === 'templates' ? ' admin-filter-btn--active' : ''}`} onClick={() => setTab('templates')}>
          Email Templates <span className="admin-filter-btn__count">{templates.length}</span>
        </button>
      </div>

      {tab === 'tickets' && (
        <>
          <div className="admin-stats admin-stats--compact">
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Open Tickets</span>
              <span className="admin-stat-card__value">2</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Avg Response</span>
              <span className="admin-stat-card__value">3.2h</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">SLA Breaches</span>
              <span className="admin-stat-card__value admin-text--danger">1</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Resolved Today</span>
              <span className="admin-stat-card__value">4</span>
            </div>
          </div>

          <Card padding="none">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead><tr><th>Ticket ID</th><th>Merchant</th><th>Subject</th><th>Priority</th><th>Created</th><th>Last Reply</th><th>Status</th></tr></thead>
                <tbody>
                  {mockTickets.map(t => (
                    <tr key={t.id} className="mtrx-table__row--clickable">
                      <td className="admin-mono">{t.id}</td>
                      <td><strong>{t.merchant}</strong></td>
                      <td className="admin-desc-cell">{t.subject}</td>
                      <td><Badge variant={priorityVariant(t.priority)}>{t.priority}</Badge></td>
                      <td className="admin-muted">{t.created}</td>
                      <td className="admin-muted">{t.lastReply}</td>
                      <td><Badge variant={statusVariant(t.status)}>{t.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'templates' && (
        <div className="admin-report-grid">
          {templates.map(t => (
            <Card key={t.name}>
              <h3 className="admin-report-card__name">{t.name}</h3>
              <p className="admin-report-card__desc">{t.description}</p>
              <div className="admin-report-card__meta">
                <span className="admin-report-card__last">Edited: {t.lastEdited}</span>
              </div>
              <div className="admin-report-card__actions">
                <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Preview</button>
                <button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Edit</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
