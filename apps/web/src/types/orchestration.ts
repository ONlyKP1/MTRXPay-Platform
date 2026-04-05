export type ProviderType = 'onramp' | 'offramp';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  regions: string[];
  currencies: string[];
  merchantCategories: string[];
  baseFee: number;
  successRate: number; // 0 to 100
  speedScore: number; // 0 to 100
  riskScore: number; // 0 to 100, lower is better
  status: 'active' | 'inactive';
}

export interface TransactionRequest {
  amount: number;
  currency: string;
  country: string;
  merchantCategory: string;
  type: ProviderType;
}

export interface ProviderOption {
  providerId: string;
  name: string;
  fee: number;
  score: number;
  speedLabel: string;
  recommended: boolean;
}

export interface OrchestrationResponse {
  recommended: {
    providerId: string;
    reason: string;
  } | null;
  options: ProviderOption[];
}
