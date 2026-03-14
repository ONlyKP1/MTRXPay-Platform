import { useQuery } from '@tanstack/react-query';
import { getHealth, getMe, getOnboardingStatus } from '../services/api';
import type { HealthStatus, MeResponse, OnboardingStatus } from '../services/api';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60_000,
  });
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboarding'],
    queryFn: getOnboardingStatus,
    staleTime: 60_000,
  });
}

export type { HealthStatus, MeResponse, OnboardingStatus };
