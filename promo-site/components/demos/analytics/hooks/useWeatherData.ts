import { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from '../types';

interface UseWeatherDataOptions {
  location?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseWeatherDataReturn {
  data: WeatherData | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
}

// Mock weather data for demo purposes
const MOCK_WEATHER_DATA: Record<string, WeatherData> = {
  Moscow: {
    location: 'Moscow',
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    forecasts: [
      {
        date: new Date(Date.now()).toISOString(),
        temperature: 22,
        condition: 'Sunny',
        location: 'Moscow',
        change24h: 0.5,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        temperature: 24,
        condition: 'Partly Cloudy',
        location: 'Moscow',
        change24h: -0.2,
      },
      {
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        temperature: 20,
        condition: 'Rainy',
        location: 'Moscow',
        change24h: 1.2,
      },
    ],
    lastUpdate: Date.now(),
  },
  London: {
    location: 'London',
    temperature: 15,
    condition: 'Rainy',
    humidity: 75,
    windSpeed: 15,
    forecasts: [
      {
        date: new Date(Date.now()).toISOString(),
        temperature: 15,
        condition: 'Rainy',
        location: 'London',
        change24h: 0.3,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        temperature: 17,
        condition: 'Cloudy',
        location: 'London',
        change24h: -0.1,
      },
      {
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        temperature: 14,
        condition: 'Rainy',
        location: 'London',
        change24h: 0.8,
      },
    ],
    lastUpdate: Date.now(),
  },
  'New York': {
    location: 'New York',
    temperature: 25,
    condition: 'Clear',
    humidity: 55,
    windSpeed: 10,
    forecasts: [
      {
        date: new Date(Date.now()).toISOString(),
        temperature: 25,
        condition: 'Clear',
        location: 'New York',
        change24h: 0.2,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        temperature: 27,
        condition: 'Sunny',
        location: 'New York',
        change24h: -0.3,
      },
      {
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        temperature: 23,
        condition: 'Cloudy',
        location: 'New York',
        change24h: 0.5,
      },
    ],
    lastUpdate: Date.now(),
  },
};

export function useWeatherData(
  location: string = 'Moscow',
  options: UseWeatherDataOptions = {}
): UseWeatherDataReturn {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<WeatherData | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(undefined);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockData = MOCK_WEATHER_DATA[location] || MOCK_WEATHER_DATA.Moscow;
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [location, enabled]);

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
