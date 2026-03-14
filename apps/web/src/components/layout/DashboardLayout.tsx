import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Inline SVG Icons ── */
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  transactions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
  compliance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  payouts: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5z" /><path d="M16 12a1 1 0 102 0 1 1 0 00-2 0z" />
    </svg>
  ),
  subscriptions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  trust: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  paymentTypes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  signOut: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const navItems = [
  { label: 'Dashboard', icon: icons.dashboard, to: '/dashboard' },
  { label: 'Transactions', icon: icons.transactions, to: '/transactions' },
  { label: 'Payment Types', icon: icons.paymentTypes, to: '/payment-types' },
  { label: 'Payouts', icon: icons.payouts, to: '/payouts' },
  { label: 'Subscriptions', icon: icons.subscriptions, to: '/subscriptions' },
  { label: 'Compliance', icon: icons.compliance, to: '/compliance' },
  { label: 'Trust Level', icon: icons.trust, to: '/trust' },
  { label: 'Help', icon: icons.help, to: '/help' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getKycBadge = () => {
    switch (user?.kycStatus) {
      case 'approved':
        return <span className="hp-dash__kyc-badge hp-dash__kyc-badge--verified">Verified</span>;
      case 'pending':
        return <span className="hp-dash__kyc-badge hp-dash__kyc-badge--pending">Pending</span>;
      case 'rejected':
        return <span className="hp-dash__kyc-badge hp-dash__kyc-badge--rejected">Rejected</span>;
      default:
        return <span className="hp-dash__kyc-badge">Not Started</span>;
    }
  };

  return (
    <div className="hp-dash">
      {/* Mobile hamburger */}
      <button className="hp-dash__burger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
        {sidebarOpen ? icons.close : icons.menu}
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="hp-dash__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`hp-dash__sidebar${sidebarOpen ? ' hp-dash__sidebar--open' : ''}`}>
        <div className="hp-dash__sidebar-top">
          <Link to="/" className="hp-dash__logo">
            <img src="/logo.png" alt="MTRX PAY" />
          </Link>
          <nav className="hp-dash__nav">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`hp-dash__nav-item${location.pathname === item.to ? ' hp-dash__nav-item--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="hp-dash__sidebar-bottom">
          <div className="hp-dash__user">
            <div className="hp-dash__user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="hp-dash__user-info">
              <span className="hp-dash__user-name">{user?.firstName} {user?.lastName}</span>
              <span className="hp-dash__user-email">{user?.email}</span>
            </div>
            {getKycBadge()}
          </div>
          <button className="hp-dash__sign-out" onClick={handleLogout}>
            {icons.signOut}
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="hp-dash__main">
        <div className="hp-dash__video-bg">
          <video
            src="/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="hp-dash__video"
          />
          <div className="hp-dash__video-overlay" />
        </div>
        <div className="hp-dash__content">
          {children}
        </div>
      </main>
    </div>
  );
}
