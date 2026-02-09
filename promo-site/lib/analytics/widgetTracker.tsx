// lib/analytics/widgetTracker.tsx

import { ComponentType } from 'react';
import { useTrackEvent } from './tracking';
import { WidgetSize } from '@/types/demos';

interface TrackedWidgetProps {
  widgetType: string;
  size: WidgetSize;
  [key: string]: any;
}

/**
 * Higher-order component that adds analytics tracking to widgets
 */
export function withWidgetTracking<T extends TrackedWidgetProps>(
  WrappedComponent: ComponentType<T>,
  widgetType: string
) {
  const TrackedComponent = (props: T) => {
    // Track when the widget loads
    useTrackEvent('widget_load', {
      widgetType,
      widgetSize: props.size,
      timestamp: Date.now(),
    });

    return <WrappedComponent {...props} />;
  };

  TrackedComponent.displayName = `Tracked${WrappedComponent.displayName || WrappedComponent.name || 'Component'}`;

  return TrackedComponent;
}
