import { useState, useEffect, useCallback } from 'react';
import type { CurrencyData } from '../types';

interface UseCurrencyRatesOptions {
  baseCurrency?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseCurrencyRatesReturn {
  data: CurrencyData | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
}

// Mock currency data for demo purposes
const MOCK_CURRENCY_DATA: Record<string, CurrencyData> = {
  RUB: {
    base: 'RUB',
    rates: [
      { code: 'USD', name: 'US Dollar', rate: 96.5, change24h: 0.23 },
      { code: 'EUR', name: 'Euro', rate: 105.2, change24h: -0.15 },
      { code: 'GBP', name: 'British Pound', rate: 123.4, change24h: 0.42 },
      { code: 'JPY', name: 'Japanese Yen', rate: 0.62, change24h: 0.05 },
      { code: 'CNY', name: 'Chinese Yuan', rate: 13.6, change24h: -0.08 },
    ],
    lastUpdate: Date.now(),
  },
  USD: {
    base: 'USD',
    rates: [
      { code: 'RUB', name: 'Russian Ruble', rate: 0.0104, change24h: -0.23 },
      { code: 'EUR', name: 'Euro', rate: 0.87, change24h: -0.38 },
      { code: 'GBP', name: 'British Pound', rate: 1.27, change24h: 0.19 },
      { code: 'JPY', name: 'Japanese Yen', rate: 155.6, change24h: 0.15 },
      { code: 'CNY', name: 'Chinese Yuan', rate: 7.2, change24h: 0.12 },
    ],
    lastUpdate: Date.now(),
  },
  EUR: {
    base: 'EUR',
    rates: [
      { code: 'RUB', name: 'Russian Ruble', rate: 0.0095, change24h: 0.15 },
      { code: 'USD', name: 'US Dollar', rate: 1.15, change24h: 0.38 },
      { code: 'GBP', name: 'British Pound', rate: 1.46, change24h: 0.57 },
      { code: 'JPY', name: 'Japanese Yen', rate: 178.2, change24h: 0.53 },
      { code: 'CNY', name: 'Chinese Yuan', rate: 8.25, change24h: 0.50 },
    ],
    lastUpdate: Date.now(),
  },
};

export function useCurrencyRates(
  baseCurrency: string = 'RUB',
  options: UseCurrencyRatesOptions = {}
): UseCurrencyRatesReturn {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<CurrencyData | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(undefined);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockData = MOCK_CURRENCY_DATA[baseCurrency.toUpperCase()] || MOCK_CURRENCY_DATA.RUB;
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [baseCurrency, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, mutate };
}
