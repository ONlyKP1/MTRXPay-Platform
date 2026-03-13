export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CompanyDetails {
  name: string;
  registrationNumber: string;
  businessType: string;
  registeredAddress: Address;
  tradingAddress: Address;
  website?: string;
}

export interface Director {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  ownershipPercentage: number;
  address: Address;
}

export interface KYCData {
  company: CompanyDetails | null;
  directors: Director[];
  documentsUploaded: boolean;
  sumsubApplicantId?: string;
}

export type KYCStep = 'business-details' | 'directors' | 'documents' | 'verification';

export const BUSINESS_TYPES = [
  'Sole Trader',
  'Partnership',
  'Limited Company',
  'Limited Liability Partnership (LLP)',
  'Public Limited Company (PLC)',
  'Other',
] as const;

export const COUNTRIES = [
  'United Kingdom',
  'Ireland',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Other',
] as const;
