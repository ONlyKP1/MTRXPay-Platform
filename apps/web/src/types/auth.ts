export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isKnownCustomer: boolean;
  kycStatus: KYCStatus;
  createdAt: string;
}

export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
