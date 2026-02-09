// lib/analytics/tracking.ts

// Define event types for analytics
export type AnalyticsEvent =
  | 'widget_load'
  | 'widget_interaction'
  | 'widget_resize'
  | 'widget_error'
  | 'layout_change'
  | 'data_refresh'
  | 'favorite_toggle'
  | 'currency_change'
  | 'username_change'
  | 'location_change'
  | 'dashboard_save'
  | 'dashboard_load'
  | 'error_occurrence';

// Define properties that can be attached to events
export interface EventProperties {
  widgetType?: string;
  widgetId?: string;
  size?: string;
  baseCurrency?: string;
  currencyCode?: string;
  errorType?: string;
  duration?: number;
  userId?: string;
  timestamp?: number;
  [key: string]: any;
}

// Analytics tracking interface
export interface AnalyticsTracker {
  track(event: AnalyticsEvent, properties?: EventProperties): void;
  setUser(userId: string): void;
  setSession(sessionId: string): void;
  flush(): void;
}

// Implementation of analytics tracker
class AnalyticsService implements AnalyticsTracker {
  private userId: string | null = null;
  private sessionId: string | null = null;
  private queue: Array<{ event: AnalyticsEvent; properties: EventProperties }> = [];
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.initSession();
    this.startFlushTimer();
  }

  private initSession() {
    // Generate a session ID if one doesn't exist
    if (!this.sessionId) {
      this.sessionId = this.generateId();
    }
  }

  private startFlushTimer() {
    setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  track(event: AnalyticsEvent, properties: EventProperties = {}) {
    // Add default properties
    const enrichedProperties: EventProperties = {
      ...properties,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    // Add to queue
    this.queue.push({ event, properties: enrichedProperties });

    // Flush if queue is too large
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.flush();
    }
  }

  setUser(userId: string) {
    this.userId = userId;
  }

  setSession(sessionId: string) {
    this.sessionId = sessionId;
  }

  flush() {
    if (this.queue.length === 0) return;

    // In a real implementation, this would send data to an analytics backend
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics flush:', this.queue);
    }

    // Send to analytics endpoint in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'development') {
      this.sendToEndpoint(this.queue);
    }

    // Clear the queue
    this.queue = [];
  }

  private async sendToEndpoint(
    events: Array<{ event: AnalyticsEvent; properties: EventProperties }>
  ) {
    try {
      // In a real implementation, this would send to your analytics endpoint
      // Example: await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(events) });
      console.log('Sending analytics data to endpoint:', events);
    } catch (error) {
      console.error('Failed to send analytics data:', error);
      // In a real implementation, you might want to store failed events for retry
    }
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();

// Export the service
export default analyticsService;

// Hook for React components
import { useEffect } from 'react';

export const useTrackEvent = (event: AnalyticsEvent, properties?: EventProperties) => {
  useEffect(() => {
    analyticsService.track(event, properties);
  }, [event, JSON.stringify(properties)]);
};
