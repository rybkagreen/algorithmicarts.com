import { useState, useEffect, useMemo } from 'react';
import type { WidgetSize } from '@/types/demos';

interface AdaptiveLayoutOptions {
  widgetSize: WidgetSize;
  dataComplexity?: number; // 0-1 scale
  importance?: 'low' | 'medium' | 'high';
  updateFrequency?: 'real-time' | 'frequent' | 'periodic' | 'rare';
  userPreferences?: {
    compactMode?: boolean;
    preferredView?: 'list' | 'grid' | 'chart' | 'detailed';
  };
  availableSpace?: {
    width: number;
    height: number;
  };
}

interface AdaptiveLayoutConfig {
  layout: 'compact' | 'list' | 'grid' | 'chart' | 'detailed' | 'hybrid';
  itemsPerRow: number;
  showDetails: boolean;
  showCharts: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  showImages: boolean;
  truncateText: boolean;
}

export function useAdaptiveLayout(options: AdaptiveLayoutOptions): {
  layout: AdaptiveLayoutConfig;
} {
  const {
    widgetSize,
    dataComplexity = 0.5,
    importance = 'medium',
    updateFrequency = 'periodic',
    userPreferences = {},
    availableSpace = { width: 400, height: 300 },
  } = options;

  const layoutConfig = useMemo((): AdaptiveLayoutConfig => {
    // Determine layout based on multiple factors
    let layout: AdaptiveLayoutConfig['layout'] = 'list';
    let itemsPerRow = 1;
    let showDetails = true;
    let showCharts = false;
    let fontSize: AdaptiveLayoutConfig['fontSize'] = 'md';
    let showImages = true;
    let truncateText = false;

    // User preference takes highest priority
    if (userPreferences.preferredView) {
      layout = userPreferences.preferredView as AdaptiveLayoutConfig['layout'];
    } else {
      // Then consider widget size
      if (widgetSize === 'small') {
        layout = 'compact';
        itemsPerRow = 1;
        showDetails = false;
        showCharts = false;
        fontSize = 'sm';
        showImages = false;
        truncateText = true;
      } else if (widgetSize === 'medium') {
        layout = 'list';
        itemsPerRow = 2;
        showDetails = true;
        showCharts = false;
        fontSize = 'md';
        showImages = true;
        truncateText = false;
      } else {
        // For large widgets
        layout = 'hybrid';
        itemsPerRow = 3;
        showDetails = true;
        showCharts = true;
        fontSize = 'md';
        showImages = true;
        truncateText = false;
      }
    }

    // Adjust based on data complexity
    if (dataComplexity > 0.7) {
      if (layout === 'list' || layout === 'grid') {
        layout = 'detailed';
      }
      showDetails = true;
    } else if (dataComplexity < 0.3) {
      if (layout === 'detailed') {
        layout = 'compact';
      }
      showDetails = false;
    }

    // Adjust based on importance
    if (importance === 'high') {
      showDetails = true;
      showCharts = true;
    } else if (importance === 'low') {
      showDetails = false;
      showCharts = false;
    }

    // Adjust based on update frequency
    if (updateFrequency === 'real-time') {
      showCharts = true;
      layout = layout === 'compact' ? 'list' : layout;
    }

    // Apply user preferences
    if (userPreferences.compactMode) {
      layout = 'compact';
      showDetails = false;
      showCharts = false;
      itemsPerRow = 1;
    }

    // Adjust items per row based on available space and layout
    if (availableSpace.width < 400) {
      itemsPerRow = 1;
    } else if (availableSpace.width < 800) {
      itemsPerRow = layout === 'grid' ? 2 : 1;
    } else {
      if (layout === 'grid') {
        itemsPerRow = 3;
      } else if (layout === 'hybrid') {
        itemsPerRow = 2;
      }
    }

    return {
      layout,
      itemsPerRow,
      showDetails,
      showCharts,
      fontSize,
      showImages,
      truncateText,
    };
  }, [widgetSize, dataComplexity, importance, updateFrequency, userPreferences, availableSpace]);

  return { layout: layoutConfig };
}
