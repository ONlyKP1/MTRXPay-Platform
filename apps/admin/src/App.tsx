import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { MerchantsPage } from './pages/MerchantsPage';
import { MerchantDetailPage } from './pages/MerchantDetailPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettlementsPage } from './pages/SettlementsPage';
import { RiskMonitorPage } from './pages/RiskMonitorPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { CommunicationsPage } from './pages/CommunicationsPage';
import { DisputesPage } from './pages/DisputesPage';
import { ReconciliationPage } from './pages/ReconciliationPage';
import { DeveloperPage } from './pages/DeveloperPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="hp-auth">
        <div className="hp-auth__loading">
          <img src="/logo.png" alt="MTRX PAY" className="hp-auth__loading-logo" />
          <div className="hp-auth__spinner" />
          <p className="hp-auth__loading-text">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isLoading && isAuthenticated ? <Navigate to="/" replace /> : <AdminLoginPage />
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="merchants/:merchantId" element={<MerchantDetailPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="communications" element={<CommunicationsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="settlements" element={<SettlementsPage />} />
        <Route path="disputes" element={<DisputesPage />} />
        <Route path="reconciliation" element={<ReconciliationPage />} />
        <Route path="risk" element={<RiskMonitorPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="audit-log" element={<AuditLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="developer" element={<DeveloperPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  );
}
