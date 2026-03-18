import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { MerchantsPage } from './pages/MerchantsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettlementsPage } from './pages/SettlementsPage';
import { RiskMonitorPage } from './pages/RiskMonitorPage';
import { AuditLogPage } from './pages/AuditLogPage';

export function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="settlements" element={<SettlementsPage />} />
        <Route path="risk" element={<RiskMonitorPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="audit-log" element={<AuditLogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
