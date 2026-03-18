import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'compliance_officer' | 'finance' | 'support';
  lastLogin: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'mtrx_admin_user';

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as AdminUser;
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));

    // Demo credentials
    if (email === 'admin@mtrxpay.com' && password === 'admin123') {
      const user: AdminUser = {
        id: 'admin-001',
        email: 'admin@mtrxpay.com',
        firstName: 'System',
        lastName: 'Admin',
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    if (email === 'compliance@mtrxpay.com' && password === 'admin123') {
      const user: AdminUser = {
        id: 'admin-002',
        email: 'compliance@mtrxpay.com',
        firstName: 'James',
        lastName: 'Mitchell',
        role: 'compliance_officer',
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AdminAuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
