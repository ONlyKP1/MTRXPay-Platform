import type { User } from './auth';
import type { CompanyDetails, Director } from './kyc';

export interface Merchant extends User {
  company: CompanyDetails | null;
  directors: Director[];
}

export interface MerchantProfile {
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  businessDetails: CompanyDetails | null;
  verificationStatus: {
    email: boolean;
    phone: boolean;
    kyc: 'not_started' | 'pending' | 'approved' | 'rejected';
  };
}
