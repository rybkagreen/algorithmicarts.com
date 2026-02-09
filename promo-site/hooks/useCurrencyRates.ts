'use client';

import useSWR from 'swr';
import { CurrencyData, CurrencyRate } from '@/types/demos';

interface UseCurrencyRatesResult {
  data: CurrencyData | undefined;
  error: any;
  isLoading: boolean;
  mutate: () => void;
}

// Fetcher function for SWR
async function fetchCurrencyRates(baseCurrency: string = 'USD'): Promise<CurrencyData> {
  // For now, we'll use the service to fetch data
  // In a real implementation, we would fetch from our API route and parse the XML
  const { fetchCurrencyData } = await import('@/lib/currency-service');
  return fetchCurrencyData(baseCurrency);
}

export function useCurrencyRates(baseCurrency: string = 'USD'): UseCurrencyRatesResult {
  const { data, error, mutate } = useSWR(
    ['currency-rates', baseCurrency],
    () => fetchCurrencyRates(baseCurrency),
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
    }
  );

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  };
}
