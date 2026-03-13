import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { KYCProvider } from './context/KYCContext';
import { ThemeProvider } from './context/ThemeContext';
import { PasswordGate } from './components/PasswordGate';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { VerifySMSPage } from './pages/VerifySMSPage';
import { AccountTypePage } from './pages/AccountTypePage';
import { KYCIndividualPage } from './pages/KYCIndividualPage';
import { KYBPage } from './pages/KYBPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { IndustrySelectPage } from './pages/IndustrySelectPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CompliancePage } from './pages/CompliancePage';
import { HelpPage } from './pages/HelpPage';
import { TrustLevelPage } from './pages/TrustLevelPage';
import { MtrxWelcomePage } from './pages/MtrxWelcomePage';

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

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<MtrxWelcomePage />} />

      {/* Auth Routes - redirect to dashboard if logged in */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />

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
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <SubscriptionsPage />
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

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PasswordGate>
        <BrowserRouter>
          <AuthProvider>
            <KYCProvider>
              <AppRoutes />
            </KYCProvider>
          </AuthProvider>
        </BrowserRouter>
      </PasswordGate>
    </ThemeProvider>
  );
}

export default App;
