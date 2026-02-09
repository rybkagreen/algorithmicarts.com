// components/demos/analytics/widgets/github/GitHubWidget.tsx

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import type { WidgetSize } from '@/types/demos';
import { GitHubWidgetHeader } from './GitHubWidgetHeader';
import { GitHubWidgetSkeleton } from './GitHubWidgetSkeleton';
import { GitHubWidgetError } from './GitHubWidgetError';
import { GitHubStatList } from './GitHubStatList';
import { useFavoriteRepos } from './useFavoriteRepos';
import { GitHubWidgetContainer } from '../../organisms/GitHubWidgetContainer';
import analyticsService from '@/lib/analytics/tracking';
import { useAdaptiveLayout } from '../../hooks/useAdaptiveLayout';

interface GitHubWidgetProps {
  size: WidgetSize;
  initialUsername?: string;
  maxItems?: number;
  showChart?: boolean;
}

export default function GitHubWidget({
  size,
  initialUsername = 'octocat',
  maxItems,
  showChart = false,
}: GitHubWidgetProps) {
  const [username, setUsername] = useState(initialUsername);
  const { favorites, toggleFavorite } = useFavoriteRepos();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Track widget load event
  useEffect(() => {
    analyticsService.track('widget_load', {
      widgetType: 'github',
      widgetSize: size,
      username: initialUsername,
      timestamp: Date.now(),
    });
  }, [size, initialUsername]);

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

  const { data, error, isLoading, mutate } = useGitHubStats(username, {
    enabled: true,
    refreshInterval: 0, // GitHub stats don't update frequently
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

  // Sort stats: favorites first, then by value
  const sortedStats = useMemo(() => {
    if (!data?.stats) return [];

    return [...data.stats].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.label);
      const bIsFavorite = favorites.includes(b.label);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // If both are favorites or both are not, sort by value
      // Handle both number and string values
      if (typeof a.value === 'number' && typeof b.value === 'number') {
        return b.value - a.value;
      } else {
        // For string values, compare alphabetically
        return String(b.value).localeCompare(String(a.value));
      }
    });
  }, [data?.stats, favorites]);

  const displayStats = useMemo(() => {
    return sortedStats.slice(0, displayCount);
  }, [sortedStats, displayCount]);

  const handleUsernameChange = useCallback(
    (newUsername: string) => {
      setUsername(newUsername);
      // Track username change event
      analyticsService.track('username_change', {
        widgetType: 'github',
        fromUsername: username,
        toUsername: newUsername,
        timestamp: Date.now(),
      });
    },
    [username]
  );

  const handleRetry = useCallback(() => {
    const startTime = Date.now();
    // Track data refresh event
    analyticsService.track('data_refresh', {
      widgetType: 'github',
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    });
    mutate();
  }, [mutate]);

  // Track error events
  useEffect(() => {
    if (error) {
      analyticsService.track('error_occurrence', {
        widgetType: 'github',
        errorType: 'data_fetch_error',
        errorMessage: error.message,
        timestamp: Date.now(),
      });
    }
  }, [error]);

  // Loading state
  if (isLoading && !data) {
    return <GitHubWidgetSkeleton size={size} />;
  }

  // Error state
  if (error) {
    return <GitHubWidgetError error={error} onRetry={handleRetry} />;
  }

  // Empty state
  if (!data || displayStats.length === 0) {
    return (
      <div className="p-4 text-center" role="region" aria-label="GitHub Statistics Widget">
        <p className="text-gray-400">No GitHub data available</p>
      </div>
    );
  }

  return (
    <GitHubWidgetContainer
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
      <GitHubWidgetHeader
        username={username}
        onUsernameChange={handleUsernameChange}
        lastUpdate={data.lastUpdate}
      />

      <GitHubStatList
        stats={displayStats}
        username={username}
        favorites={favorites}
        onToggleFavorite={(repo) => {
          toggleFavorite(repo);
          // Track favorite toggle event
          analyticsService.track('favorite_toggle', {
            widgetType: 'github',
            repo: repo,
            isFavorite: favorites.includes(repo),
            timestamp: Date.now(),
          });
        }}
        showChart={layoutConfig.layout.showCharts || (showChart && size === 'large')}
        compact={layoutConfig.layout.itemsPerRow === 1 && !layoutConfig.layout.showDetails}
      />

      <div className="sr-only" role="status" aria-live="polite">
        {isLoading ? 'Updating GitHub stats' : `${displayStats.length} GitHub stats displayed`}
      </div>
    </GitHubWidgetContainer>
  );
}
