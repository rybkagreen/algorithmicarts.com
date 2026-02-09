import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useCurrencyRates } from '../../hooks/useCurrencyRates';
import type { WidgetSize } from '@/types/demos';
import { CurrencyWidgetHeader } from './CurrencyWidgetHeader';
import { CurrencyWidgetSkeleton } from './CurrencyWidgetSkeleton';
import { CurrencyWidgetError } from './CurrencyWidgetError';
import { CurrencyRateList } from './CurrencyRateList';
import { useFavoriteCurrencies } from './useFavoriteCurrencies';
import { CurrencyWidgetContainer } from '../../organisms/CurrencyWidgetContainer';
import analyticsService from '@/lib/analytics/tracking';
import { useAdaptiveLayout } from '../../hooks/useAdaptiveLayout';

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
  showChart = false,
}: CurrencyWidgetProps) {
  const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
  const { favorites, toggleFavorite } = useFavoriteCurrencies();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Track widget load event
  useEffect(() => {
    analyticsService.track('widget_load', {
      widgetType: 'currency',
      widgetSize: size,
      baseCurrency: initialBaseCurrency,
      timestamp: Date.now(),
    });
  }, [size, initialBaseCurrency]);

  // Get adaptive layout
  const layoutConfig = useAdaptiveLayout({
    widgetSize: size,
    dataComplexity: 0.5, // Adjust based on actual data complexity
    importance: 'medium',
    updateFrequency: 'periodic',
    userPreferences: {
      compactMode: size === 'small',
      preferredView: showChart ? 'chart' : 'list',
    },
    availableSpace: { width: 400, height: 300 }, // Will be updated dynamically
  });
  const { layout } = layoutConfig;

  const { data, error, isLoading, mutate } = useCurrencyRates(baseCurrency, {
    enabled: true,
    refreshInterval: 0, // CBR updates once daily
  });

  // Calculate display count based on size and layout
  const displayCount = useMemo(() => {
    if (maxItems) return maxItems;

    // Adjust based on layout type
    switch (layoutConfig.layout.layout) {
      case 'compact':
        return size === 'small' ? 1 : size === 'medium' ? 3 : 5;
      case 'list':
        return size === 'small' ? 1 : size === 'medium' ? 5 : 10;
      case 'grid':
        return size === 'small' ? 2 : size === 'medium' ? 4 : 8;
      case 'chart':
        return size === 'small' ? 1 : size === 'medium' ? 3 : 6;
      case 'detailed':
        return size === 'small' ? 1 : size === 'medium' ? 2 : 4;
      case 'hybrid':
        return size === 'small' ? 1 : size === 'medium' ? 4 : 8;
      default:
        return size === 'small' ? 1 : size === 'medium' ? 5 : 10;
    }
  }, [size, maxItems, layoutConfig]);

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

  const handleCurrencyChange = useCallback(
    (newCurrency: string) => {
      setBaseCurrency(newCurrency);
      // Track currency change event
      analyticsService.track('currency_change', {
        widgetType: 'currency',
        fromCurrency: baseCurrency,
        toCurrency: newCurrency,
        timestamp: Date.now(),
      });
    },
    [baseCurrency]
  );

  const handleRetry = useCallback(() => {
    const startTime = Date.now();
    // Track data refresh event
    analyticsService.track('data_refresh', {
      widgetType: 'currency',
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    });
    mutate();
  }, [mutate]);

  // Track error events
  useEffect(() => {
    if (error) {
      analyticsService.track('error_occurrence', {
        widgetType: 'currency',
        errorType: 'data_fetch_error',
        errorMessage: error.message,
        timestamp: Date.now(),
      });
    }
  }, [error]);

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
      <div className="p-4 text-center" role="region" aria-label="Currency Exchange Rates Widget">
        <p className="text-gray-400">No currency data available</p>
      </div>
    );
  }

  return (
    <CurrencyWidgetContainer
      size={size}
      ref={widgetRef}
      className={`
        ${
          layoutConfig.layout.fontSize === 'sm'
            ? 'text-sm'
            : layoutConfig.layout.fontSize === 'lg'
              ? 'text-lg'
              : 'text-base'
        }
      `}
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
        onToggleFavorite={(code) => {
          toggleFavorite(code);
          // Track favorite toggle event
          analyticsService.track('favorite_toggle', {
            widgetType: 'currency',
            currencyCode: code,
            isFavorite: favorites.includes(code),
            timestamp: Date.now(),
          });
        }}
        showChart={layoutConfig.layout.showCharts || (showChart && size === 'large')}
        compact={layoutConfig.layout.itemsPerRow === 1 && !layoutConfig.layout.showDetails}
      />

      <div className="sr-only" role="status" aria-live="polite">
        {isLoading ? 'Updating currency rates' : `${displayRates.length} currency rates displayed`}
      </div>
    </CurrencyWidgetContainer>
  );
}
