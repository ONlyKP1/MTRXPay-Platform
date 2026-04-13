import { providers } from '../data/providers';
import type {
  OrchestrationResponse,
  ProviderOption,
  TransactionRequest,
} from '../types/orchestration';
import { filterProviders } from './filterProviders';
import { getSpeedLabel, scoreProvider } from './scoreProviders';

export function orchestrate(
  request: TransactionRequest
): OrchestrationResponse {
  const matchedProviders = filterProviders(providers, request);

  if (matchedProviders.length === 0) {
    return {
      recommended: null,
      options: [],
    };
  }

  const scoredOptions: ProviderOption[] = matchedProviders
    .map((provider) => ({
      providerId: provider.id,
      name: provider.name,
      fee: provider.baseFee,
      score: scoreProvider(provider),
      speedLabel: getSpeedLabel(provider.speedScore),
      recommended: false,
    }))
    .sort((a, b) => b.score - a.score);

  scoredOptions[0].recommended = true;

  return {
    recommended: {
      providerId: scoredOptions[0].providerId,
      reason: 'Best combination of fee, approval likelihood and speed',
    },
    options: scoredOptions,
  };
}
