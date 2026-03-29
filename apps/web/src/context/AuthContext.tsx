import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData, KYCStatus, MerchantStatus } from '../types/auth';
import { storage } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<boolean>;
  verifySMS: (code: string) => Promise<boolean>;
  updateKYCStatus: (status: KYCStatus) => void;
  updateMerchantStatus: (status: MerchantStatus) => void;
  checkIfKnownCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = storage.getUser();
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Mock login - in real app, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const existingUser = storage.getUser();
    if (existingUser && existingUser.email === credentials.email) {
      setState({
        user: existingUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    // For demo, create a user on login if they registered before
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      emailVerified: false,
      phoneVerified: false,
      isKnownCustomer: storage.isKnownCustomer(data.email),
      kycStatus: 'not_started',
      merchantStatus: 'draft',
      createdAt: new Date().toISOString(),
    };

    storage.setUser(newUser);
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  };

  const logout = () => {
    storage.removeUser();
    storage.removeKYCData();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    // Mock verification - accept any 6-digit code
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (code.length === 6 && state.user) {
      const updatedUser = { ...state.user, emailVerified: true };
      storage.setUser(updatedUser);
      setState((prev) => ({ ...prev, user: updatedUser }));
      return true;
    }
    return false;
  };

  const verifySMS = async (code: string): Promise<boolean> => {
    // Mock verification - accept any 6-digit code
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (code.length === 6 && state.user) {
      const updatedUser = { ...state.user, phoneVerified: true };
      storage.setUser(updatedUser);
      storage.addKnownCustomer(state.user.email);
      setState((prev) => ({ ...prev, user: updatedUser }));
      return true;
    }
    return false;
  };

  const updateKYCStatus = (status: KYCStatus) => {
    if (state.user) {
      const updatedUser = { ...state.user, kycStatus: status };
      storage.setUser(updatedUser);
      setState((prev) => ({ ...prev, user: updatedUser }));
    }
  };

  const updateMerchantStatus = (status: MerchantStatus) => {
    if (state.user) {
      const updatedUser = { ...state.user, merchantStatus: status };
      storage.setUser(updatedUser);
      setState((prev) => ({ ...prev, user: updatedUser }));
    }
  };

  const checkIfKnownCustomer = (): boolean => {
    if (state.user) {
      return storage.isKnownCustomer(state.user.email);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        verifyEmail,
        verifySMS,
        updateKYCStatus,
        updateMerchantStatus,
        checkIfKnownCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
