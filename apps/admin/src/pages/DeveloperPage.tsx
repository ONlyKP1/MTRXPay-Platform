import { useState } from 'react';
import { Card, Badge } from '@mtrx/ui';

const apiKeys = [
  { name: 'Production — BetKing International', env: 'live', key: 'sk_live_9f3a...b7e1', created: '2025-06-01', lastUsed: '2 min ago', status: 'active' },
  { name: 'Production — TradeFX Pro', env: 'live', key: 'sk_live_2d8c...a3f2', created: '2025-08-14', lastUsed: '5 min ago', status: 'active' },
  { name: 'Production — CloudRetail UK', env: 'live', key: 'sk_live_7e1b...c9d4', created: '2025-11-20', lastUsed: '1 hr ago', status: 'active' },
  { name: 'Production — VapeWorld Direct', env: 'live', key: 'sk_live_4f9a...d2a8', created: '2025-09-10', lastUsed: '14 days ago', status: 'revoked' },
  { name: 'Test — BetKing International', env: 'test', key: 'sk_test_8b2e...x4m7', created: '2025-06-01', lastUsed: '3 hrs ago', status: 'active' },
  { name: 'Test — TradeFX Pro', env: 'test', key: 'sk_test_1c7d...y9n3', created: '2025-08-14', lastUsed: '2 days ago', status: 'active' },
];

const webhookLogs = [
  { id: 'EVT-29481', type: 'payment.completed', endpoint: 'api.betking.mt/payments/webhook', responseCode: 200, status: 'delivered', timestamp: '2026-03-18 14:22:01', attempts: 1 },
  { id: 'EVT-29480', type: 'payment.completed', endpoint: 'api.tradefxpro.com/webhooks/mtrx', responseCode: 200, status: 'delivered', timestamp: '2026-03-18 14:18:45', attempts: 1 },
  { id: 'EVT-29479', type: 'dispute.opened', endpoint: 'api.betking.mt/payments/webhook', responseCode: 200, status: 'delivered', timestamp: '2026-03-18 14:15:30', attempts: 1 },
  { id: 'EVT-29478', type: 'settlement.processed', endpoint: 'cloudretail.co.uk/api/mtrx', responseCode: 502, status: 'failed', timestamp: '2026-03-18 14:12:00', attempts: 3 },
  { id: 'EVT-29477', type: 'payment.failed', endpoint: 'web3pay.ch/hooks/mtrx', responseCode: 200, status: 'delivered', timestamp: '2026-03-18 13:55:12', attempts: 1 },
  { id: 'EVT-29476', type: 'merchant.updated', endpoint: 'api.luxtravel.ae/mtrx/events', responseCode: 0, status: 'retrying', timestamp: '2026-03-18 13:40:00', attempts: 2 },
  { id: 'EVT-29475', type: 'payout.completed', endpoint: 'api.tradefxpro.com/webhooks/mtrx', responseCode: 200, status: 'delivered', timestamp: '2026-03-18 13:32:18', attempts: 1 },
];

const sandboxEvents = [
  { type: 'payment.completed', description: 'Simulate a successful card payment' },
  { type: 'payment.failed', description: 'Simulate a declined card payment' },
  { type: 'dispute.opened', description: 'Simulate an incoming chargeback' },
  { type: 'settlement.processed', description: 'Simulate a settlement batch release' },
  { type: 'merchant.suspended', description: 'Simulate account suspension webhook' },
  { type: 'payout.completed', description: 'Simulate a payout to merchant bank' },
];

const testCards = [
  { number: '4242 4242 4242 4242', brand: 'Visa', result: 'Success' },
  { number: '4000 0000 0000 0002', brand: 'Visa', result: 'Declined' },
  { number: '5555 5555 5555 4444', brand: 'Mastercard', result: 'Success' },
  { number: '4000 0000 0000 9995', brand: 'Visa', result: 'Insufficient funds' },
  { number: '4000 0000 0000 3220', brand: 'Visa', result: '3DS required' },
];

type Tab = 'api-keys' | 'webhooks' | 'sandbox';

export function DeveloperPage() {
  const [tab, setTab] = useState<Tab>('api-keys');

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Developer Tools</h1>
          <p className="admin-page__subtitle">API key management, webhook monitoring, and sandbox environment</p>
        </div>
      </div>

      <div className="admin-filters">
        {([['api-keys', 'API Keys'], ['webhooks', 'Webhook Logs'], ['sandbox', 'Sandbox']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} className={`admin-filter-btn${tab === key ? ' admin-filter-btn--active' : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'api-keys' && (
        <Card padding="none">
          <div className="mtrx-table-wrap">
            <table className="mtrx-table">
              <thead><tr><th>Key Name</th><th>Environment</th><th>Key</th><th>Created</th><th>Last Used</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {apiKeys.map(k => (
                  <tr key={k.key}>
                    <td><strong>{k.name}</strong></td>
                    <td><Badge variant={k.env === 'live' ? 'danger' : 'info'}>{k.env}</Badge></td>
                    <td className="admin-mono">{k.key}</td>
                    <td className="admin-muted">{k.created}</td>
                    <td className="admin-muted">{k.lastUsed}</td>
                    <td><Badge variant={k.status === 'active' ? 'success' : 'danger'}>{k.status}</Badge></td>
                    <td>
                      {k.status === 'active' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="mtrx-btn mtrx-btn--ghost mtrx-btn--sm">Rotate</button>
                          <button className="mtrx-btn mtrx-btn--danger mtrx-btn--sm">Revoke</button>
                        </div>
                      ) : (
                        <span className="admin-muted">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'webhooks' && (
        <>
          <div className="admin-stats admin-stats--compact">
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Delivery Rate (24h)</span>
              <span className="admin-stat-card__value">98.4%</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Failed (24h)</span>
              <span className="admin-stat-card__value admin-text--danger">3</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Avg Latency</span>
              <span className="admin-stat-card__value">142ms</span>
            </div>
            <div className="admin-stat-card admin-stat-card--sm">
              <span className="admin-stat-card__label">Total Events (24h)</span>
              <span className="admin-stat-card__value">1,847</span>
            </div>
          </div>

          <Card padding="none">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead><tr><th>Event ID</th><th>Type</th><th>Endpoint</th><th>Response</th><th>Status</th><th>Timestamp</th><th>Attempts</th></tr></thead>
                <tbody>
                  {webhookLogs.map(w => (
                    <tr key={w.id} className={w.status === 'failed' ? 'admin-row--critical' : ''}>
                      <td className="admin-mono">{w.id}</td>
                      <td><Badge variant="default">{w.type}</Badge></td>
                      <td className="admin-mono admin-desc-cell" style={{ fontSize: '0.72rem' }}>{w.endpoint}</td>
                      <td>
                        <span className={w.responseCode >= 200 && w.responseCode < 300 ? '' : 'admin-text--danger'}>
                          {w.responseCode || '—'}
                        </span>
                      </td>
                      <td><Badge variant={w.status === 'delivered' ? 'success' : w.status === 'retrying' ? 'warning' : 'danger'}>{w.status}</Badge></td>
                      <td className="admin-muted">{w.timestamp}</td>
                      <td>{w.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'sandbox' && (
        <div className="admin-grid-2">
          <Card title="Test Card Numbers">
            <div className="mtrx-table-wrap">
              <table className="mtrx-table">
                <thead><tr><th>Card Number</th><th>Brand</th><th>Result</th></tr></thead>
                <tbody>
                  {testCards.map(c => (
                    <tr key={c.number}>
                      <td className="admin-mono">{c.number}</td>
                      <td>{c.brand}</td>
                      <td><Badge variant={c.result === 'Success' ? 'success' : c.result === 'Declined' ? 'danger' : 'warning'}>{c.result}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Trigger Test Event">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sandboxEvents.map(e => (
                <div key={e.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--hp-border)' }}>
                  <div>
                    <div className="admin-mono" style={{ marginBottom: 2 }}>{e.type}</div>
                    <div className="admin-muted" style={{ fontSize: '0.75rem' }}>{e.description}</div>
                  </div>
                  <button className="mtrx-btn mtrx-btn--secondary mtrx-btn--sm">Fire</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
