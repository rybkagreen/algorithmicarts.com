# ПРИМЕРЫ КОДА ДЛЯ REFERENCE
# Currency Widget Refactoring

---

## 1. useCurrencyRates Hook - Полная реализация

```typescript
// /components/demos/analytics/hooks/useCurrencyRates.ts

import useSWR from 'swr';
import { useCallback, useEffect, useRef } from 'react';
import { CurrencyData } from '@/types/demos';

interface UseCurrencyRatesOptions {
  baseCurrency?: string;
  refreshInterval?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: CurrencyData) => void;
}

interface UseCurrencyRatesReturn {
  data: CurrencyData | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<CurrencyData | undefined>;
}

const CACHE_KEY_PREFIX = 'currency-rates';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours for CBR data

// Fetcher function with error handling and caching
async function fetchCurrencyRates(baseCurrency: string): Promise<CurrencyData> {
  // Check localStorage cache first
  if (typeof window !== 'undefined') {
    const cacheKey = `${CACHE_KEY_PREFIX}-${baseCurrency}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      // Return cached data if fresh
      if (age < CACHE_TTL) {
        return data;
      }
    }
  }
  
  // Fetch fresh data
  const response = await fetch(`/api/currency?base=${baseCurrency}`, {
    signal: AbortSignal.timeout(10000), // 10 second timeout
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch currency rates`);
  }
  
  const data = await response.json();
  
  // Cache the fresh data
  if (typeof window !== 'undefined') {
    const cacheKey = `${CACHE_KEY_PREFIX}-${baseCurrency}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }
  
  return data;
}

export function useCurrencyRates(
  baseCurrency: string = 'RUB',
  options: UseCurrencyRatesOptions = {}
): UseCurrencyRatesReturn {
  const {
    refreshInterval = 0, // Don't auto-refresh for CBR (updates once daily)
    enabled = true,
    onError,
    onSuccess
  } = options;
  
  const isVisibleRef = useRef(true);
  
  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  // SWR configuration with exponential backoff
  const { data, error, isLoading, isValidating, mutate } = useSWR<CurrencyData, Error>(
    enabled ? `${CACHE_KEY_PREFIX}-${baseCurrency}` : null,
    () => fetchCurrencyRates(baseCurrency),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: isVisibleRef.current ? refreshInterval : 0,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Currency rates fetch error:', err);
        onError?.(err);
      },
      onSuccess: (data) => {
        onSuccess?.(data);
      },
      // Exponential backoff for retries
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        
        const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
        setTimeout(() => revalidate({ retryCount }), timeout);
      }
    }
  );
  
  const handleMutate = useCallback(async () => {
    return await mutate();
  }, [mutate]);
  
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate: handleMutate
  };
}
```

---

## 2. CurrencyApiClient - Service Layer

```typescript
// /lib/api/currencyClient.ts

import { CurrencyData, CurrencyRate } from '@/types/demos';

export interface HistoricalCurrencyData {
  base: string;
  rates: Array<{
    date: string;
    rates: CurrencyRate[];
  }>;
}

export class CurrencyApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api/currency') {
    this.baseUrl = baseUrl;
  }
  
  async getRates(baseCurrency: string): Promise<CurrencyData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(
        `${this.baseUrl}?base=${baseCurrency}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw this.handleErrorResponse(response);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: Currency API did not respond in time');
        }
        throw error;
      }
      throw new Error('Unknown error occurred while fetching currency rates');
    }
  }
  
  async getHistoricalRates(
    baseCurrency: string,
    days: number = 7
  ): Promise<HistoricalCurrencyData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(
        `${this.baseUrl}/history?base=${baseCurrency}&days=${days}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw this.handleErrorResponse(response);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: Currency history API did not respond in time');
        }
        throw error;
      }
      throw new Error('Unknown error occurred while fetching historical rates');
    }
  }
  
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const data = await this.getRates(fromCurrency);
    
    const toRate = data.rates.find(r => r.code === toCurrency);
    
    if (!toRate) {
      throw new Error(`Currency ${toCurrency} not found in rates`);
    }
    
    return amount * toRate.rate;
  }
  
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    
    const message = errorData.message || `HTTP ${response.status}`;
    throw new Error(message);
  }
}

// Singleton instance
export const currencyApiClient = new CurrencyApiClient();
```

---

## 3. Improved API Route

```typescript
// /app/api/currency/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { RUSSIAN_HOLIDAYS } from '@/config/holidays';

interface CbrRate {
  code: string;
  nominal: number;
  value: number;
  name: string;
}

// In-memory cache for rate limiting
const requestCache = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const timestamps = requestCache.get(ip) || [];
  
  // Remove timestamps older than 1 minute
  const recentTimestamps = timestamps.filter(t => now - t < 60000);
  
  if (recentTimestamps.length >= limit) {
    return false;
  }
  
  recentTimestamps.push(now);
  requestCache.set(ip, recentTimestamps);
  
  return true;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 6 || day === 0;
}

function isHoliday(date: Date): boolean {
  const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  return RUSSIAN_HOLIDAYS.includes(dateStr);
}

function getLastWorkingDay(date: Date): Date {
  const workingDate = new Date(date);
  
  while (isWeekend(workingDate) || isHoliday(workingDate)) {
    workingDate.setDate(workingDate.getDate() - 1);
  }
  
  return workingDate;
}

function formatDateForCBR(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function fetchCBRData(date: string): Promise<CbrRate[]> {
  const response = await fetch(
    `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${date}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CurrencyBot/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    }
  );
  
  if (!response.ok) {
    throw new Error(`CBR API error: ${response.status}`);
  }
  
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('windows-1251');
  const xmlData = decoder.decode(buffer);
  
  // Parse XML to extract rates
  return parseCBRXML(xmlData);
}

function parseCBRXML(xml: string): CbrRate[] {
  const rates: CbrRate[] = [];
  const valuteRegex = /<Valute[^>]*>([\s\S]*?)<\/Valute>/g;
  
  let match;
  while ((match = valuteRegex.exec(xml)) !== null) {
    const valuteContent = match[1];
    
    const codeMatch = /<CharCode>([^<]+)<\/CharCode>/.exec(valuteContent);
    const nameMatch = /<Name>([^<]+)<\/Name>/.exec(valuteContent);
    const nominalMatch = /<Nominal>([^<]+)<\/Nominal>/.exec(valuteContent);
    const valueMatch = /<Value>([^<]+)<\/Value>/.exec(valuteContent);
    
    if (codeMatch && nameMatch && nominalMatch && valueMatch) {
      rates.push({
        code: codeMatch[1],
        name: nameMatch[1],
        nominal: parseInt(nominalMatch[1]),
        value: parseFloat(valueMatch[1].replace(',', '.'))
      });
    }
  }
  
  return rates;
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
      { status: 429 }
    );
  }
  
  const searchParams = request.nextUrl.searchParams;
  const baseCurrency = searchParams.get('base') || 'RUB';
  
  try {
    const today = new Date();
    const workingToday = getLastWorkingDay(today);
    
    const yesterday = new Date(workingToday);
    yesterday.setDate(yesterday.getDate() - 1);
    const workingYesterday = getLastWorkingDay(yesterday);
    
    const [todayRates, yesterdayRates] = await Promise.all([
      fetchCBRData(formatDateForCBR(workingToday)),
      fetchCBRData(formatDateForCBR(workingYesterday))
    ]);
    
    // Calculate changes and format response
    const rates = todayRates.map(todayRate => {
      const yesterdayRate = yesterdayRates.find(r => r.code === todayRate.code);
      
      const todayValue = todayRate.value / todayRate.nominal;
      const yesterdayValue = yesterdayRate 
        ? yesterdayRate.value / yesterdayRate.nominal 
        : todayValue;
      
      return {
        code: todayRate.code,
        name: todayRate.name,
        rate: todayValue,
        change24h: calculateChange(todayValue, yesterdayValue)
      };
    });
    
    return NextResponse.json(
      {
        base: baseCurrency,
        rates,
        lastUpdate: workingToday.getTime(),
        workingDate: formatDateForCBR(workingToday)
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      }
    );
  } catch (error) {
    console.error('Currency API error:', error);
    
    return NextResponse.json(
      {
        error: 'CBR_API_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch currency data',
      },
      { status: 502 }
    );
  }
}
```

---

## 4. Main CurrencyWidget Component (Refactored)

```typescript
// /components/demos/analytics/widgets/currency/CurrencyWidget.tsx

import { useState, useMemo, useCallback } from 'react';
import { useCurrencyRates } from '../../hooks/useCurrencyRates';
import { WidgetSize } from '../../types';
import { CurrencyWidgetHeader } from './CurrencyWidgetHeader';
import { CurrencyWidgetSkeleton } from './CurrencyWidgetSkeleton';
import { CurrencyWidgetError } from './CurrencyWidgetError';
import { CurrencyRateList } from './CurrencyRateList';
import { useFavoriteCurrencies } from './useFavoriteCurrencies';
import styles from './CurrencyWidget.module.css';

interface CurrencyWidgetProps {
  size: WidgetSize;
  initialBaseCurrency?: string;
  maxItems?: number;
  showChart?: boolean;
}

export default function CurrencyWidget({
  size,
  initialBaseCurrency = 'RUB',
  maxItems,
  showChart = false
}: CurrencyWidgetProps) {
  const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
  const { favorites, toggleFavorite } = useFavoriteCurrencies();
  
  const { data, error, isLoading, mutate } = useCurrencyRates(baseCurrency, {
    enabled: true,
    refreshInterval: 0 // CBR updates once daily
  });
  
  // Calculate display count based on size
  const displayCount = useMemo(() => {
    if (maxItems) return maxItems;
    
    switch (size) {
      case 'small': return 1;
      case 'medium': return 5;
      case 'large': return 10;
      default: return 5;
    }
  }, [size, maxItems]);
  
  // Sort rates: favorites first, then by code
  const sortedRates = useMemo(() => {
    if (!data?.rates) return [];
    
    return [...data.rates].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.code);
      const bIsFavorite = favorites.includes(b.code);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      return a.code.localeCompare(b.code);
    });
  }, [data?.rates, favorites]);
  
  const displayRates = useMemo(() => {
    return sortedRates.slice(0, displayCount);
  }, [sortedRates, displayCount]);
  
  const handleCurrencyChange = useCallback((newCurrency: string) => {
    setBaseCurrency(newCurrency);
  }, []);
  
  const handleRetry = useCallback(() => {
    mutate();
  }, [mutate]);
  
  // Loading state
  if (isLoading && !data) {
    return <CurrencyWidgetSkeleton size={size} />;
  }
  
  // Error state
  if (error) {
    return <CurrencyWidgetError error={error} onRetry={handleRetry} />;
  }
  
  // Empty state
  if (!data || displayRates.length === 0) {
    return (
      <div className={styles.currencyWidget} role="region" aria-label="Currency Exchange Rates Widget">
        <p>No currency data available</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`${styles.currencyWidget} ${styles[`currencyWidget--${size}`]}`}
      role="region"
      aria-label="Currency Exchange Rates Widget"
    >
      <CurrencyWidgetHeader
        baseCurrency={baseCurrency}
        onCurrencyChange={handleCurrencyChange}
        lastUpdate={data.lastUpdate}
      />
      
      <CurrencyRateList
        rates={displayRates}
        baseCurrency={baseCurrency}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        showChart={showChart && size === 'large'}
        compact={size === 'small'}
      />
      
      <div className="sr-only" role="status" aria-live="polite">
        {isLoading ? 'Updating currency rates' : `${displayRates.length} currency rates displayed`}
      </div>
    </div>
  );
}
```

---

## 5. CurrencyRateItem Component

```typescript
// /components/demos/analytics/widgets/currency/CurrencyRateItem.tsx

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { CurrencyRate } from '@/types/demos';
import { TrendIndicator } from './TrendIndicator';
import { formatCurrency } from '@/lib/utils/currency';
import styles from './CurrencyRateItem.module.css';

interface CurrencyRateItemProps {
  rate: CurrencyRate;
  baseCurrency: string;
  isFavorite?: boolean;
  onToggleFavorite?: (code: string) => void;
  compact?: boolean;
  showChart?: boolean;
}

export const CurrencyRateItem = memo(function CurrencyRateItem({
  rate,
  baseCurrency,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
  showChart = false
}: CurrencyRateItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${styles.currencyRateItem} ${compact ? styles['currencyRateItem--compact'] : ''}`}
      role="article"
      aria-label={`${rate.name} exchange rate: ${formatCurrency(rate.rate, baseCurrency)}`}
    >
      <div className={styles.currencyRateItem__info}>
        <div className={styles.currencyRateItem__header}>
          <span className={styles.currencyRateItem__code}>{rate.code}</span>
          {!compact && (
            <span className={styles.currencyRateItem__name}>{rate.name}</span>
          )}
        </div>
        
        <div className={styles.currencyRateItem__value}>
          <span className={styles.currencyRateItem__rate}>
            {formatCurrency(rate.rate, baseCurrency)}
          </span>
          
          <TrendIndicator 
            change={rate.change24h} 
            showValue={!compact}
            size={compact ? 'sm' : 'md'}
          />
        </div>
      </div>
      
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(rate.code)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={styles.currencyRateItem__favorite}
        >
          <Star 
            size={16}
            fill={isFavorite ? 'currentColor' : 'none'}
            className={isFavorite ? styles['currencyRateItem__favorite--active'] : ''}
          />
        </button>
      )}
    </motion.div>
  );
});
```

---

## 6. Utility Functions

```typescript
// /lib/utils/currency.ts

export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
}

export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    RUB: '₽',
    CNY: '¥'
  };
  
  return symbols[code] || code;
}
```

```typescript
// /lib/utils/date.ts

import { formatDistanceToNow, format } from 'date-fns';

export function useFormattedDate(timestamp: number) {
  return {
    relative: formatDistanceToNow(timestamp, { addSuffix: true }),
    absolute: format(timestamp, 'PPpp')
  };
}

export function isDataStale(timestamp: number, maxAgeMs: number = 24 * 60 * 60 * 1000): boolean {
  return Date.now() - timestamp > maxAgeMs;
}
```

---

## 7. Configuration File

```typescript
// /config/holidays.ts

export const RUSSIAN_HOLIDAYS = [
  '01.01', '02.01', '03.01', '04.01', '05.01', '06.01', '07.01', '08.01', // New Year
  '23.02', // Defender of the Fatherland Day
  '08.03', // International Women's Day
  '01.05', '09.05', // Labour Day and Victory Day
  '12.06', // Russia Day
  '04.11', // Unity Day
];

// Function to check if a specific year has different holidays
export function getHolidaysForYear(year: number): string[] {
  // This can be extended to handle year-specific changes
  return RUSSIAN_HOLIDAYS;
}
```

---

## 8. Test Example

```typescript
// /components/demos/analytics/widgets/currency/__tests__/CurrencyWidget.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyWidget } from '../CurrencyWidget';
import { useCurrencyRates } from '../../../hooks/useCurrencyRates';

jest.mock('../../../hooks/useCurrencyRates');

describe('CurrencyWidget', () => {
  const mockData = {
    base: 'RUB',
    rates: [
      { code: 'USD', name: 'US Dollar', rate: 75.5, change24h: -0.5 },
      { code: 'EUR', name: 'Euro', rate: 85.2, change24h: 0.3 },
      { code: 'GBP', name: 'British Pound', rate: 98.1, change24h: 0.1 },
    ],
    lastUpdate: Date.now()
  };
  
  beforeEach(() => {
    (useCurrencyRates as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn()
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders currency rates correctly', () => {
    render(<CurrencyWidget size="medium" />);
    
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('US Dollar')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });
  
  it('displays correct number of rates based on size', () => {
    const { rerender } = render(<CurrencyWidget size="small" />);
    
    // Small size should show 1 rate
    let rateItems = screen.getAllByRole('article');
    expect(rateItems).toHaveLength(1);
    
    // Medium size should show up to 5 rates
    rerender(<CurrencyWidget size="medium" />);
    rateItems = screen.getAllByRole('article');
    expect(rateItems.length).toBeLessThanOrEqual(5);
  });
  
  it('shows loading skeleton when data is loading', () => {
    (useCurrencyRates as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: false,
      mutate: jest.fn()
    });
    
    render(<CurrencyWidget size="medium" />);
    expect(screen.getByTestId('currency-skeleton')).toBeInTheDocument();
  });
  
  it('handles errors gracefully', async () => {
    const mockMutate = jest.fn();
    (useCurrencyRates as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('Network error'),
      isLoading: false,
      isValidating: false,
      mutate: mockMutate
    });
    
    render(<CurrencyWidget size="medium" />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/unable to fetch/i)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);
    
    expect(mockMutate).toHaveBeenCalled();
  });
  
  it('toggles favorite currencies', async () => {
    render(<CurrencyWidget size="large" />);
    
    const favoriteButtons = screen.getAllByLabelText(/add to favorites/i);
    await userEvent.click(favoriteButtons[0]);
    
    await waitFor(() => {
      const stored = localStorage.getItem('currency-favorites');
      expect(stored).toBeTruthy();
      const favorites = JSON.parse(stored!);
      expect(favorites).toContain('USD');
    });
  });
  
  it('meets accessibility requirements', () => {
    const { container } = render(<CurrencyWidget size="medium" />);
    
    expect(container.querySelector('[role="region"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-label="Currency Exchange Rates Widget"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });
  
  it('supports keyboard navigation', async () => {
    render(<CurrencyWidget size="large" />);
    
    // Tab through interactive elements
    const favoriteButtons = screen.getAllByLabelText(/add to favorites/i);
    
    await userEvent.tab();
    expect(favoriteButtons[0]).toHaveFocus();
    
    await userEvent.keyboard('{Enter}');
    // Verify favorite was toggled
  });
});
```

---

_Эти примеры кода служат референсом для QWEN CODE при реализации задач._  
_Все примеры следуют best practices и соответствуют требованиям ТЗ._
