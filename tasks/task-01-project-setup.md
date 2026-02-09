# ЗАДАНИЕ 1: Инициализация проекта и базовая настройка

## Цель
Создать базовую структуру Next.js проекта с TypeScript, Tailwind CSS и всеми необходимыми конфигурациями.

## Контекст
Это промо-сайт для IT-разработчика в стиле Warp.dev/Cursor.com. Темная тема, высокий контраст, моноширинные шрифты, "кодовая" эстетика.

## Требования к выполнению

### 1. Инициализация Next.js проекта
```bash
npx create-next-app@latest promo-site --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd promo-site
```

### 2. Установка зависимостей
```bash
npm install framer-motion lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install -D @types/node
```

### 3. Создание структуры директорий

Создайте следующие директории:
```
promo-site/
├── app/
│   ├── api/
│   ├── services/
│   ├── portfolio/
│   ├── about/
│   ├── contact/
│   └── demos/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── demos/
│   └── forms/
├── lib/
├── hooks/
├── types/
└── public/
    └── images/
```

### 4. Настройка Tailwind CSS

Создайте файл `tailwind.config.ts` с этим содержимым:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0a',
          secondary: '#1a1a1a',
          tertiary: '#2a2a2a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a3a3a3',
          muted: '#666666',
        },
        accent: {
          primary: '#00d9ff',
          secondary: '#a855f7',
          success: '#10b981',
          error: '#ef4444',
        },
        border: {
          primary: '#333333',
          secondary: '#444444',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 217, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

### 5. Настройка глобальных стилей

Создайте файл `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border-primary;
  }
  
  body {
    @apply bg-background-primary text-text-primary antialiased;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-background-secondary;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-background-tertiary rounded-lg;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-border-secondary;
  }
}

@layer utilities {
  /* Grid pattern background */
  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(51, 51, 51, 0.3) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(51, 51, 51, 0.3) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  
  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent;
  }
  
  /* Glow effect */
  .glow-accent {
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  }
  
  .glow-accent-hover:hover {
    box-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
  }
}

@layer components {
  /* Container */
  .container {
    @apply max-w-7xl mx-auto;
  }
  
  /* Section spacing */
  .section {
    @apply py-20 px-4;
  }
}
```

### 6. Настройка шрифтов

Обновите `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = localFont({
  src: [
    {
      path: '../public/fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/JetBrainsMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: "Ваше Имя | Fullstack Developer",
  description: "Разрабатываю digital-инструменты, которые решают задачи бизнеса",
  keywords: ["telegram bot", "web development", "react", "next.js", "fullstack"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### 7. Создание констант

Создайте файл `lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: 'Ваше Имя',
  title: 'Fullstack Developer',
  description: 'Разрабатываю digital-инструменты, которые решают задачи бизнеса',
  url: 'https://yoursite.dev',
  email: 'your@email.com',
  github: 'https://github.com/yourusername',
  telegram: 'https://t.me/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
};

export const TECH_STACK = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  backend: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
  mobile: ['React Native', 'Expo'],
  tools: ['Git', 'Docker', 'Vercel', 'Figma'],
  bots: ['Telegraf.js', 'Node.js', 'Webhooks'],
};

export const NAVIGATION = [
  { name: 'Главная', href: '/' },
  { name: 'Услуги', href: '/services' },
  { name: 'Портфолио', href: '/portfolio' },
  { name: 'О себе', href: '/about' },
  { name: 'Контакты', href: '/contact' },
];
```

### 8. Создание типов

Создайте файл `types/index.ts`:

```typescript
export type ProjectType = 'commercial' | 'demo' | 'pet-project' | 'opensource';

export interface Project {
  id: string;
  type: ProjectType;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveDemo?: string;
  github?: string;
  results?: {
    [key: string]: string;
  };
  features?: string[];
  testimonial?: {
    author: string;
    role: string;
    text: string;
  };
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  problem: string;
  solution: string;
  technologies: string[];
  benefits: string[];
  pricing?: {
    from: number;
    to: number;
    currency: string;
  };
}

export interface Testimonial {
  id: number;
  author: string;
  role: string;
  content: string;
  rating: number;
  project?: string;
}
```

### 9. Создание утилит

Создайте файл `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    commercial: 'Коммерческий проект',
    demo: 'Демо-проект',
    'pet-project': 'Pet-проект',
    opensource: 'Open Source',
  };
  return labels[type] || type;
}
```

### 10. Настройка ESLint и Prettier

Создайте файл `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
    "prefer-const": "error",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

Создайте файл `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100
}
```

### 11. Настройка environment variables

Создайте файл `.env.example`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API Keys (for demos)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
```

### 12. Обновление next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'api.github.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
}

module.exports = nextConfig
```

## Критерии приемки

✅ Проект успешно создан с Next.js 14 + TypeScript  
✅ Все зависимости установлены  
✅ Структура директорий создана  
✅ Tailwind настроен с кастомными цветами  
✅ Глобальные стили применены  
✅ Шрифты подключены (Inter + JetBrains Mono)  
✅ Константы и типы созданы  
✅ ESLint и Prettier настроены  
✅ Environment variables шаблон создан  
✅ Проект запускается без ошибок: `npm run dev`  

## Проверка

После выполнения запустите:
```bash
npm run dev
```

Откройте http://localhost:3000 - должна отобразиться стандартная стартовая страница Next.js без ошибок в консоли.

## Примечания

- Используйте строгий режим TypeScript
- Следуйте naming conventions: camelCase для переменных, PascalCase для компонентов
- Все пути импортов должны использовать alias `@/*`
- Git commit после выполнения: `git commit -m "feat: initial project setup"`
