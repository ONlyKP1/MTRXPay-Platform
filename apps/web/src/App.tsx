import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { KYCProvider } from './context/KYCContext';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { PublicLayout } from './components/layout/PublicLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { VerifySMSPage } from './pages/VerifySMSPage';
import { AccountTypePage } from './pages/AccountTypePage';
import { KYCIndividualPage } from './pages/KYCIndividualPage';
import { KYBPage } from './pages/KYBPage';
import { DashboardPage } from './pages/DashboardPage';
import { PayoutsPage } from './pages/SubscriptionsPage';
import { SubscriptionManagementPage } from './pages/SubscriptionManagementPage';
import { IndustrySelectPage } from './pages/IndustrySelectPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransactionDetailPage } from './pages/TransactionDetailPage';
import { BalancesPage } from './pages/BalancesPage';
import { SettingsPage } from './pages/SettingsPage';
import { CompliancePage } from './pages/CompliancePage';
import { HelpPage } from './pages/HelpPage';
import { TrustLevelPage } from './pages/TrustLevelPage';
import { MtrxWelcomePage } from './pages/MtrxWelcomePage';
import { PaymentTypesPage } from './pages/PaymentTypesPage';
import { ActivationSuccessPage } from './pages/ActivationSuccessPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-layout">
        <div style={{ textAlign: 'center' }}>
          <div className="auth-logo">MTRX</div>
          <p style={{ color: 'var(--text-light)', marginTop: '16px' }}>Loading...</p>
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
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
      <Route path="/technology" element={<PublicLayout><TechnologyPage /></PublicLayout>} />
      <Route path="/test" element={<MtrxWelcomePage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/verify-email"
        element={
          <ProtectedRoute>
            <VerifyEmailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-sms"
        element={
          <ProtectedRoute>
            <VerifySMSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account-type"
        element={
          <ProtectedRoute>
            <AccountTypePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry-select"
        element={
          <ProtectedRoute>
            <IndustrySelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KYCIndividualPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyb"
        element={
          <ProtectedRoute>
            <KYBPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activation-success"
        element={
          <ProtectedRoute>
            <ActivationSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payouts"
        element={
          <ProtectedRoute>
            <PayoutsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <SubscriptionManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-types"
        element={
          <ProtectedRoute>
            <PaymentTypesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/:id"
        element={
          <ProtectedRoute>
            <TransactionDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/compliance"
        element={
          <ProtectedRoute>
            <CompliancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trust"
        element={
          <ProtectedRoute>
            <TrustLevelPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/balances"
        element={
          <ProtectedRoute>
            <BalancesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <KYCProvider>
              <AppRoutes />
            </KYCProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
