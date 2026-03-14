const API_BASE = import.meta.env.VITE_API_BASE ?? '';

/* ── Helpers ── */

async function fetchJson<T>(path: string, fallback: T): Promise<{ data: T; live: boolean }> {
  if (!API_BASE) return { data: fallback, live: false };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data: T = await res.json();
    return { data, live: true };
  } catch {
    return { data: fallback, live: false };
  }
}

/* ── Types ── */

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  version?: string;
  uptime?: number;
}

export interface MeResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'merchant' | 'admin';
  kycStatus: string;
}

export type OnboardingStep =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

export interface OnboardingStatus {
  status: OnboardingStep;
  completedSteps: number;
  totalSteps: number;
  currentStep?: string;
}

/* ── Mock fallbacks ── */

const mockHealth: HealthStatus = { status: 'ok', version: '0.1.0' };

const mockMe: MeResponse = {
  id: 'usr_mock_001',
  email: 'test@mtrxpay.com',
  firstName: 'Demo',
  lastName: 'Merchant',
  role: 'merchant',
  kycStatus: 'approved',
};

const mockOnboarding: OnboardingStatus = {
  status: 'under_review',
  completedSteps: 4,
  totalSteps: 6,
  currentStep: 'Bank Verification',
};

/* ── Public API ── */

export async function getHealth() {
  return fetchJson<HealthStatus>('/api/health', mockHealth);
}

export async function getMe() {
  return fetchJson<MeResponse>('/api/me', mockMe);
}

export async function getOnboardingStatus() {
  return fetchJson<OnboardingStatus>('/api/onboarding/status', mockOnboarding);
}
