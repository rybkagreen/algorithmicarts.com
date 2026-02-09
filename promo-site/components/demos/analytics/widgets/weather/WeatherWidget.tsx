// components/demos/analytics/widgets/weather/WeatherWidget.tsx

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useWeatherData } from '../../hooks/useWeatherData';
import type { WidgetSize } from '@/types/demos';
import { WeatherWidgetHeader } from './WeatherWidgetHeader';
import { WeatherWidgetSkeleton } from './WeatherWidgetSkeleton';
import { WeatherWidgetError } from './WeatherWidgetError';
import { WeatherForecastList } from './WeatherForecastList';
import { useFavoriteLocations } from './useFavoriteLocations';
import { WeatherWidgetContainer } from '../../organisms/WeatherWidgetContainer';
import analyticsService from '@/lib/analytics/tracking';
import { useAdaptiveLayout } from '../../hooks/useAdaptiveLayout';

interface WeatherWidgetProps {
  size: WidgetSize;
  initialLocation?: string;
  maxItems?: number;
  showChart?: boolean;
}

export default function WeatherWidget({
  size,
  initialLocation = 'Moscow',
  maxItems,
  showChart = false,
}: WeatherWidgetProps) {
  const [location, setLocation] = useState(initialLocation);
  const { favorites, toggleFavorite } = useFavoriteLocations();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Track widget load event
  useEffect(() => {
    analyticsService.track('widget_load', {
      widgetType: 'weather',
      widgetSize: size,
      location: initialLocation,
      timestamp: Date.now(),
    });
  }, [size, initialLocation]);

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

  const { data, error, isLoading, mutate } = useWeatherData(location, {
    enabled: true,
    refreshInterval: 0, // Weather updates periodically
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

  // Sort forecasts: favorites first, then by date
  const sortedForecasts = useMemo(() => {
    if (!data?.forecasts) return [];

    return [...data.forecasts].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.location);
      const bIsFavorite = favorites.includes(b.location);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [data?.forecasts, favorites]);

  const displayForecasts = useMemo(() => {
    return sortedForecasts.slice(0, displayCount);
  }, [sortedForecasts, displayCount]);

  const handleLocationChange = useCallback(
    (newLocation: string) => {
      setLocation(newLocation);
      // Track location change event
      analyticsService.track('location_change', {
        widgetType: 'weather',
        fromLocation: location,
        toLocation: newLocation,
        timestamp: Date.now(),
      });
    },
    [location]
  );

  const handleRetry = useCallback(() => {
    const startTime = Date.now();
    // Track data refresh event
    analyticsService.track('data_refresh', {
      widgetType: 'weather',
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    });
    mutate();
  }, [mutate]);

  // Track error events
  useEffect(() => {
    if (error) {
      analyticsService.track('error_occurrence', {
        widgetType: 'weather',
        errorType: 'data_fetch_error',
        errorMessage: error.message,
        timestamp: Date.now(),
      });
    }
  }, [error]);

  // Loading state
  if (isLoading && !data) {
    return <WeatherWidgetSkeleton size={size} />;
  }

  // Error state
  if (error) {
    return <WeatherWidgetError error={error} onRetry={handleRetry} />;
  }

  // Empty state
  if (!data || displayForecasts.length === 0) {
    return (
      <div className="p-4 text-center" role="region" aria-label="Weather Forecast Widget">
        <p className="text-gray-400">No weather data available</p>
      </div>
    );
  }

  return (
    <WeatherWidgetContainer
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
      <WeatherWidgetHeader
        location={location}
        onLocationChange={handleLocationChange}
        lastUpdate={data.lastUpdate}
      />

      <WeatherForecastList
        forecasts={displayForecasts}
        location={location}
        favorites={favorites}
        onToggleFavorite={(loc) => {
          toggleFavorite(loc);
          // Track favorite toggle event
          analyticsService.track('favorite_toggle', {
            widgetType: 'weather',
            location: loc,
            isFavorite: favorites.includes(loc),
            timestamp: Date.now(),
          });
        }}
        showChart={layoutConfig.layout.showCharts || (showChart && size === 'large')}
        compact={layoutConfig.layout.itemsPerRow === 1 && !layoutConfig.layout.showDetails}
      />

      <div className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? 'Updating weather forecasts'
          : `${displayForecasts.length} weather forecasts displayed`}
      </div>
    </WeatherWidgetContainer>
  );
}
