// Types for the analytics dashboard

// Widget types
export type WidgetType =
  | 'currency'
  | 'weather'
  | 'github'
  | 'ai-assistant'
  | 'usage-stats'
  | 'custom';

// Widget sizes
export type WidgetSize = 'nano' | 'tiny' | 'small' | 'medium' | 'large' | 'huge';

// Flexible size notation (e.g., '2x1' means 2 columns wide, 1 column tall)
export type FlexibleSize = `${number}x${number}`;

// Widget layout configuration
export interface WidgetLayout {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  flexibleSize: FlexibleSize; // For granular grid control
  order: number;
}

// Dashboard configuration
export interface DashboardConfig {
  id: string;
  title: string;
  description: string;
  widgets: WidgetLayout[];
  updatedAt: Date;
  theme?: string;
}

// Currency types
export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change24h: number; // Percentage change in 24 hours
}

export interface CurrencyData {
  base: string;
  rates: CurrencyRate[];
  lastUpdate: number;
}

// Weather types
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecasts: WeatherForecast[];
  lastUpdate: number;
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  location: string;
  change24h: number; // Percentage change in 24 hours
}

// GitHub types
export interface GitHubStats {
  username: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  publicGists: number;
  profileViews: number;
  lastUpdate: number;
  stats: GitHubStat[];
}

export interface GitHubStat {
  label: string;
  value: number | string;
  change?: number; // Percentage change
  unit?: string;
}

// Micro-frontend types
export interface MicroFrontend {
  id: string;
  name: string;
  url: string;
  props?: Record<string, any>;
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error }>;
}

// Grid types
export interface GridConfig {
  cols: number;
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minItemWidth?: string;
}

export interface GridItemConfig {
  id: string;
  colSpan: number;
  rowSpan: number;
  sm?: { colSpan?: number; rowSpan?: number };
  md?: { colSpan?: number; rowSpan?: number };
  lg?: { colSpan?: number; rowSpan?: number };
  xl?: { colSpan?: number; rowSpan?: number };
}

// Layout configuration for adaptive layouts
export interface AdaptiveLayoutConfig {
  layout: 'compact' | 'list' | 'grid' | 'chart' | 'detailed' | 'hybrid';
  itemsPerRow: number;
  showDetails: boolean;
  showCharts: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  showImages: boolean;
  truncateText: boolean;
}

// Analytics event types
export type AnalyticsEvent =
  | 'widget_load'
  | 'widget_interaction'
  | 'widget_resize'
  | 'widget_error'
  | 'layout_change'
  | 'data_refresh'
  | 'favorite_toggle'
  | 'currency_change'
  | 'dashboard_save'
  | 'dashboard_load';

export interface AnalyticsPayload {
  widgetType?: string;
  widgetId?: string;
  eventType?: AnalyticsEvent;
  timestamp: number;
  [key: string]: any;
}
