import type { Provider, TransactionRequest } from '../types/orchestration';

export function filterProviders(
  providers: Provider[],
  request: TransactionRequest
): Provider[] {
  return providers.filter((provider) => {
    return (
      provider.status === 'active' &&
      provider.type === request.type &&
      provider.regions.includes(request.country) &&
      provider.currencies.includes(request.currency) &&
      provider.merchantCategories.includes(request.merchantCategory)
    );
  });
}
