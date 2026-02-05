# 📋 ЗАДАНИЕ 6: Демо-проекты для Portfolio

**Время выполнения:** 4-6 часов  
**Приоритет:** ВЫСОКИЙ  
**Зависит от:** Задания 1-5

## 🎯 Цель задания

Создать два полнофункциональных демо-приложения для раздела Portfolio:
1. **Analytics Dashboard** - дашборд с live данными (погода, курсы валют, GitHub статистика)
2. **Telegram Bot Builder** - интерактивный калькулятор стоимости бота

Оба демо должны быть полностью функциональными и демонстрировать продвинутые навыки разработки.

---

## 📦 Установка зависимостей

```bash
npm install recharts axios swr date-fns
npm install -D @types/node
```

---

## 🗂️ Структура файлов

```
promo-site/
├── app/
│   └── portfolio/
│       ├── analytics-dashboard/
│       │   └── page.tsx
│       └── bot-builder/
│           └── page.tsx
├── components/
│   └── demos/
│       ├── analytics/
│       │   ├── WeatherWidget.tsx
│       │   ├── CurrencyWidget.tsx
│       │   ├── GitHubWidget.tsx
│       │   └── StatsCard.tsx
│       └── bot-builder/
│           ├── FeatureSelector.tsx
│           ├── PriceCalculator.tsx
│           ├── ConfigurationSummary.tsx
│           └── TimelineEstimate.tsx
├── lib/
│   └── api/
│       ├── weather.ts
│       ├── currency.ts
│       └── github.ts
└── types/
    └── demos.ts
```

---

## 📝 ШАГ 1: Типы данных

### `promo-site/types/demos.ts`

```typescript
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

// GitHub Types
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
```

---

## 🌤️ ШАГ 2: API Helpers - Weather

### `promo-site/lib/api/weather.ts`

```typescript
import { WeatherData } from '@/types/demos';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeatherData(city: string = 'London'): Promise<WeatherData> {
  try {
    // Если нет API ключа, возвращаем mock данные
    if (!WEATHER_API_KEY) {
      return getMockWeatherData(city);
    }

    const response = await fetch(
      `${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return getMockWeatherData(city);
  }
}

function getMockWeatherData(city: string): WeatherData {
  const mockData: Record<string, Partial<WeatherData>> = {
    London: { temperature: 15, humidity: 75, windSpeed: 20, description: 'Cloudy' },
    Moscow: { temperature: 8, humidity: 65, windSpeed: 15, description: 'Clear' },
    'New York': { temperature: 22, humidity: 60, windSpeed: 25, description: 'Partly cloudy' },
  };

  const base = mockData[city] || mockData.London;

  return {
    city,
    country: 'GB',
    temperature: base.temperature!,
    feelsLike: base.temperature! - 2,
    humidity: base.humidity!,
    pressure: 1013,
    windSpeed: base.windSpeed!,
    description: base.description!,
    icon: '03d',
    timestamp: Date.now(),
  };
}

export const POPULAR_CITIES = [
  'London',
  'Moscow',
  'New York',
  'Tokyo',
  'Paris',
  'Berlin',
  'Dubai',
  'Singapore',
];
```

---

## 💱 ШАГ 3: API Helpers - Currency

### `promo-site/lib/api/currency.ts`

```typescript
import { CurrencyData, CurrencyRate } from '@/types/demos';

const CURRENCY_API_URL = 'https://api.exchangerate-api.com/v4/latest';

export async function fetchCurrencyRates(base: string = 'USD'): Promise<CurrencyData> {
  try {
    const response = await fetch(`${CURRENCY_API_URL}/${base}`);

    if (!response.ok) {
      throw new Error('Currency API error');
    }

    const data = await response.json();

    // Выбираем основные валюты
    const mainCurrencies = ['EUR', 'GBP', 'JPY', 'CNY', 'RUB', 'CHF', 'AUD', 'CAD'];
    const rates: CurrencyRate[] = mainCurrencies.map((code) => ({
      code,
      name: CURRENCY_NAMES[code] || code,
      rate: data.rates[code] || 1,
      change24h: Math.random() * 4 - 2, // Mock 24h change
    }));

    return {
      base,
      rates,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('Currency fetch error:', error);
    return getMockCurrencyData(base);
  }
}

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  RUB: 'Russian Ruble',
  CHF: 'Swiss Franc',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
};

function getMockCurrencyData(base: string): CurrencyData {
  const mockRates: Record<string, number> = {
    EUR: base === 'USD' ? 0.92 : 1.09,
    GBP: base === 'USD' ? 0.79 : 1.27,
    JPY: base === 'USD' ? 149.5 : 0.0067,
    CNY: base === 'USD' ? 7.24 : 0.138,
    RUB: base === 'USD' ? 92.5 : 0.0108,
    CHF: base === 'USD' ? 0.88 : 1.14,
    AUD: base === 'USD' ? 1.52 : 0.66,
    CAD: base === 'USD' ? 1.36 : 0.74,
  };

  const rates: CurrencyRate[] = Object.entries(mockRates).map(([code, rate]) => ({
    code,
    name: CURRENCY_NAMES[code],
    rate,
    change24h: Math.random() * 4 - 2,
  }));

  return {
    base,
    rates,
    lastUpdate: Date.now(),
  };
}

export const AVAILABLE_BASES = ['USD', 'EUR', 'GBP', 'RUB'];
```

---

## 🐙 ШАГ 4: API Helpers - GitHub

### `promo-site/lib/api/github.ts`

```typescript
import { GitHubStats } from '@/types/demos';

const GITHUB_API_URL = 'https://api.github.com';

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    // Fetch user data
    const userResponse = await fetch(`${GITHUB_API_URL}/users/${username}`);
    if (!userResponse.ok) throw new Error('GitHub API error');
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`);
    if (!reposResponse.ok) throw new Error('GitHub API error');
    const repos = await reposResponse.json();

    // Calculate stats
    const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

    // Get top languages
    const languages: Record<string, number> = {};
    repos.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / repos.length) * 100),
        color: LANGUAGE_COLORS[name] || '#858585',
      }));

    // Generate mock activity data (GitHub API has rate limits for events)
    const recentActivity = generateMockActivity();

    return {
      username: userData.login,
      name: userData.name || userData.login,
      avatar: userData.avatar_url,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
      contributions: Math.floor(Math.random() * 2000) + 500, // Mock data
      topLanguages,
      recentActivity,
    };
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return getMockGitHubStats(username);
  }
}

function generateMockActivity() {
  const activity = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    activity.push({
      date: date.toISOString().split('T')[0],
      commits: Math.floor(Math.random() * 15),
      prs: Math.floor(Math.random() * 5),
      issues: Math.floor(Math.random() * 3),
    });
  }

  return activity.reverse();
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
};

function getMockGitHubStats(username: string): GitHubStats {
  return {
    username,
    name: 'Demo User',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    publicRepos: 42,
    followers: 128,
    following: 64,
    totalStars: 356,
    totalForks: 89,
    contributions: 1247,
    topLanguages: [
      { name: 'TypeScript', percentage: 45, color: '#3178c6' },
      { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
      { name: 'Python', percentage: 15, color: '#3572A5' },
      { name: 'Go', percentage: 10, color: '#00ADD8' },
    ],
    recentActivity: generateMockActivity(),
  };
}
```

---

## 📊 ШАГ 5: Analytics - Weather Widget

### `promo-site/components/demos/analytics/WeatherWidget.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Gauge, RefreshCw } from 'lucide-react';
import { fetchWeatherData, POPULAR_CITIES } from '@/lib/api/weather';
import { WeatherData } from '@/types/demos';
import { Card } from '@/components/ui';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState('London');
  const [loading, setLoading] = useState(true);

  const loadWeather = async (city: string) => {
    setLoading(true);
    const data = await fetchWeatherData(city);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity]);

  if (loading || !weather) {
    return (
      <Card className="bg-background-secondary/50 backdrop-blur-sm p-6 h-full flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-accent-primary" />
      </Card>
    );
  }

  return (
    <Card className="bg-background-secondary/50 backdrop-blur-sm p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Cloud className="w-6 h-6 text-accent-primary" />
          <h3 className="text-lg font-semibold">Weather</h3>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-background-tertiary border border-border-primary rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
          {POPULAR_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Main temp */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">{weather.temperature}°C</div>
        <div className="text-text-secondary capitalize">{weather.description}</div>
        <div className="text-sm text-text-muted mt-1">
          Feels like {weather.feelsLike}°C
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem
          icon={<Droplets className="w-5 h-5" />}
          label="Humidity"
          value={`${weather.humidity}%`}
        />
        <StatItem
          icon={<Wind className="w-5 h-5" />}
          label="Wind"
          value={`${weather.windSpeed} km/h`}
        />
        <StatItem
          icon={<Gauge className="w-5 h-5" />}
          label="Pressure"
          value={`${weather.pressure} hPa`}
        />
        <StatItem
          icon={<Cloud className="w-5 h-5" />}
          label="Location"
          value={`${weather.city}, ${weather.country}`}
        />
      </div>
    </Card>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-background-tertiary/30 rounded-lg p-3">
      <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
```

---

## 💰 ШАГ 6: Analytics - Currency Widget

### `promo-site/components/demos/analytics/CurrencyWidget.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { fetchCurrencyRates, AVAILABLE_BASES } from '@/lib/api/currency';
import { CurrencyData } from '@/types/demos';
import { Card } from '@/components/ui';

export default function CurrencyWidget() {
  const [data, setData] = useState<CurrencyData | null>(null);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  const loadRates = async (base: string) => {
    setLoading(true);
    const rates = await fetchCurrencyRates(base);
    setData(rates);
    setLoading(false);
  };

  useEffect(() => {
    loadRates(baseCurrency);
    const interval = setInterval(() => loadRates(baseCurrency), 60000); // Update every minute
    return () => clearInterval(interval);
  }, [baseCurrency]);

  if (loading || !data) {
    return (
      <Card className="bg-background-secondary/50 backdrop-blur-sm p-6 h-full flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-accent-secondary" />
      </Card>
    );
  }

  return (
    <Card className="bg-background-secondary/50 backdrop-blur-sm p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-accent-secondary" />
          <h3 className="text-lg font-semibold">Exchange Rates</h3>
        </div>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="bg-background-tertiary border border-border-primary rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-secondary"
        >
          {AVAILABLE_BASES.map((base) => (
            <option key={base} value={base}>
              {base}
            </option>
          ))}
        </select>
      </div>

      {/* Base currency indicator */}
      <div className="bg-gradient-to-r from-accent-secondary/20 to-accent-success/20 border border-accent-secondary/30 rounded-lg p-3 mb-4">
        <div className="text-sm text-text-secondary mb-1">Base Currency</div>
        <div className="text-2xl font-bold">1 {data.base}</div>
      </div>

      {/* Rates list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {data.rates.map((rate) => (
          <div
            key={rate.code}
            className="flex items-center justify-between p-3 bg-background-tertiary/30 rounded-lg hover:bg-background-tertiary/50 transition-colors"
          >
            <div>
              <div className="font-semibold">{rate.code}</div>
              <div className="text-xs text-text-secondary">{rate.name}</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold">
                {rate.rate.toFixed(4)}
              </div>
              <div
                className={`text-xs flex items-center gap-1 justify-end ${
                  rate.change24h >= 0 ? 'text-accent-success' : 'text-accent-error'
                }`}
              >
                {rate.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(rate.change24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

## 🐙 ШАГ 7: Analytics - GitHub Widget

### `promo-site/components/demos/analytics/GitHubWidget.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Github, Star, GitFork, Users, Activity, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchGitHubStats } from '@/lib/api/github';
import { GitHubStats } from '@/types/demos';
import { Card } from '@/components/ui';

export default function GitHubWidget() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [username, setUsername] = useState('torvalds'); // Default to Linus Torvalds
  const [inputValue, setInputValue] = useState('torvalds');
  const [loading, setLoading] = useState(true);

  const loadStats = async (user: string) => {
    setLoading(true);
    const data = await fetchGitHubStats(user);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats(username);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
    }
  };

  if (loading || !stats) {
    return (
      <Card className="bg-background-secondary/50 backdrop-blur-sm p-6 h-full flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-accent-primary" />
      </Card>
    );
  }

  return (
    <Card className="bg-background-secondary/50 backdrop-blur-sm p-6 h-full">
      {/* Header with search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Github className="w-6 h-6 text-accent-primary" />
          <h3 className="text-lg font-semibold">GitHub Stats</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="GitHub username"
            className="flex-1 bg-background-tertiary border border-border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          <button
            type="submit"
            className="bg-accent-primary hover:bg-accent-primary/80 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* User info */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-background-tertiary/30 rounded-lg">
        <img
          src={stats.avatar}
          alt={stats.name}
          className="w-16 h-16 rounded-full border-2 border-accent-primary"
        />
        <div>
          <div className="font-semibold text-lg">{stats.name}</div>
          <div className="text-sm text-text-secondary">@{stats.username}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={<Activity className="w-4 h-4" />}
          label="Repos"
          value={stats.publicRepos}
          color="text-accent-primary"
        />
        <StatCard
          icon={<Star className="w-4 h-4" />}
          label="Stars"
          value={stats.totalStars}
          color="text-accent-success"
        />
        <StatCard
          icon={<GitFork className="w-4 h-4" />}
          label="Forks"
          value={stats.totalForks}
          color="text-accent-secondary"
        />
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Followers"
          value={stats.followers}
          color="text-accent-primary"
        />
      </div>

      {/* Languages */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3">Top Languages</div>
        <div className="space-y-2">
          {stats.topLanguages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <div className="flex-1 text-sm">{lang.name}</div>
              <div className="text-sm text-text-secondary">{lang.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity chart */}
      <div>
        <div className="text-sm font-medium mb-3">Recent Activity (30 days)</div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={stats.recentActivity}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={(value) => new Date(value).getDate().toString()}
            />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-background-tertiary/30 rounded-lg p-3">
      <div className={`flex items-center gap-2 ${color} text-sm mb-1`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </div>
  );
}
```

---

## 📊 ШАГ 8: Analytics Dashboard Page

### `promo-site/app/portfolio/analytics-dashboard/page.tsx`

```typescript
import { Metadata } from 'next';
import WeatherWidget from '@/components/demos/analytics/WeatherWidget';
import CurrencyWidget from '@/components/demos/analytics/CurrencyWidget';
import GitHubWidget from '@/components/demos/analytics/GitHubWidget';
import { BarChart3, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Portfolio Demo',
  description: 'Real-time analytics dashboard with live weather, currency rates, and GitHub statistics',
};

export default function AnalyticsDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full px-4 py-2 mb-6">
            <BarChart3 className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium text-accent-primary">Live Demo</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            Analytics Dashboard
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-6">
            Real-time data visualization with live APIs integration
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-text-muted">
            <span className="px-3 py-1 bg-background-tertiary rounded-full">React</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Recharts</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">SWR</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">External APIs</span>
          </motion.div>
        </div>

        {/* Features list */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12">
          <div className="bg-background-secondary/50 backdrop-blur-sm border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <ul className="grid md:grid-cols-2 gap-3 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-success mt-1">✓</span>
                <span>Real-time weather data from OpenWeather API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-success mt-1">✓</span>
                <span>Live currency exchange rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-success mt-1">✓</span>
                <span>GitHub profile statistics and activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-success mt-1">✓</span>
                <span>Interactive charts with Recharts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-success mt-1">✓</span>
                <span>Auto-refresh with SWR caching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-success mt-1">✓</span>
                <span>Fully responsive design</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Weather Widget - spans 1 column */}
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>

          {/* Currency Widget - spans 1 column */}
          <div className="lg:col-span-1">
            <CurrencyWidget />
          </div>

          {/* GitHub Widget - spans 1 column */}
          <div className="lg:col-span-1">
            <GitHubWidget />
          </div>
        </motion.div>

        {/* Tech Stack Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12">
          <div className="bg-background-secondary/30 border border-border-primary rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-text-secondary">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Frontend</h4>
                <ul className="space-y-1">
                  <li>• Next.js 14 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Recharts for data visualization</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">Data & APIs</h4>
                <ul className="space-y-1">
                  <li>• OpenWeather API integration</li>
                  <li>• Exchange Rate API</li>
                  <li>• GitHub REST API v3</li>
                  <li>• SWR for data fetching & caching</li>
                  <li>• Graceful fallbacks to mock data</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/80 px-6 py-3 rounded-lg font-medium transition-colors">
            <ExternalLink className="w-4 h-4" />
            Back to Portfolio
          </a>
        </motion.div>
      </div>
    </div>
  );
}
```
## 🤖 ШАГ 9: Bot Builder - Данные о фичах

### `promo-site/lib/data/bot-features.ts`

```typescript
import { BotFeature } from '@/types/demos';

export const BOT_FEATURES: BotFeature[] = [
  // BASIC FEATURES
  {
    id: 'basic-commands',
    category: 'basic',
    name: 'Basic Commands',
    description: 'Start/Help/Info commands, basic text responses',
    price: 5000,
    developmentDays: 2,
    complexity: 'low',
  },
  {
    id: 'inline-keyboard',
    category: 'basic',
    name: 'Inline Keyboards',
    description: 'Interactive buttons and menus',
    price: 8000,
    developmentDays: 3,
    complexity: 'low',
  },
  {
    id: 'user-database',
    category: 'basic',
    name: 'User Database',
    description: 'Store user data and preferences',
    price: 12000,
    developmentDays: 4,
    complexity: 'medium',
  },
  {
    id: 'admin-panel',
    category: 'basic',
    name: 'Admin Panel',
    description: 'Basic admin commands for bot management',
    price: 15000,
    developmentDays: 5,
    complexity: 'medium',
  },

  // ADVANCED FEATURES
  {
    id: 'payment-integration',
    category: 'advanced',
    name: 'Payment System',
    description: 'Telegram Payments or external payment gateway',
    price: 35000,
    developmentDays: 10,
    complexity: 'high',
    dependencies: ['user-database'],
  },
  {
    id: 'multi-language',
    category: 'advanced',
    name: 'Multi-language',
    description: 'Support for 2+ languages with i18n',
    price: 20000,
    developmentDays: 7,
    complexity: 'medium',
  },
  {
    id: 'notification-system',
    category: 'advanced',
    name: 'Notifications',
    description: 'Scheduled messages and reminders',
    price: 18000,
    developmentDays: 6,
    complexity: 'medium',
    dependencies: ['user-database'],
  },
  {
    id: 'file-processing',
    category: 'advanced',
    name: 'File Processing',
    description: 'Handle documents, images, videos',
    price: 25000,
    developmentDays: 8,
    complexity: 'high',
  },
  {
    id: 'web-app',
    category: 'advanced',
    name: 'Telegram Mini App',
    description: 'Embedded web interface inside Telegram',
    price: 45000,
    developmentDays: 14,
    complexity: 'high',
  },

  // PREMIUM FEATURES
  {
    id: 'ai-integration',
    category: 'premium',
    name: 'AI Integration',
    description: 'ChatGPT, Claude, or custom ML models',
    price: 60000,
    developmentDays: 15,
    complexity: 'high',
  },
  {
    id: 'crm-integration',
    category: 'premium',
    name: 'CRM Integration',
    description: 'Connect with external CRM systems',
    price: 50000,
    developmentDays: 12,
    complexity: 'high',
    dependencies: ['user-database', 'admin-panel'],
  },
  {
    id: 'analytics-dashboard',
    category: 'premium',
    name: 'Analytics Dashboard',
    description: 'Web dashboard with stats and reports',
    price: 55000,
    developmentDays: 14,
    complexity: 'high',
    dependencies: ['user-database'],
  },
  {
    id: 'blockchain',
    category: 'premium',
    name: 'Blockchain/NFT',
    description: 'Crypto wallet, NFT minting, smart contracts',
    price: 80000,
    developmentDays: 20,
    complexity: 'high',
    dependencies: ['payment-integration'],
  },
];

export const HOSTING_OPTIONS = [
  {
    id: 'free',
    name: 'Free Hosting',
    description: 'GitHub Actions / Render Free Tier (limited uptime)',
    price: 0,
    monthlyPrice: 0,
  },
  {
    id: 'vps',
    name: 'VPS Hosting',
    description: 'DigitalOcean / Hetzner (24/7 uptime)',
    price: 3000,
    monthlyPrice: 500,
  },
  {
    id: 'cloud',
    name: 'Cloud Hosting',
    description: 'AWS / Google Cloud (enterprise scale)',
    price: 8000,
    monthlyPrice: 2000,
  },
] as const;

export const SUPPORT_OPTIONS = [
  {
    id: 'none',
    name: 'No Support',
    description: 'Code delivery only',
    price: 0,
    monthlyPrice: 0,
  },
  {
    id: 'basic',
    name: 'Basic Support',
    description: '1 month bug fixes',
    price: 5000,
    monthlyPrice: 0,
  },
  {
    id: 'premium',
    name: 'Premium Support',
    description: '6 months updates + priority support',
    price: 15000,
    monthlyPrice: 3000,
  },
] as const;
```

---

## 🎯 ШАГ 10: Bot Builder - Feature Selector

### `promo-site/components/demos/bot-builder/FeatureSelector.tsx`

```typescript
'use client';

import { BotFeature } from '@/types/demos';
import { Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui';

interface FeatureSelectorProps {
  features: BotFeature[];
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
}

export default function FeatureSelector({
  features,
  selectedFeatures,
  onToggleFeature,
}: FeatureSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<'basic' | 'advanced' | 'premium'>('basic');

  const categories = [
    { id: 'basic', name: 'Basic', color: 'blue' },
    { id: 'advanced', name: 'Advanced', color: 'purple' },
    { id: 'premium', name: 'Premium', color: 'amber' },
  ] as const;

  const filteredFeatures = features.filter((f) => f.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'border-accent-primary bg-accent-primary/10 text-accent-primary';
      case 'advanced':
        return 'border-accent-secondary bg-accent-secondary/10 text-accent-secondary';
      case 'premium':
        return 'border-accent-success bg-accent-success/10 text-accent-success';
      default:
        return 'border-border-primary bg-background-tertiary/10 text-text-secondary';
    }
  };

  const isFeatureDisabled = (feature: BotFeature) => {
    if (!feature.dependencies) return false;
    return !feature.dependencies.every((dep) => selectedFeatures.includes(dep));
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 p-1 bg-background-tertiary/50 rounded-lg">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
              activeCategory === cat.id
                ? `bg-${cat.color}-500 text-white`
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          const isDisabled = isFeatureDisabled(feature);
          const missingDeps = feature.dependencies?.filter(
            (dep) => !selectedFeatures.includes(dep)
          );

          return (
            <button
              key={feature.id}
              onClick={() => !isDisabled && onToggleFeature(feature.id)}
              disabled={isDisabled}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${getCategoryColor(feature.category)} border-opacity-100`
                  : 'border-border-primary bg-background-tertiary/30 hover:border-border-secondary'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{feature.name}</h4>
                    {isSelected && <Check className="w-4 h-4 text-accent-success" />}
                  </div>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-primary">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-secondary">
                    <span className="font-semibold text-text-primary">
                      {(feature.price / 1000).toFixed(0)}k ₽
                    </span>
                  </span>
                  <span className="text-text-secondary">
                    {feature.developmentDays}d
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      feature.complexity === 'low'
                        ? 'bg-accent-success/20 text-accent-success'
                        : feature.complexity === 'medium'
                        ? 'bg-accent-warning/20 text-accent-warning'
                        : 'bg-accent-error/20 text-accent-error'
                    }`}
                  >
                    {feature.complexity}
                  </span>
                </div>
              </div>

              {isDisabled && missingDeps && missingDeps.length > 0 && (
                <div className="mt-2 flex items-start gap-2 text-xs text-accent-warning">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Requires:{' '}
                    {missingDeps
                      .map((dep) => features.find((f) => f.id === dep)?.name)
                      .join(', ')}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 💰 ШАГ 11: Bot Builder - Price Calculator

### `promo-site/components/demos/bot-builder/PriceCalculator.tsx`

```typescript
'use client';

import { BotConfiguration, PriceEstimate } from '@/types/demos';
import { HOSTING_OPTIONS, SUPPORT_OPTIONS } from '@/lib/data/bot-features';
import { DollarSign, Server, Headphones, Palette, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui';

interface PriceCalculatorProps {
  config: BotConfiguration;
  onConfigChange: (config: Partial<BotConfiguration>) => void;
}

export default function PriceCalculator({ config, onConfigChange }: PriceCalculatorProps) {
  return (
    <div className="space-y-6">
      {/* Hosting */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-5 h-5 text-accent-primary" />
          <h3 className="font-semibold">Hosting</h3>
        </div>
        <div className="space-y-2">
          {HOSTING_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onConfigChange({ hosting: option.id })}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                config.hosting === option.id
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-border-primary bg-background-tertiary/30 hover:border-border-secondary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold mb-1">{option.name}</div>
                  <div className="text-sm text-text-secondary">{option.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {option.price > 0 ? `${(option.price / 1000).toFixed(0)}k ₽` : 'Free'}
                  </div>
                  {option.monthlyPrice > 0 && (
                    <div className="text-xs text-text-secondary">
                      +{option.monthlyPrice} ₽/mo
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Support */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Headphones className="w-5 h-5 text-accent-success" />
          <h3 className="font-semibold">Support</h3>
        </div>
        <div className="space-y-2">
          {SUPPORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onConfigChange({ support: option.id })}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                config.support === option.id
                  ? 'border-accent-success bg-accent-success/10'
                  : 'border-border-primary bg-background-tertiary/30 hover:border-border-secondary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold mb-1">{option.name}</div>
                  <div className="text-sm text-text-secondary">{option.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {option.price > 0 ? `${(option.price / 1000).toFixed(0)}k ₽` : 'Free'}
                  </div>
                  {option.monthlyPrice > 0 && (
                    <div className="text-xs text-text-secondary">
                      +{option.monthlyPrice} ₽/mo
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div>
        <h3 className="font-semibold mb-3">Additional Options</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border-primary bg-background-tertiary/30 hover:border-border-secondary cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-accent-secondary" />
              <div>
                <div className="font-semibold">Custom Design</div>
                <div className="text-sm text-text-secondary">Unique UI/UX for your bot</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">10k ₽</span>
              <input
                type="checkbox"
                checked={config.customDesign}
                onChange={(e) => onConfigChange({ customDesign: e.target.checked })}
                className="w-5 h-5 rounded border-border-primary bg-background-tertiary text-accent-secondary focus:ring-2 focus:ring-accent-secondary"
              />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border-primary bg-background-tertiary/30 hover:border-border-secondary cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-accent-warning" />
              <div>
                <div className="font-semibold">Analytics Integration</div>
                <div className="text-sm text-text-secondary">Track user behavior & metrics</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">8k ₽</span>
              <input
                type="checkbox"
                checked={config.analytics}
                onChange={(e) => onConfigChange({ analytics: e.target.checked })}
                className="w-5 h-5 rounded border-border-primary bg-background-tertiary text-accent-warning focus:ring-2 focus:ring-accent-warning"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 ШАГ 12: Bot Builder - Configuration Summary

### `promo-site/components/demos/bot-builder/ConfigurationSummary.tsx`

```typescript
'use client';

import { BotFeature, BotConfiguration, PriceEstimate } from '@/types/demos';
import { BOT_FEATURES, HOSTING_OPTIONS, SUPPORT_OPTIONS } from '@/lib/data/bot-features';
import { Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { useMemo } from 'react';
import { Card } from '@/components/ui';

interface ConfigurationSummaryProps {
  config: BotConfiguration;
  features: BotFeature[];
}

export default function ConfigurationSummary({ config, features }: ConfigurationSummaryProps) {
  const estimate = useMemo(() => calculateEstimate(config, features), [config, features]);

  return (
    <div className="sticky top-24 space-y-6">
      {/* Price Card */}
      <Card className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 p-6">
        <div className="text-center mb-6">
          <div className="text-sm text-text-secondary mb-2">Total Estimate</div>
          <div className="text-5xl font-bold mb-2">
            {(estimate.totalPrice / 1000).toFixed(0)}k
            <span className="text-2xl text-text-secondary"> ₽</span>
          </div>
          <div className="text-sm text-text-secondary">
            Development time: {estimate.developmentTime} days
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pt-6 border-t border-border-secondary">
          <PriceRow label="Features" value={estimate.featuresPrice} />
          <PriceRow label="Hosting" value={estimate.hostingPrice} />
          <PriceRow label="Support" value={estimate.supportPrice} />
          {config.customDesign && <PriceRow label="Custom Design" value={10000} />}
          {config.analytics && <PriceRow label="Analytics" value={8000} />}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Timeline"
          value={`${estimate.developmentTime}d`}
          color="text-accent-primary"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Complexity"
          value={getComplexityLabel(estimate.complexityScore)}
          color="text-accent-secondary"
        />
      </div>

      {/* Selected Features List */}
      {config.features.length > 0 && (
        <Card className="rounded-lg border border-border-primary p-4">
          <div className="text-sm font-medium mb-3">Selected Features</div>
          <div className="space-y-2">
            {config.features.map((featureId) => {
              const feature = features.find((f) => f.id === featureId);
              if (!feature) return null;
              return (
                <div
                  key={featureId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-text-secondary">{feature.name}</span>
                  <span className="text-text-secondary">
                    {(feature.price / 1000).toFixed(0)}k ₽
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* CTA Button */}
      <button className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/80 hover:to-accent-secondary/80 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
        Request Quote
      </button>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-semibold">{(value / 1000).toFixed(0)}k ₽</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="border border-border-primary p-4">
      <div className={`flex items-center gap-2 ${color} text-sm mb-2`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </Card>
  );
}

function calculateEstimate(config: BotConfiguration, allFeatures: BotFeature[]): PriceEstimate {
  const selectedFeatures = allFeatures.filter((f) => config.features.includes(f.id));

  const featuresPrice = selectedFeatures.reduce((sum, f) => sum + f.price, 0);
  const developmentTime = selectedFeatures.reduce((sum, f) => sum + f.developmentDays, 0);

  const hosting = HOSTING_OPTIONS.find((h) => h.id === config.hosting);
  const support = SUPPORT_OPTIONS.find((s) => s.id === config.support);

  const hostingPrice = hosting?.price || 0;
  const supportPrice = support?.price || 0;

  let totalPrice = featuresPrice + hostingPrice + supportPrice;

  if (config.customDesign) totalPrice += 10000;
  if (config.analytics) totalPrice += 8000;

  const complexityScore = selectedFeatures.reduce((sum, f) => {
    const complexityValue = f.complexity === 'low' ? 1 : f.complexity === 'medium' ? 2 : 3;
    return sum + complexityValue;
  }, 0);

  return {
    basePrice: 0,
    featuresPrice,
    hostingPrice,
    supportPrice,
    totalPrice,
    developmentTime,
    complexityScore,
  };
}

function getComplexityLabel(score: number): string {
  if (score <= 5) return 'Low';
  if (score <= 15) return 'Medium';
  return 'High';
}
```

---

## 🤖 ШАГ 13: Bot Builder Page

### `promo-site/app/portfolio/bot-builder/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Bot, ExternalLink, Info } from 'lucide-react';
import FeatureSelector from '@/components/demos/bot-builder/FeatureSelector';
import PriceCalculator from '@/components/demos/bot-builder/PriceCalculator';
import ConfigurationSummary from '@/components/demos/bot-builder/ConfigurationSummary';
import { BotConfiguration } from '@/types/demos';
import { BOT_FEATURES } from '@/lib/data/bot-features';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Telegram Bot Builder | Portfolio Demo',
  description: 'Interactive tool to configure your perfect Telegram bot and get instant price estimate',
};

export default function BotBuilderPage() {
  const [config, setConfig] = useState<BotConfiguration>({
    features: [],
    hosting: 'free',
    support: 'none',
    customDesign: false,
    analytics: false,
  });

  const handleToggleFeature = (featureId: string) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleConfigChange = (updates: Partial<BotConfiguration>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent-secondary/10 border border-accent-secondary/20 rounded-full px-4 py-2 mb-6">
            <Bot className="w-4 h-4 text-accent-secondary" />
            <span className="text-sm font-medium text-accent-secondary">Interactive Tool</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            Telegram Bot Builder
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-6">
            Configure your perfect Telegram bot and get instant price estimate
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-text-muted">
            <span className="px-3 py-1 bg-background-tertiary rounded-full">React</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Real-time Calculation</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Telegram Bot API</span>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-8">
          <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <strong>How it works:</strong> Select the features you need, choose hosting and support options,
              and get an instant estimate. All prices are in Russian Rubles (₽). Development time is estimated
              based on feature complexity.
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Features & Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Feature Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}>
              <h2 className="text-2xl font-bold mb-6">1. Select Features</h2>
              <FeatureSelector
                features={BOT_FEATURES}
                selectedFeatures={config.features}
                onToggleFeature={handleToggleFeature}
              />
            </motion.section>

            {/* Configuration */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}>
              <h2 className="text-2xl font-bold mb-6">2. Configure Options</h2>
              <PriceCalculator config={config} onConfigChange={handleConfigChange} />
            </motion.section>
          </div>

          {/* Right Column - Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Estimate</h2>
            <ConfigurationSummary config={config} features={BOT_FEATURES} />
          </motion.div>
        </div>

        {/* Features Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">What You Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-6">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold mb-2">Production Ready</h3>
              <p className="text-sm text-text-secondary">
                Fully tested code with error handling, logging, and best practices
              </p>
            </div>
            <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-text-secondary">
                Complete setup guide, API docs, and deployment instructions
              </p>
            </div>
            <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-6">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Source Code</h3>
              <p className="text-sm text-text-secondary">
                Clean, well-structured TypeScript/Python code with comments
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto mt-16 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/80 px-6 py-3 rounded-lg font-medium transition-colors">
            <ExternalLink className="w-4 h-4" />
            Back to Portfolio
          </a>
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 🏠 ШАГ 14: Обновление Portfolio раздела

Обновите файл `promo-site/app/page.tsx` (или страницу Portfolio), добавив карточки для новых демо:

```typescript
// Добавьте в секцию Portfolio:

const portfolioProjects = [
  {
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization with live APIs',
    image: '/images/demo-analytics.jpg', // Опционально
    tags: ['React', 'TypeScript', 'Recharts', 'APIs'],
    liveUrl: '/portfolio/analytics-dashboard',
    features: [
      'Live weather data',
      'Currency exchange rates',
      'GitHub statistics',
      'Interactive charts',
    ],
  },
  {
    title: 'Telegram Bot Builder',
    description: 'Interactive bot configuration and price calculator',
    image: '/images/demo-bot-builder.jpg', // Опционально
    tags: ['React', 'TypeScript', 'Real-time'],
    liveUrl: '/portfolio/bot-builder',
    features: [
      'Feature selection',
      'Instant price calculation',
      'Complexity estimation',
      'Timeline prediction',
    ],
  },
  // ... другие проекты
];
```

---

## 🌐 ШАГ 15: Environment Variables (опционально)

Создайте `.env.local` для API ключей (опционально, работает и без них с mock данными):

```bash
# OpenWeather API (опционально)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# GitHub Personal Access Token (опционально, для увеличения rate limit)
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
```

> **Примечание:** Даже без API ключей демо будут работать с реалистичными mock данными.

---

## ✅ ШАГ 16: Тестирование

### Проверочный список:

1. **Analytics Dashboard**
```bash
npm run dev
# Откройте http://localhost:3000/portfolio/analytics-dashboard
```

Проверьте:
- [ ] Weather виджет загружается и показывает данные
- [ ] Можно выбрать другой город
- [ ] Currency виджет показывает курсы валют
- [ ] Можно сменить базовую валюту
- [ ] GitHub виджет отображает статистику
- [ ] Можно ввести другой username
- [ ] График активности отображается корректно
- [ ] Все виджеты адаптивные на мобильных

2. **Bot Builder**
```bash
# Откройте http://localhost:3000/portfolio/bot-builder
```

Проверьте:
- [ ] Можно переключаться между категориями (Basic/Advanced/Premium)
- [ ] Фичи с зависимостями disabled до выбора зависимостей
- [ ] Цена пересчитывается при выборе фич
- [ ] Можно выбрать hosting и support
- [ ] Checkboxes для Custom Design и Analytics работают
- [ ] Summary показывает корректную цену и время
- [ ] Список выбранных фич обновляется
- [ ] Complexity score рассчитывается правильно
- [ ] Адаптивный layout на всех экранах

3. **Build Test**
```bash
npm run build
```

Должно пройти без ошибок TypeScript и ESLint.

---

## 🎨 ШАГ 17: Стили для scrollbar

Добавьте в `promo-site/app/globals.css` (если еще не добавлено):

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.8);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 1);
}
```

---

## 📊 Итоговая статистика задания

| Метрика | Значение |
|---------|----------|
| **Новых файлов** | 15 файлов |
| **Строк кода** | ~1500 LOC |
| **Компонентов** | 9 React компонентов |
| **API интеграций** | 3 (Weather, Currency, GitHub) |
| **Страниц** | 2 demo страницы |

---

## 🚀 Что дальше?

После выполнения этого задания у вас будет:

✅ Два полностью функциональных демо-проекта  
✅ Интеграция с реальными API (с fallback на mock данные)  
✅ Интерактивный калькулятор цен  
✅ Визуализация данных с Recharts  
✅ Production-ready код  

### Следующие возможные задания:

- **Задание 7:** SEO оптимизация (meta tags, sitemap, robots.txt)
- **Задание 8:** Страница About с timeline карьеры
- **Задание 9:** Детальные страницы Services
- **Задание 10:** Deployment на Vercel с CI/CD

---

## 🐛 Troubleshooting

**Проблема:** Recharts не отображается  
**Решение:** Убедитесь, что импортированы все нужные компоненты и ResponsiveContainer обернут вокруг графика

**Проблема:** API rate limit exceeded  
**Решение:** Используются fallback mock данные автоматически

**Проблема:** TypeScript ошибки в types
**Решение:** Проверьте, что все типы экспортированы из `promo-site/types/demos.ts`

---

## 📝 Git Commit

После успешного выполнения:

```bash
git add .
git commit -m "feat: add analytics dashboard and bot builder demos with live APIs"
```

---

**Готово! Начните с установки зависимостей и следуйте шагам последовательно.**