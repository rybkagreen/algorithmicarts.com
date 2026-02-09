// Weather Types
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: number;
}

// Currency Types
export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change24h: number;
}

export interface CurrencyData {
  base: string;
  rates: CurrencyRate[];
  lastUpdate: number;
}

// Common Types
export type WidgetSize = 'nano' | 'tiny' | 'small' | 'medium' | 'large' | 'huge';

// Weather Types
export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  location: string;
  change24h: number; // Percentage change in 24 hours
}

// GitHub Types
export interface GitHubStat {
  label: string;
  value: number | string;
  change?: number; // Percentage change
  unit?: string;
}

export interface GitHubStats {
  username: string;
  name: string;
  avatar: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  contributions: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  recentActivity: {
    date: string;
    commits: number;
    prs: number;
    issues: number;
  }[];
  stats: GitHubStat[];
}

// Bot Builder Types
export interface BotFeature {
  id: string;
  category: 'basic' | 'advanced' | 'premium';
  name: string;
  description: string;
  price: number;
  developmentDays: number;
  complexity: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

export interface BotConfiguration {
  features: string[];
  hosting: 'free' | 'vps' | 'cloud';
  support: 'none' | 'basic' | 'premium';
  customDesign: boolean;
  analytics: boolean;
}

export interface PriceEstimate {
  basePrice: number;
  featuresPrice: number;
  hostingPrice: number;
  supportPrice: number;
  totalPrice: number;
  developmentTime: number;
  complexityScore: number;
}
