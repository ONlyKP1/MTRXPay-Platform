import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from '@mtrx/ui';

interface Merchant {
  id: string;
  name: string;
  industry: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  status: 'active' | 'suspended' | 'under_review' | 'churned';
  monthlyVolume: string;
  trustScore: number;
  chargebackRate: string;
  joinDate: string;
  lastActivity: string;
}

const mockMerchants: Merchant[] = [
  { id: 'MRC-1001', name: 'TradeFX Pro', industry: 'Forex & Trading', tier: 'Gold', status: 'active', monthlyVolume: '£1.8M', trustScore: 92, chargebackRate: '0.12%', joinDate: '2025-08-14', lastActivity: '2 min ago' },
  { id: 'MRC-1002', name: 'BetKing International', industry: 'Gaming & iGaming', tier: 'Platinum', status: 'active', monthlyVolume: '£4.2M', trustScore: 88, chargebackRate: '0.45%', joinDate: '2025-06-01', lastActivity: '5 min ago' },
  { id: 'MRC-1003', name: 'CloudRetail UK', industry: 'E-commerce & Retail', tier: 'Silver', status: 'active', monthlyVolume: '£95K', trustScore: 96, chargebackRate: '0.08%', joinDate: '2025-11-20', lastActivity: '1 hr ago' },
  { id: 'MRC-1004', name: 'VapeWorld Direct', industry: 'CBD & Cannabis', tier: 'Bronze', status: 'suspended', monthlyVolume: '£0', trustScore: 34, chargebackRate: '3.2%', joinDate: '2025-09-10', lastActivity: '14 days ago' },
  { id: 'MRC-1005', name: 'LuxTravel Group', industry: 'Travel & Tourism', tier: 'Gold', status: 'active', monthlyVolume: '£680K', trustScore: 91, chargebackRate: '0.15%', joinDate: '2025-07-22', lastActivity: '30 min ago' },
  { id: 'MRC-1006', name: 'Web3 Payments AG', industry: 'Cryptocurrency & Web3', tier: 'Silver', status: 'under_review', monthlyVolume: '£320K', trustScore: 67, chargebackRate: '0.89%', joinDate: '2025-12-01', lastActivity: '3 hrs ago' },
];

const tierClass = (t: string) =>
  t === 'Platinum' ? 'admin-tier--platinum' :
  t === 'Gold' ? 'admin-tier--gold' :
  t === 'Silver' ? 'admin-tier--silver' : 'admin-tier--bronze';

const statusVariant = (s: string) =>
  s === 'active' ? 'success' as const :
  s === 'suspended' ? 'danger' as const :
  s === 'under_review' ? 'warning' as const :
  'default' as const;

const trustColor = (score: number) =>
  score >= 80 ? 'admin-trust--high' :
  score >= 50 ? 'admin-trust--mid' : 'admin-trust--low';

export function MerchantsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = mockMerchants.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Merchants</h1>
          <p className="admin-page__subtitle">Manage active merchants, tiers, and compliance status</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-search"
          placeholder="Search merchants by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card padding="none">
        <div className="mtrx-table-wrap">
          <table className="mtrx-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Merchant</th>
                <th>Industry</th>
                <th>Tier</th>
                <th>Monthly Volume</th>
                <th>Trust Score</th>
                <th>Chargeback Rate</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="mtrx-table__row--clickable" onClick={() => navigate(`/merchants/${m.id}`)}>
                  <td className="admin-mono">{m.id}</td>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.industry}</td>
                  <td><span className={`admin-tier ${tierClass(m.tier)}`}>{m.tier}</span></td>
                  <td>{m.monthlyVolume}</td>
                  <td>
                    <div className="admin-trust-cell">
                      <div className="admin-trust-bar">
                        <div className={`admin-trust-fill ${trustColor(m.trustScore)}`} style={{ width: `${m.trustScore}%` }} />
                      </div>
                      <span className={trustColor(m.trustScore)}>{m.trustScore}</span>
                    </div>
                  </td>
                  <td>
                    <span className={parseFloat(m.chargebackRate) > 1 ? 'admin-text--danger' : ''}>
                      {m.chargebackRate}
                    </span>
                  </td>
                  <td className="admin-muted">{m.lastActivity}</td>
                  <td><Badge variant={statusVariant(m.status)}>{m.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
