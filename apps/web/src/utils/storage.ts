import type { User } from '../types/auth';
import type { KYCData } from '../types/kyc';

const STORAGE_KEYS = {
  USER: 'mtrx_user',
  KYC_DATA: 'mtrx_kyc_data',
  KNOWN_CUSTOMERS: 'mtrx_known_customers',
} as const;

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getKYCData: (): KYCData | null => {
    const data = localStorage.getItem(STORAGE_KEYS.KYC_DATA);
    return data ? JSON.parse(data) : null;
  },

  setKYCData: (data: KYCData): void => {
    localStorage.setItem(STORAGE_KEYS.KYC_DATA, JSON.stringify(data));
  },

  removeKYCData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.KYC_DATA);
  },

  isKnownCustomer: (email: string): boolean => {
    const knownCustomers = localStorage.getItem(STORAGE_KEYS.KNOWN_CUSTOMERS);
    if (!knownCustomers) return false;
    const list: string[] = JSON.parse(knownCustomers);
    return list.includes(email.toLowerCase());
  },

  addKnownCustomer: (email: string): void => {
    const knownCustomers = localStorage.getItem(STORAGE_KEYS.KNOWN_CUSTOMERS);
    const list: string[] = knownCustomers ? JSON.parse(knownCustomers) : [];
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase());
      localStorage.setItem(STORAGE_KEYS.KNOWN_CUSTOMERS, JSON.stringify(list));
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.KYC_DATA);
  },
};
