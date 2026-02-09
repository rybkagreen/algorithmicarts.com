# ТЕХНИЧЕСКОЕ ЗАДАНИЕ ДЛЯ QWEN CODE
# Рефакторинг виджета валют (CurrencyWidget)

---

## 📋 МЕТАИНФОРМАЦИЯ

**Проект:** Analytics Dashboard - Currency Widget  
**Версия ТЗ:** 1.0  
**Дата создания:** 06.02.2026  
**Исполнитель:** QWEN CODE Agent  
**Приоритет:** КРИТИЧЕСКИЙ  
**Срок выполнения:** 3-4 рабочих дня  

---

## 🎯 ЦЕЛЬ ЗАДАЧИ

Привести виджет валют (CurrencyWidget) в соответствие с best practices разработки информационных дашбордов, обеспечив:
- Полную работоспособность всех функций
- Высокую производительность и оптимизацию
- Отличную доступность (A11y)
- Масштабируемую архитектуру
- Профессиональный UX/UI

---

## 📁 СТРУКТУРА ПРОЕКТА (Текущая)

```
/components/demos/analytics/
├── components/
│   ├── CurrencyWidget.tsx          # ❌ ТРЕБУЕТ ПОЛНОГО РЕФАКТОРИНГА
│   └── [другие компоненты]
├── hooks/
│   └── useCurrencyRates.ts         # ❌ ОТСУТСТВУЕТ - СОЗДАТЬ
├── types.ts
├── widgetRegistry.ts
└── demos.ts                         # Типы для данных

/app/api/
└── currency/
    └── route.ts                     # ⚠️ ТРЕБУЕТ ДОРАБОТКИ
```

---

## 🔨 ЗАДАЧИ ПО РЕАЛИЗАЦИИ

### ЭТАП 1: СОЗДАНИЕ ИНФРАСТРУКТУРЫ (День 1)

#### Задача 1.1: Создать хук `useCurrencyRates`
**Файл:** `/components/demos/analytics/hooks/useCurrencyRates.ts`

**Требования:**
```typescript
import useSWR from 'swr';

interface UseCurrencyRatesOptions {
  baseCurrency?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseCurrencyRatesReturn {
  data: CurrencyData | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
}

export function useCurrencyRates(
  baseCurrency: string = 'USD',
  options?: UseCurrencyRatesOptions
): UseCurrencyRatesReturn
```

**Функционал:**
1. Использовать SWR для кэширования и автообновления
2. Поддержка выбора базовой валюты
3. Настраиваемый интервал обновления (по умолчанию: отключен для CBR)
4. Обработка ошибок с retry-логикой (3 попытки с экспоненциальной задержкой)
5. Проверка Page Visibility API (не обновлять на скрытой вкладке)
6. Dedupe запросов (если несколько виджетов используют одни данные)
7. Кэширование в localStorage с TTL (24 часа для CBR)

**Пример использования:**
```typescript
const { data, error, isLoading, mutate } = useCurrencyRates('RUB', {
  refreshInterval: 0, // CBR обновляется раз в день
  enabled: true
});
```

---

#### Задача 1.2: Создать API-клиент для валют
**Файл:** `/lib/api/currencyClient.ts` (НОВЫЙ)

**Требования:**
```typescript
export class CurrencyApiClient {
  private baseUrl: string;
  
  async getRates(baseCurrency: string): Promise<CurrencyData>;
  async getHistoricalRates(
    baseCurrency: string, 
    days: number
  ): Promise<HistoricalCurrencyData>;
  async convertCurrency(
    amount: number, 
    from: string, 
    to: string
  ): Promise<number>;
}
```

**Функционал:**
1. Абстракция над API маршрутом `/api/currency`
2. Парсинг XML из CBR API в структурированный JSON
3. Вычисление `change24h` на основе сравнения с предыдущим рабочим днём
4. Обработка ошибок с детальными сообщениями
5. Типизация всех ответов
6. Поддержка отмены запросов (AbortController)

---

#### Задача 1.3: Улучшить API-роут
**Файл:** `/app/api/currency/route.ts`

**Изменения:**
1. ✅ Добавить endpoint для получения истории (последние 7 дней)
   ```typescript
   GET /api/currency/history?base=USD&days=7
   ```

2. ✅ Возвращать JSON вместо XML
   ```typescript
   return Response.json({
     base: 'RUB',
     rates: [
       { code: 'USD', name: 'US Dollar', rate: 75.5, change24h: -0.5 },
       // ...
     ],
     lastUpdate: 1707235200000,
     workingDate: '05.02.2026'
   });
   ```

3. ✅ Добавить вычисление change24h
   - Получать данные за сегодня и вчера (или последний рабочий день)
   - Вычислять процент изменения

4. ✅ Улучшить error handling
   ```typescript
   if (!cbrResponse.ok) {
     return Response.json({
       error: 'CBR_API_ERROR',
       message: 'Failed to fetch from Central Bank of Russia',
       statusCode: cbrResponse.status
     }, { status: 502 });
   }
   ```

5. ✅ Добавить rate limiting (10 запросов в минуту с одного IP)

6. ✅ Вынести RUSSIAN_HOLIDAYS в отдельный конфигурационный файл

---

### ЭТАП 2: РЕФАКТОРИНГ КОМПОНЕНТА (День 2)

#### Задача 2.1: Разделить CurrencyWidget на подкомпоненты

**Структура:**
```
/components/demos/analytics/widgets/currency/
├── CurrencyWidget.tsx                    # Главный контейнер
├── CurrencyWidgetHeader.tsx              # Заголовок с выбором валюты
├── CurrencyWidgetSkeleton.tsx            # Loader skeleton
├── CurrencyWidgetError.tsx               # Состояние ошибки
├── CurrencyWidgetEmpty.tsx               # Пустое состояние
├── CurrencyRateItem.tsx                  # Элемент списка валюты
├── CurrencyRateChart.tsx                 # Мини-график (sparkline)
└── index.ts                              # Экспорт
```

**Требования:**
1. Следовать принципу единственной ответственности
2. Все компоненты должны быть типизированы
3. Использовать композицию вместо наследования
4. Мемоизация тяжёлых вычислений с useMemo
5. Мемоизация колбэков с useCallback

---

#### Задача 2.2: Реализовать адаптивное отображение

**CurrencyWidget.tsx:**
```typescript
interface CurrencyWidgetProps {
  size: 'small' | 'medium' | 'large';
  baseCurrency?: string;
  favorites?: string[];
  maxItems?: number;
  showChart?: boolean;
}

export default function CurrencyWidget({
  size,
  baseCurrency = 'RUB',
  favorites = [],
  maxItems,
  showChart = true
}: CurrencyWidgetProps) {
  // Логика определения количества отображаемых валют
  const displayCount = useMemo(() => {
    if (maxItems) return maxItems;
    
    switch (size) {
      case 'small': return 1;
      case 'medium': return 5;
      case 'large': return 10;
      default: return 5;
    }
  }, [size, maxItems]);
  
  // Единый компонент с условным рендерингом
  return (
    <div className={cn('currency-widget', `currency-widget--${size}`)}>
      {/* Общий layout без дублирования */}
    </div>
  );
}
```

**Требования:**
1. ❌ Убрать дублирование JSX для разных размеров
2. ✅ Использовать CSS Grid/Flexbox для адаптивности
3. ✅ Динамически менять количество элементов через props
4. ✅ Использовать clsx/cn для условных классов

---

#### Задача 2.3: Создать компонент CurrencyRateItem

**Файл:** `CurrencyRateItem.tsx`

```typescript
interface CurrencyRateItemProps {
  rate: CurrencyRate;
  baseCurrency: string;
  showChart?: boolean;
  compact?: boolean;
  onFavorite?: (code: string) => void;
  isFavorite?: boolean;
}

export function CurrencyRateItem({
  rate,
  baseCurrency,
  showChart = false,
  compact = false,
  onFavorite,
  isFavorite = false
}: CurrencyRateItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="currency-rate-item"
      role="article"
      aria-label={`${rate.name} exchange rate`}
    >
      <div className="currency-rate-item__info">
        <div className="currency-rate-item__header">
          <span className="currency-rate-item__code">{rate.code}</span>
          {!compact && (
            <span className="currency-rate-item__name">{rate.name}</span>
          )}
        </div>
        
        <div className="currency-rate-item__value">
          <span className="currency-rate-item__rate">
            {formatCurrency(rate.rate, baseCurrency)}
          </span>
          
          <TrendIndicator change={rate.change24h} />
        </div>
      </div>
      
      {showChart && <CurrencyRateChart data={rate.history} />}
      
      {onFavorite && (
        <button
          onClick={() => onFavorite(rate.code)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="currency-rate-item__favorite"
        >
          <Star fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      )}
    </motion.div>
  );
}
```

---

#### Задача 2.4: Добавить TrendIndicator компонент

```typescript
interface TrendIndicatorProps {
  change: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendIndicator({ 
  change, 
  showValue = true,
  size = 'md' 
}: TrendIndicatorProps) {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <span 
      className={cn(
        'trend-indicator',
        `trend-indicator--${size}`,
        isPositive ? 'trend-indicator--up' : 'trend-indicator--down'
      )}
      aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(change)}%`}
    >
      <Icon className="trend-indicator__icon" />
      {showValue && (
        <span className="trend-indicator__value">
          {Math.abs(change).toFixed(2)}%
        </span>
      )}
    </span>
  );
}
```

---

### ЭТАП 3: ФУНКЦИОНАЛ И UX (День 3)

#### Задача 3.1: Реализовать выбор базовой валюты

**Требования:**
1. ✅ Компонент `CurrencySelector` с поиском
2. ✅ Поддержка популярных валют (USD, EUR, RUB, GBP, JPY, CNY)
3. ✅ Автокомплит при вводе
4. ✅ Сохранение выбора в localStorage
5. ✅ Плавная анимация переключения

```typescript
function CurrencyWidgetHeader({ 
  baseCurrency, 
  onCurrencyChange,
  lastUpdate 
}: CurrencyWidgetHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="currency-widget-header">
      <div className="currency-widget-header__title">
        <DollarSign className="currency-widget-header__icon" />
        <h3>Exchange Rates</h3>
      </div>
      
      <div className="currency-widget-header__controls">
        <CurrencySelector
          value={baseCurrency}
          onChange={onCurrencyChange}
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />
        
        <LastUpdateBadge timestamp={lastUpdate} />
      </div>
    </div>
  );
}
```

---

#### Задача 3.2: Добавить индикатор последнего обновления

```typescript
function LastUpdateBadge({ timestamp }: { timestamp: number }) {
  const { relative, absolute } = useFormattedDate(timestamp);
  const isStale = Date.now() - timestamp > 24 * 60 * 60 * 1000; // > 24 hours
  
  return (
    <Tooltip content={absolute}>
      <div 
        className={cn(
          'last-update-badge',
          isStale && 'last-update-badge--stale'
        )}
        role="status"
        aria-live="polite"
      >
        <Clock className="last-update-badge__icon" size={14} />
        <span className="last-update-badge__text">{relative}</span>
        {isStale && (
          <AlertTriangle 
            className="last-update-badge__warning" 
            size={14}
            aria-label="Data may be outdated"
          />
        )}
      </div>
    </Tooltip>
  );
}
```

---

#### Задача 3.3: Реализовать избранные валюты

**Требования:**
1. ✅ Локальное хранилище избранного
2. ✅ Показ избранных валют первыми
3. ✅ Анимация добавления/удаления
4. ✅ Drag-and-drop для сортировки избранных

```typescript
function useFavoriteCurrencies() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('currency-favorites');
    return stored ? JSON.parse(stored) : ['USD', 'EUR'];
  });
  
  const toggleFavorite = useCallback((code: string) => {
    setFavorites(prev => {
      const next = prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code];
      localStorage.setItem('currency-favorites', JSON.stringify(next));
      return next;
    });
  }, []);
  
  return { favorites, toggleFavorite };
}
```

---

#### Задача 3.4: Добавить быстрый конвертер

```typescript
function CurrencyConverter({ 
  rates, 
  baseCurrency 
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState(baseCurrency);
  const [toCurrency, setToCurrency] = useState('USD');
  
  const convertedAmount = useMemo(() => {
    const fromRate = rates.find(r => r.code === fromCurrency)?.rate || 1;
    const toRate = rates.find(r => r.code === toCurrency)?.rate || 1;
    return (parseFloat(amount) * (toRate / fromRate)).toFixed(2);
  }, [amount, fromCurrency, toCurrency, rates]);
  
  return (
    <div className="currency-converter">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        aria-label="Amount to convert"
      />
      
      <CurrencySelector 
        value={fromCurrency}
        onChange={setFromCurrency}
        compact
      />
      
      <ArrowRightLeft size={16} />
      
      <CurrencySelector 
        value={toCurrency}
        onChange={setToCurrency}
        compact
      />
      
      <div className="currency-converter__result">
        {convertedAmount} {toCurrency}
      </div>
    </div>
  );
}
```

---

### ЭТАП 4: ДОСТУПНОСТЬ И ОПТИМИЗАЦИЯ (День 4)

#### Задача 4.1: Улучшить доступность (A11y)

**Требования:**
1. ✅ Добавить все необходимые ARIA-атрибуты
2. ✅ Реализовать `aria-live="polite"` для обновлений
3. ✅ Добавить клавиатурную навигацию (Tab, Enter, Escape)
4. ✅ Обеспечить contrast ratio минимум 4.5:1
5. ✅ Добавить focus indicators
6. ✅ Screen reader friendly descriptions

```typescript
// Пример применения
<div 
  role="region"
  aria-label="Currency Exchange Rates Widget"
  aria-live="polite"
  aria-atomic="false"
>
  <div role="status" aria-live="polite" className="sr-only">
    {isLoading ? 'Loading currency rates' : `${rates.length} currency rates loaded`}
  </div>
  
  {/* Контент */}
</div>
```

---

#### Задача 4.2: Оптимизация производительности

**Требования:**
1. ✅ Виртуализация списка для >20 валют (react-window)
2. ✅ Мемоизация тяжёлых вычислений
3. ✅ Debouncing для поиска валют (300ms)
4. ✅ Lazy loading для графиков
5. ✅ Code splitting для CurrencyConverter

```typescript
// Виртуализация
import { FixedSizeList } from 'react-window';

function CurrencyRateList({ rates, ...props }: CurrencyRateListProps) {
  const rowRenderer = useCallback(({ index, style }) => (
    <div style={style}>
      <CurrencyRateItem rate={rates[index]} {...props} />
    </div>
  ), [rates, props]);
  
  if (rates.length > 20) {
    return (
      <FixedSizeList
        height={400}
        itemCount={rates.length}
        itemSize={60}
        width="100%"
      >
        {rowRenderer}
      </FixedSizeList>
    );
  }
  
  return rates.map(rate => (
    <CurrencyRateItem key={rate.code} rate={rate} {...props} />
  ));
}
```

---

#### Задача 4.3: Добавить skeleton loaders

```typescript
export function CurrencyWidgetSkeleton({ size }: { size: WidgetSize }) {
  const count = size === 'small' ? 1 : size === 'medium' ? 5 : 10;
  
  return (
    <div className="currency-widget-skeleton">
      <div className="currency-widget-skeleton__header">
        <Skeleton width={120} height={20} />
        <Skeleton width={80} height={32} />
      </div>
      
      <div className="currency-widget-skeleton__list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="currency-widget-skeleton__item">
            <Skeleton width={60} height={16} />
            <Skeleton width={100} height={24} />
            <Skeleton width={80} height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

#### Задача 4.4: Улучшить обработку ошибок

```typescript
export function CurrencyWidgetError({ 
  error, 
  onRetry 
}: CurrencyWidgetErrorProps) {
  const errorDetails = useMemo(() => {
    if (error.message.includes('CBR_API_ERROR')) {
      return {
        title: 'Unable to fetch currency data',
        description: 'The Central Bank of Russia API is currently unavailable. Please try again later.',
        icon: ServerCrash,
        showRetry: true
      };
    }
    
    if (error.message.includes('NETWORK_ERROR')) {
      return {
        title: 'Network connection issue',
        description: 'Please check your internet connection and try again.',
        icon: WifiOff,
        showRetry: true
      };
    }
    
    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      icon: AlertCircle,
      showRetry: true
    };
  }, [error]);
  
  const Icon = errorDetails.icon;
  
  return (
    <div 
      className="currency-widget-error"
      role="alert"
      aria-live="assertive"
    >
      <Icon className="currency-widget-error__icon" size={48} />
      <h3 className="currency-widget-error__title">{errorDetails.title}</h3>
      <p className="currency-widget-error__description">{errorDetails.description}</p>
      
      {errorDetails.showRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          size="sm"
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}
```

---

### ЭТАП 5: ИНТЕРНАЦИОНАЛИЗАЦИЯ (Опционально)

#### Задача 5.1: Добавить поддержку i18n

**Файл:** `/locales/en/currency.json`
```json
{
  "widget.title": "Exchange Rates",
  "widget.baseCurrency": "Base Currency",
  "widget.lastUpdate": "Last update",
  "widget.loading": "Loading currency rates...",
  "widget.error.title": "Unable to load data",
  "widget.error.retry": "Try again",
  "widget.converter.title": "Quick Converter",
  "widget.favorites.title": "Favorite Currencies",
  "widget.empty.title": "No currencies to display",
  "widget.empty.description": "Add currencies to get started"
}
```

**Файл:** `/locales/ru/currency.json`
```json
{
  "widget.title": "Курсы валют",
  "widget.baseCurrency": "Базовая валюта",
  "widget.lastUpdate": "Последнее обновление",
  "widget.loading": "Загрузка курсов...",
  "widget.error.title": "Не удалось загрузить данные",
  "widget.error.retry": "Повторить",
  "widget.converter.title": "Быстрый конвертер",
  "widget.favorites.title": "Избранные валюты",
  "widget.empty.title": "Нет валют для отображения",
  "widget.empty.description": "Добавьте валюты для начала работы"
}
```

**Использование:**
```typescript
import { useTranslation } from 'next-i18next';

function CurrencyWidget({ size }: CurrencyWidgetProps) {
  const { t } = useTranslation('currency');
  
  return (
    <div>
      <h3>{t('widget.title')}</h3>
      {/* ... */}
    </div>
  );
}
```

---

## 🎨 СТИЛИЗАЦИЯ

### Задача 6.1: Создать CSS модули

**Файл:** `CurrencyWidget.module.css`

```css
.currencyWidget {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.currencyWidget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-primary);
}

.currencyWidget__list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.currencyWidget__list::-webkit-scrollbar {
  width: 8px;
}

.currencyWidget__list::-webkit-scrollbar-thumb {
  background: var(--color-background-tertiary);
  border-radius: 4px;
}

/* Size variants */
.currencyWidget--small {
  --font-size-title: 0.875rem;
  --font-size-rate: 1.25rem;
}

.currencyWidget--medium {
  --font-size-title: 1rem;
  --font-size-rate: 1.5rem;
}

.currencyWidget--large {
  --font-size-title: 1.125rem;
  --font-size-rate: 1.75rem;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.currencyRateItem {
  animation: slideIn 0.2s ease-out;
}

/* Accessibility */
.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus states */
.currencyWidget *:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Задача 7.1: Написать unit-тесты

**Файл:** `CurrencyWidget.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyWidget } from './CurrencyWidget';
import { useCurrencyRates } from '../hooks/useCurrencyRates';

jest.mock('../hooks/useCurrencyRates');

describe('CurrencyWidget', () => {
  const mockData = {
    base: 'RUB',
    rates: [
      { code: 'USD', name: 'US Dollar', rate: 75.5, change24h: -0.5 },
      { code: 'EUR', name: 'Euro', rate: 85.2, change24h: 0.3 },
    ],
    lastUpdate: Date.now()
  };
  
  beforeEach(() => {
    (useCurrencyRates as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn()
    });
  });
  
  it('renders currency rates correctly', () => {
    render(<CurrencyWidget size="medium" />);
    
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });
  
  it('shows loading state', () => {
    (useCurrencyRates as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn()
    });
    
    render(<CurrencyWidget size="medium" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('shows error state and allows retry', async () => {
    const mockMutate = jest.fn();
    (useCurrencyRates as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('Network error'),
      isLoading: false,
      mutate: mockMutate
    });
    
    render(<CurrencyWidget size="medium" />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);
    
    expect(mockMutate).toHaveBeenCalled();
  });
  
  it('changes base currency', async () => {
    render(<CurrencyWidget size="large" />);
    
    const selector = screen.getByRole('combobox', { name: /base currency/i });
    await userEvent.click(selector);
    await userEvent.click(screen.getByText('EUR'));
    
    await waitFor(() => {
      expect(useCurrencyRates).toHaveBeenCalledWith('EUR', expect.any(Object));
    });
  });
  
  it('toggles favorite currency', async () => {
    render(<CurrencyWidget size="large" />);
    
    const favoriteButton = screen.getAllByLabelText(/add to favorites/i)[0];
    await userEvent.click(favoriteButton);
    
    expect(localStorage.getItem('currency-favorites')).toContain('USD');
  });
  
  it('meets accessibility requirements', async () => {
    const { container } = render(<CurrencyWidget size="medium" />);
    
    expect(container.querySelector('[role="region"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });
});
```

---

### Задача 7.2: Написать integration тесты для API

**Файл:** `route.test.ts`

```typescript
import { GET } from './route';
import { NextRequest } from 'next/server';

describe('Currency API Route', () => {
  it('returns currency rates in JSON format', async () => {
    const request = new NextRequest('http://localhost:3000/api/currency');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data).toHaveProperty('base');
    expect(data).toHaveProperty('rates');
    expect(Array.isArray(data.rates)).toBe(true);
  });
  
  it('calculates change24h correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/currency');
    const response = await GET(request);
    const data = await response.json();
    
    data.rates.forEach(rate => {
      expect(rate).toHaveProperty('change24h');
      expect(typeof rate.change24h).toBe('number');
    });
  });
  
  it('handles weekend dates correctly', async () => {
    // Test that it returns data for last working day
    const saturdayDate = '08.02.2026'; // Saturday
    const request = new NextRequest(
      `http://localhost:3000/api/currency?date=${saturdayDate}`
    );
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.workingDate).not.toBe(saturdayDate);
  });
  
  it('returns appropriate error for invalid date', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/currency?date=invalid'
    );
    const response = await GET(request);
    
    expect(response.status).toBe(400);
  });
});
```

---

## 📊 КРИТЕРИИ ПРИЁМКИ

### Функциональные требования:
- ✅ Виджет успешно загружает и отображает курсы валют
- ✅ Корректно работает выбор базовой валюты
- ✅ Реализована функция избранных валют
- ✅ Работает быстрый конвертер (опционально)
- ✅ Отображаются индикаторы изменений курса
- ✅ Работает автообновление данных (с учётом Page Visibility)

### Технические требования:
- ✅ Покрытие тестами минимум 80%
- ✅ Нет ошибок TypeScript в strict mode
- ✅ Нет console.log в продакшн-коде
- ✅ Все зависимости актуальны
- ✅ Lighthouse Score: Performance > 90, Accessibility > 95
- ✅ Bundle size виджета < 50KB (gzipped)

### UX/UI требования:
- ✅ Плавные анимации (60 FPS)
- ✅ Отзывчивый интерфейс
- ✅ Skeleton loaders при загрузке
- ✅ Информативные сообщения об ошибках
- ✅ Индикатор последнего обновления

### Доступность:
- ✅ WCAG 2.1 Level AA compliance
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast ratio ≥ 4.5:1

---

## 📝 ДОПОЛНИТЕЛЬНЫЕ ЗАМЕЧАНИЯ

### Зависимости для установки:
```json
{
  "dependencies": {
    "swr": "^2.2.4",
    "framer-motion": "^11.0.0",
    "react-window": "^1.8.10",
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0"
  }
}
```

### Утилиты для создания:
```typescript
// /lib/utils/currency.ts
export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
}

export function calculateChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}
```

```typescript
// /lib/utils/date.ts
import { formatDistanceToNow } from 'date-fns';

export function useFormattedDate(timestamp: number) {
  return {
    relative: formatDistanceToNow(timestamp, { addSuffix: true }),
    absolute: new Date(timestamp).toLocaleString()
  };
}
```

---

## 🚀 ПЛАН ВЫПОЛНЕНИЯ

### День 1: Инфраструктура
- [ ] Создать `useCurrencyRates` хук
- [ ] Создать `CurrencyApiClient`
- [ ] Улучшить API route
- [ ] Вынести RUSSIAN_HOLIDAYS в конфиг

### День 2: Компоненты
- [ ] Разбить CurrencyWidget на подкомпоненты
- [ ] Создать CurrencyRateItem
- [ ] Создать TrendIndicator
- [ ] Создать skeleton loaders
- [ ] Создать error states

### День 3: Функционал
- [ ] Реализовать CurrencySelector
- [ ] Добавить LastUpdateBadge
- [ ] Реализовать избранные валюты
- [ ] Добавить quick converter (опционально)

### День 4: Полировка
- [ ] Улучшить A11y
- [ ] Добавить анимации
- [ ] Оптимизировать производительность
- [ ] Написать тесты
- [ ] Проверить все edge cases

---

## ✅ ЧЕКЛИСТ ПЕРЕД КОММИТОМ

- [ ] Весь код типизирован (TypeScript strict mode)
- [ ] Нет `console.log` в коде
- [ ] Все компоненты документированы (JSDoc)
- [ ] Тесты написаны и проходят
- [ ] ESLint и Prettier пройдены
- [ ] Build успешно выполняется
- [ ] Lighthouse audit пройден
- [ ] Accessibility проверена
- [ ] README обновлён
- [ ] CHANGELOG обновлён

---

## 📚 РЕФЕРЕНСЫ

### Лучшие практики информационных дашбордов:
1. [Material Design - Data Visualization](https://m3.material.io/foundations/content-design/data-visualization)
2. [Nielsen Norman Group - Dashboard Design](https://www.nngroup.com/articles/dashboard-design/)
3. [Refactoring UI](https://www.refactoringui.com/)

### A11y Resources:
1. [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
2. [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### API Documentation:
1. [CBR API Documentation](http://www.cbr.ru/development/SXML/)

---

**Последнее обновление:** 06.02.2026  
**Версия:** 1.0  
**Автор:** Claude (Anthropic)  
**Для:** QWEN CODE Agent

---

_При возникновении вопросов или необходимости уточнений - создавайте issue в репозитории или обращайтесь к lead developer._
