import { Provider } from '../types/orchestration';

export function scoreProvider(provider: Provider): number {
  const feeScore = Math.max(0, 100 - provider.baseFee * 20);
  const successScore = provider.successRate;
  const speedScore = provider.speedScore;
  const riskScorePenalty = provider.riskScore;

  const total =
    feeScore * 0.3 +
    successScore * 0.4 +
    speedScore * 0.2 -
    riskScorePenalty * 0.1;

  return Math.round(total);
}

export function getSpeedLabel(speedScore: number): string {
  if (speedScore >= 90) return 'Instant';
  if (speedScore >= 75) return '5 mins';
  if (speedScore >= 60) return '15 mins';
  return 'Slower';
}
