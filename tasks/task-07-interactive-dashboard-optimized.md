# **Задание: Интерактивный аналитический дашборд с @dnd-kit**

## **Обзор проекта**

**Цель:** Трансформировать существующий статический дашборд с виджетами (Weather, Currency, GitHub) в полноценный интерактивный дашборд с drag-and-drop, изменением размеров и персонализацией layout.

**Технологический стек:**
- Next.js 14+ (App Router)
- React 18+ с TypeScript
- Tailwind CSS (существующая конфигурация проекта)
- @dnd-kit (новая зависимость)
- Framer Motion (для анимаций)
- Lucide React (иконки)

**Расположение:** `/promo-site/app/portfolio/analytics-dashboard/`

---

## **Часть 1: Установка зависимостей**

### **1.1. Добавить новые пакеты**

```bash
cd promo-site
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities framer-motion
```

**Зависимости:**
- `@dnd-kit/core` - основная DnD логика
- `@dnd-kit/sortable` - сортируемые элементы
- `@dnd-kit/utilities` - вспомогательные утилиты (CSS transforms)
- `framer-motion` - плавные анимации (если еще не установлен)

---

## **Часть 2: Унификация стилей существующих виджетов**

### **2.1. Эталонный стиль (GitHubWidget)**

**Базовые CSS-классы для всех виджетов:**
```typescript
// Стандартная структура виджета
const WIDGET_BASE_CLASSES = `
  bg-background-secondary/50 
  backdrop-blur-sm 
  rounded-xl 
  p-6 
  border border-border-default
  shadow-sm
  hover:shadow-md
  transition-shadow
`;

// Заголовок виджета
const WIDGET_HEADER_CLASSES = `
  flex 
  items-center 
  gap-3 
  mb-4 
  pb-3 
  border-b border-border-default
`;
```

### **2.2. Обновить WeatherWidget.tsx**

**Путь:** `/promo-site/components/demos/analytics/WeatherWidget.tsx`

**Изменения:**
1. Привести к единому стилю заголовка (иконка + текст)
2. Применить базовые классы фона и отступов
3. Унифицировать цветовую схему элементов
4. Добавить skeleton loader в едином стиле

**Пример заголовка:**
```tsx
<div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-default">
  <Cloud className="w-5 h-5 text-accent-primary" />
  <h3 className="text-lg font-semibold">Погода</h3>
</div>
```

### **2.3. Исправить и обновить CurrencyWidget.tsx**

**Путь:** `/promo-site/components/demos/analytics/CurrencyWidget.tsx`

**Критические исправления:**

1. **Проблема с наложением текста:**
   - В кнопках выбора валют отображать ТОЛЬКО код (USD, EUR, RUB)
   - Полное название показывать в tooltip при наведении
   
2. **UI улучшения:**
   ```tsx
   // Было (проблема):
   <button>{currencyCode} - {currencyName}</button>
   
   // Должно быть:
   <button 
     title={currencyName}
     className="min-w-[60px] px-3 py-2"
   >
     {currencyCode}
   </button>
   ```

3. **Стилизация поля поиска:**
   - Использовать компонент `Input` из `/promo-site/components/ui/Input.tsx`
   - Увеличить высоту до `h-10` для читаемости
   - Добавить иконку поиска

4. **Унификация с GitHubWidget:**
   - Применить стандартный заголовок
   - Использовать единую сетку для отображения валют
   - Добавить плавные анимации появления

---

## **Часть 3: Создание DnD инфраструктуры**

### **3.1. Типы и интерфейсы**

**Создать:** `/promo-site/types/dashboard.ts`

```typescript
export type WidgetType = 'weather' | 'currency' | 'github';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetLayout {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  order: number; // Порядок в сетке
}

export interface DashboardConfig {
  version: '2.0';
  widgets: WidgetLayout[];
  updatedAt: number;
}

export interface WidgetMetadata {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ComponentType;
  defaultSize: WidgetSize;
  minSize: WidgetSize;
  maxSize: WidgetSize;
  component: React.ComponentType<any>;
}
```

### **3.2. Контекст дашборда**

**Создать:** `/promo-site/components/demos/analytics/DashboardContext.tsx`

```typescript
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { WidgetLayout, DashboardConfig } from '@/types/dashboard';

interface DashboardState {
  widgets: WidgetLayout[];
  isDragging: boolean;
  activeWidgetId: string | null;
}

type DashboardAction =
  | { type: 'SET_WIDGETS'; payload: WidgetLayout[] }
  | { type: 'ADD_WIDGET'; payload: WidgetLayout }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'REORDER_WIDGETS'; payload: { activeId: string; overId: string } }
  | { type: 'RESIZE_WIDGET'; payload: { id: string; size: WidgetSize } }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_ACTIVE_WIDGET'; payload: string | null };

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'SET_WIDGETS':
      return { ...state, widgets: action.payload };
    
    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: [...state.widgets, action.payload],
      };
    
    case 'REMOVE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.filter((w) => w.id !== action.payload),
      };
    
    case 'REORDER_WIDGETS': {
      const { activeId, overId } = action.payload;
      const widgets = [...state.widgets];
      const activeIndex = widgets.findIndex((w) => w.id === activeId);
      const overIndex = widgets.findIndex((w) => w.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = widgets.splice(activeIndex, 1);
        widgets.splice(overIndex, 0, removed);
        
        // Обновить order
        return {
          ...state,
          widgets: widgets.map((w, index) => ({ ...w, order: index })),
        };
      }
      return state;
    }
    
    case 'RESIZE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          w.id === action.payload.id
            ? { ...w, size: action.payload.size }
            : w
        ),
      };
    
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };
    
    case 'SET_ACTIVE_WIDGET':
      return { ...state, activeWidgetId: action.payload };
    
    default:
      return state;
  }
};

const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, {
    widgets: [],
    isDragging: false,
    activeWidgetId: null,
  });

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-layout');
    if (saved) {
      try {
        const config: DashboardConfig = JSON.parse(saved);
        dispatch({ type: 'SET_WIDGETS', payload: config.widgets });
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
      }
    } else {
      // Дефолтная конфигурация
      dispatch({
        type: 'SET_WIDGETS',
        payload: [
          { id: 'weather-1', type: 'weather', size: 'medium', order: 0 },
          { id: 'currency-1', type: 'currency', size: 'large', order: 1 },
          { id: 'github-1', type: 'github', size: 'medium', order: 2 },
        ],
      });
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    if (state.widgets.length > 0) {
      const config: DashboardConfig = {
        version: '2.0',
        widgets: state.widgets,
        updatedAt: Date.now(),
      };
      localStorage.setItem('dashboard-layout', JSON.stringify(config));
    }
  }, [state.widgets]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
```

### **3.3. Реестр виджетов**

**Создать:** `/promo-site/components/demos/analytics/WidgetRegistry.tsx`

```typescript
import { Cloud, DollarSign, Github } from 'lucide-react';
import type { WidgetMetadata, WidgetType } from '@/types/dashboard';
import WeatherWidget from './WeatherWidget';
import CurrencyWidget from './CurrencyWidget';
import GitHubWidget from './GitHubWidget';

export const WIDGET_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  weather: {
    type: 'weather',
    title: 'Погода',
    description: 'Текущая погода и прогноз',
    icon: Cloud,
    defaultSize: 'medium',
    minSize: 'small',
    maxSize: 'large',
    component: WeatherWidget,
  },
  currency: {
    type: 'currency',
    title: 'Курсы валют',
    description: 'Актуальные курсы валют',
    icon: DollarSign,
    defaultSize: 'large',
    minSize: 'medium',
    maxSize: 'large',
    component: CurrencyWidget,
  },
  github: {
    type: 'github',
    title: 'GitHub',
    description: 'Статистика репозиториев',
    icon: Github,
    defaultSize: 'medium',
    minSize: 'medium',
    maxSize: 'large',
    component: GitHubWidget,
  },
};

export function getWidgetMetadata(type: WidgetType): WidgetMetadata {
  return WIDGET_REGISTRY[type];
}
```

### **3.4. Draggable Widget Wrapper**

**Создать:** `/promo-site/components/demos/analytics/SortableWidget.tsx`

```typescript
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2, Minimize2, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { WidgetSize } from '@/types/dashboard';
import { useDashboard } from './DashboardContext';

interface SortableWidgetProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  size: WidgetSize;
  children: React.ReactNode;
  onRemove?: () => void;
}

export default function SortableWidget({
  id,
  title,
  icon,
  size,
  children,
  onRemove,
}: SortableWidgetProps) {
  const { dispatch } = useDashboard();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2',
  };

  const handleResize = () => {
    const nextSize: Record<WidgetSize, WidgetSize> = {
      small: 'medium',
      medium: 'large',
      large: 'small',
    };
    dispatch({
      type: 'RESIZE_WIDGET',
      payload: { id, size: nextSize[size] },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${sizeClasses[size]}
        ${isDragging ? 'opacity-50 z-50' : 'z-0'}
        transition-opacity
      `}
    >
      <Card className="h-full flex flex-col overflow-hidden group">
        {/* Заголовок с drag handle */}
        <div className="flex items-center justify-between p-4 border-b border-border-default bg-background-secondary/30">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-background-tertiary rounded transition-colors"
              aria-label="Переместить виджет"
            >
              <GripVertical className="w-4 h-4 text-text-tertiary" />
            </button>
            {icon}
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          </div>

          {/* Контролы */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleResize}
              className="p-1.5 hover:bg-background-tertiary rounded transition-colors"
              aria-label="Изменить размер"
            >
              {size === 'large' ? (
                <Minimize2 className="w-4 h-4 text-text-tertiary" />
              ) : (
                <Maximize2 className="w-4 h-4 text-text-tertiary" />
              )}
            </button>
            <button
              onClick={onRemove}
              className="p-1.5 hover:bg-error-bg rounded transition-colors"
              aria-label="Удалить виджет"
            >
              <X className="w-4 h-4 text-error" />
            </button>
          </div>
        </div>

        {/* Контент виджета */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </Card>
    </div>
  );
}
```

### **3.5. Главный Dashboard Grid**

**Создать:** `/promo-site/components/demos/analytics/DashboardGrid.tsx`

```typescript
'use client';

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from './DashboardContext';
import SortableWidget from './SortableWidget';
import { getWidgetMetadata } from './WidgetRegistry';

export default function DashboardGrid() {
  const { state, dispatch } = useDashboard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px для предотвращения случайных drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    dispatch({ type: 'SET_DRAGGING', payload: true });
    dispatch({ type: 'SET_ACTIVE_WIDGET', payload: event.active.id as string });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    dispatch({ type: 'SET_DRAGGING', payload: false });
    dispatch({ type: 'SET_ACTIVE_WIDGET', payload: null });

    if (over && active.id !== over.id) {
      dispatch({
        type: 'REORDER_WIDGETS',
        payload: {
          activeId: active.id as string,
          overId: over.id as string,
        },
      });
    }
  };

  const handleRemoveWidget = (id: string) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: id });
  };

  const sortedWidgets = [...state.widgets].sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedWidgets.map((w) => w.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
          <AnimatePresence>
            {sortedWidgets.map((widget) => {
              const metadata = getWidgetMetadata(widget.type);
              const WidgetComponent = metadata.component;
              const Icon = metadata.icon;

              return (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableWidget
                    id={widget.id}
                    title={metadata.title}
                    icon={<Icon className="w-5 h-5 text-accent-primary" />}
                    size={widget.size}
                    onRemove={() => handleRemoveWidget(widget.id)}
                  >
                    <WidgetComponent />
                  </SortableWidget>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Drag Overlay для визуального feedback */}
      <DragOverlay>
        {state.activeWidgetId ? (
          <div className="bg-background-secondary rounded-xl shadow-2xl p-6 opacity-80 transform rotate-2 border-2 border-accent-primary">
            <div className="h-40 flex items-center justify-center text-text-secondary">
              Перемещение виджета...
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## **Часть 4: Добавление виджетов (Modal)**

### **4.1. Кнопка добавления виджета**

**Создать:** `/promo-site/components/demos/analytics/AddWidgetButton.tsx`

```typescript
'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import AddWidgetModal from './AddWidgetModal';

export default function AddWidgetButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
        aria-label="Добавить виджет"
      >
        <Plus className="w-5 h-5 mr-2" />
        Добавить виджет
      </Button>

      <AddWidgetModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

### **4.2. Модальное окно**

**Создать:** `/promo-site/components/demos/analytics/AddWidgetModal.tsx`

```typescript
'use client';

import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDashboard } from './DashboardContext';
import { WIDGET_REGISTRY } from './WidgetRegistry';
import type { WidgetType } from '@/types/dashboard';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWidgetModal({ isOpen, onClose }: AddWidgetModalProps) {
  const { state, dispatch } = useDashboard();

  const handleAddWidget = (type: WidgetType) => {
    const metadata = WIDGET_REGISTRY[type];
    const newWidget = {
      id: `${type}-${Date.now()}`,
      type,
      size: metadata.defaultSize,
      order: state.widgets.length,
    };

    dispatch({ type: 'ADD_WIDGET', payload: newWidget });
    onClose();
  };

  const widgetTypes = Object.values(WIDGET_REGISTRY);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить виджет">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {widgetTypes.map((widget) => {
          const Icon = widget.icon;
          const existingCount = state.widgets.filter(
            (w) => w.type === widget.type
          ).length;

          return (
            <Card
              key={widget.type}
              className="p-4 hover:border-accent-primary transition-colors cursor-pointer"
              onClick={() => handleAddWidget(widget.type)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent-bg rounded-lg">
                  <Icon className="w-6 h-6 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-1">
                    {widget.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-2">
                    {widget.description}
                  </p>
                  {existingCount > 0 && (
                    <p className="text-xs text-text-tertiary">
                      Уже добавлено: {existingCount}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 p-4 border-t border-border-default">
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
      </div>
    </Modal>
  );
}
```

---

## **Часть 5: Обновление главной страницы дашборда**

**Обновить:** `/promo-site/app/portfolio/analytics-dashboard/page.tsx`

```typescript
'use client';

import { DashboardProvider } from '@/components/demos/analytics/DashboardContext';
import DashboardGrid from '@/components/demos/analytics/DashboardGrid';
import AddWidgetButton from '@/components/demos/analytics/AddWidgetButton';

export default function AnalyticsDashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background-primary p-4 md:p-8">
        {/* Заголовок */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Аналитический дашборд
          </h1>
          <p className="text-text-secondary">
            Перетаскивайте виджеты для настройки вашего дашборда
          </p>
        </header>

        {/* Сетка виджетов */}
        <DashboardGrid />

        {/* Кнопка добавления */}
        <AddWidgetButton />
      </div>
    </DashboardProvider>
  );
}
```

---

## **Часть 6: Финальные стили**

**Создать:** `/promo-site/app/portfolio/analytics-dashboard/dashboard.css`

```css
/* Улучшенные стили для дашборда */

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Drag handle */
.drag-handle {
  cursor: grab;
  touch-action: none;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Плавные переходы */
.widget-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Анимация появления */
@keyframes widget-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.widget-appear {
  animation: widget-appear 0.3s ease-out;
}

/* Skeleton loader */
.widget-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-background-secondary) 0%,
    var(--color-background-tertiary) 50%,
    var(--color-background-secondary) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

## **Часть 10: Расширенный чек-лист для проверки**

### **Базовая функциональность:**
- [ ] Drag & Drop работает плавно
- [ ] Изменение размера виджетов (3 размера: small, medium, large)
- [ ] Удаление виджетов с анимацией
- [ ] Добавление виджетов через модальное окно
- [ ] Сохранение layout в localStorage с версионированием
- [ ] Восстановление layout после перезагрузки
- [ ] Keyboard navigation (стрелки, Enter, Escape)

### **Стили и визуал:**
- [ ] Все виджеты имеют единый стиль GitHubWidget
- [ ] CurrencyWidget: исправлено наложение текста
- [ ] CurrencyWidget: только коды валют в кнопках
- [ ] Tooltip с полным названием валюты при hover
- [ ] Единые заголовки (иконка + текст)
- [ ] Skeleton loaders во всех виджетах
- [ ] Плавные transition анимации (0.2s cubic-bezier)
- [ ] Hover эффекты на всех интерактивных элементах

### **WOW-фичи (Промо-демо):**
- [ ] 🤖 AI Assistant работает и показывает рекомендации
- [ ] 🎨 Theme Selector переключает 4+ темы оформления
- [ ] ⌨️ Keyboard Shortcuts overlay открывается по "?"
- [ ] 📊 Usage Stats отображает статистику в реальном времени
- [ ] 🔗 Share Dashboard экспортирует в JSON
- [ ] 📋 Templates Gallery применяет пресеты
- [ ] ✨ Particle Background работает без лагов
- [ ] 🎉 Success toasts появляются после действий
- [ ] 🌈 Gradient заголовки и акценты
- [ ] 🎯 Floating action buttons с анимациями

### **UX/Accessibility:**
- [ ] Плавные анимации при перемещении (Framer Motion)
- [ ] Визуальный feedback при drag (DragOverlay с тенью)
- [ ] Адаптивность (тестировано на 320px, 768px, 1024px, 1920px)
- [ ] Touch-friendly на мобильных (кнопки минимум 44x44px)
- [ ] ARIA labels на всех интерактивных элементах
- [ ] Focus visible для keyboard navigation
- [ ] Reduced motion respect (prefers-reduced-motion)

### **Производительность:**
- [ ] React.memo для виджетов (предотвращение лишних re-renders)
- [ ] Дебаунс 500ms при сохранении в localStorage
- [ ] Lazy loading для тяжелых виджетов
- [ ] Canvas animation оптимизирован (requestAnimationFrame)
- [ ] Lighthouse Performance score > 90
- [ ] First Contentful Paint < 1.5s

### **Code Quality:**
- [ ] TypeScript без ошибок (strict mode)
- [ ] Все props типизированы
- [ ] ESLint warnings исправлены
- [ ] Нет console.log в production коде
- [ ] Комментарии на сложных участках
- [ ] Единообразное форматирование (Prettier)

---

## **Критерии успеха с WOW-фичами**

### **Обязательные (Must Have):**
1. ✅ **Функциональный DnD** с @dnd-kit
   - Плавное перетаскивание
   - Визуальный feedback
   - Сохранение позиций

2. ✅ **Единый стиль виджетов**
   - GitHubWidget как эталон
   - Исправлен баг CurrencyWidget
   - Адаптивный дизайн

3. ✅ **Интерактивность**
   - Изменение размеров
   - Добавление/удаление виджетов
   - Модальное окно с галереей

### **Впечатляющие (WOW Factor):**
4. ✅ **AI-powered функции**
   - Smart Assistant с рекомендациями
   - Авто-оптимизация layout
   - Умное изменение размеров

5. ✅ **Персонализация**
   - 4+ темы оформления
   - Шаблоны layouts (Analyst, Trader, Developer, Balanced)
   - Сохранение предпочтений

6. ✅ **Sharing & Export**
   - Экспорт в JSON
   - Генерация share-ссылок
   - Embed-код для сайтов

7. ✅ **Аналитика & Insights**
   - Статистика использования
   - Время в дашборде
   - Количество взаимодействий

8. ✅ **Визуальные эффекты**
   - Particle background
   - Gradient заголовки
   - Плавные анимации transitions

### **Продвинутые (Nice to Have):**
9. ⭐ **Keyboard-first UX**
   - Горячие клавиши для всех действий
   - Overlay с подсказками
   - Навигация стрелками

10. ⭐ **Accessibility++**
    - Screen reader support
    - High contrast режим
    - Reduced motion mode

11. ⭐ **Performance**
    - Lighthouse score > 90
    - Оптимизированные animations
    - Lazy loading компонентов

---

## **Часть 8: WOW-фичи для ДЕМО (Промо-сайт)**

> 🎯 **Цель:** Впечатлить потенциальных клиентов современными технологиями 2026 года

### **8.1. AI-Powered Smart Assistant**

**Создать:** `/promo-site/components/demos/analytics/SmartAssistant.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Sparkles, Wand2, TrendingUp, Layout } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from './DashboardContext';

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { state, dispatch } = useDashboard();

  const suggestions = [
    {
      id: 'optimize',
      icon: Layout,
      title: 'Оптимизировать layout',
      description: 'AI упорядочит виджеты для максимальной эффективности',
      action: () => optimizeLayout(),
    },
    {
      id: 'trending',
      icon: TrendingUp,
      title: 'Добавить трендовые виджеты',
      description: 'Популярные виджеты этой недели',
      action: () => addTrendingWidgets(),
    },
    {
      id: 'smart-resize',
      icon: Wand2,
      title: 'Умное изменение размеров',
      description: 'Автоматически подберет оптимальные размеры',
      action: () => smartResize(),
    },
  ];

  const optimizeLayout = () => {
    // Симуляция AI оптимизации
    setSuggestion('✨ Layout оптимизирован! Виджеты расположены по приоритету.');
    
    // Логика: большие виджеты слева, маленькие справа
    const optimized = [...state.widgets]
      .sort((a, b) => {
        const sizeWeight = { small: 1, medium: 2, large: 3 };
        return sizeWeight[b.size] - sizeWeight[a.size];
      })
      .map((w, index) => ({ ...w, order: index }));

    dispatch({ type: 'SET_WIDGETS', payload: optimized });

    setTimeout(() => setSuggestion(null), 3000);
  };

  const addTrendingWidgets = () => {
    setSuggestion('🔥 Добавлены трендовые виджеты!');
    setTimeout(() => setSuggestion(null), 3000);
  };

  const smartResize = () => {
    // Авто-ресайз: важные виджеты делаем больше
    const resized = state.widgets.map((w) => {
      if (w.type === 'currency') return { ...w, size: 'large' as const };
      if (w.type === 'github') return { ...w, size: 'medium' as const };
      return w;
    });

    dispatch({ type: 'SET_WIDGETS', payload: resized });
    setSuggestion('🎯 Размеры оптимизированы!');
    setTimeout(() => setSuggestion(null), 3000);
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="primary"
          className="rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI Assistant
        </Button>
      </motion.div>

      {/* Suggestions Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 z-40 w-80"
          >
            <Card className="p-4 shadow-2xl border-2 border-purple-500/20">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Рекомендации
              </h3>

              <div className="space-y-2">
                {suggestions.map((sug) => {
                  const Icon = sug.icon;
                  return (
                    <button
                      key={sug.id}
                      onClick={() => {
                        sug.action();
                        setIsOpen(false);
                      }}
                      className="w-full p-3 rounded-lg hover:bg-background-tertiary transition-colors text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                          <Icon className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{sug.title}</p>
                          <p className="text-xs text-text-tertiary">
                            {sug.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="px-6 py-3 shadow-2xl border-2 border-green-500/50 bg-green-500/10">
              <p className="text-sm font-medium">{suggestion}</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

### **8.2. Dashboard Themes & Customization**

**Создать:** `/promo-site/components/demos/analytics/ThemeSelector.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const THEMES = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#0f172a',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      secondary: '#ec4899',
      background: '#1e1b4b',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#064e3b',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      background: '#164e63',
    },
  },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  const applyTheme = (theme: typeof THEMES[0]) => {
    document.documentElement.style.setProperty('--color-accent-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--color-accent-secondary', theme.colors.secondary);
    setCurrentTheme(theme.id);
  };

  return (
    <div className="fixed top-24 right-6 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-background-secondary shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Выбрать тему"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-14 right-0 bg-background-secondary rounded-xl shadow-2xl p-4 w-48 border border-border-default"
        >
          <h4 className="text-sm font-semibold mb-3">Темы оформления</h4>
          <div className="space-y-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-background-tertiary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.colors.primary }}
                  />
                  <span className="text-sm">{theme.name}</span>
                </div>
                {currentTheme === theme.id && (
                  <Check className="w-4 h-4 text-accent-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

### **8.3. Keyboard Shortcuts Overlay**

**Создать:** `/promo-site/components/demos/analytics/KeyboardShortcuts.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';

const SHORTCUTS = [
  { key: '?', description: 'Показать горячие клавиши' },
  { key: 'A', description: 'Добавить виджет' },
  { key: 'R', description: 'Сбросить layout' },
  { key: 'T', description: 'Переключить тему' },
  { key: 'E', description: 'Экспортировать конфигурацию' },
  { key: '1-9', description: 'Быстрый выбор виджета' },
  { key: 'Esc', description: 'Закрыть модальные окна' },
  { key: 'Ctrl+Z', description: 'Отменить последнее действие' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Hint Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 bg-background-secondary rounded-full shadow-lg text-sm flex items-center gap-2 hover:shadow-xl transition-shadow"
        >
          <Keyboard className="w-4 h-4" />
          Нажмите <kbd className="px-1.5 py-0.5 bg-background-tertiary rounded text-xs">?</kbd>
        </button>
      </motion.div>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Keyboard className="w-6 h-6 text-accent-primary" />
                    Горячие клавиши
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-background-tertiary rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {SHORTCUTS.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-text-secondary">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 bg-background-tertiary rounded text-sm font-mono">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

### **8.4. Dashboard Analytics & Usage Stats**

**Создать:** `/promo-site/components/demos/analytics/UsageStats.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Clock, MousePointerClick, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface UsageData {
  widgetViews: Record<string, number>;
  totalInteractions: number;
  sessionDuration: number;
  mostUsedWidget: string;
}

export default function UsageStats() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<UsageData>({
    widgetViews: {},
    totalInteractions: 0,
    sessionDuration: 0,
    mostUsedWidget: '',
  });

  useEffect(() => {
    // Симуляция сбора статистики
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1,
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 3),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 p-3 bg-background-secondary rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
        aria-label="Статистика использования"
      >
        <BarChart3 className="w-5 h-5" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-20 right-6 w-72 z-40"
        >
          <Card className="p-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-primary" />
              Статистика сессии
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Время в дашборде</span>
                </div>
                <span className="font-mono font-semibold">
                  {formatTime(stats.sessionDuration)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Взаимодействий</span>
                </div>
                <span className="font-mono font-semibold">
                  {stats.totalInteractions}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Активных виджетов</span>
                </div>
                <span className="font-mono font-semibold">3</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
              <p className="text-xs text-center">
                <span className="font-semibold">🎯 Pro Tip:</span> Используйте AI Assistant для оптимизации layout!
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
}
```

### **8.5. Share & Export Dashboard**

**Создать:** `/promo-site/components/demos/analytics/ShareDashboard.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Share2, Download, Link2, Image, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useDashboard } from './DashboardContext';

export default function ShareDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { state } = useDashboard();

  const exportAsJSON = () => {
    const config = {
      version: '2.0',
      widgets: state.widgets,
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = async () => {
    const link = `${window.location.origin}/dashboard/shared/${btoa(JSON.stringify(state.widgets))}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsImage = () => {
    // В реальности использовать html2canvas
    alert('📸 Экспорт как изображение (требуется html2canvas)');
  };

  const generateEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    alert('📋 Embed-код скопирован в буфер обмена!');
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className="fixed top-6 left-6 z-40"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Поделиться
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Поделиться дашбордом">
        <div className="p-4 space-y-3">
          <button
            onClick={copyShareLink}
            className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-background-tertiary transition-colors text-left"
          >
            <Link2 className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-semibold">Скопировать ссылку</p>
              <p className="text-sm text-text-tertiary">
                {copied ? '✅ Скопировано!' : 'Поделиться конфигурацией'}
              </p>
            </div>
          </button>

          <button
            onClick={exportAsJSON}
            className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-background-tertiary transition-colors text-left"
          >
            <Download className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-semibold">Экспорт JSON</p>
              <p className="text-sm text-text-tertiary">
                Скачать конфигурацию дашборда
              </p>
            </div>
          </button>

          <button
            onClick={exportAsImage}
            className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-background-tertiary transition-colors text-left"
          >
            <Image className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-semibold">Экспорт изображения</p>
              <p className="text-sm text-text-tertiary">
                Сохранить как PNG/JPEG
              </p>
            </div>
          </button>

          <button
            onClick={generateEmbedCode}
            className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-background-tertiary transition-colors text-left"
          >
            <Code className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-semibold">Embed-код</p>
              <p className="text-sm text-text-tertiary">
                Встроить на свой сайт
              </p>
            </div>
          </button>
        </div>
      </Modal>
    </>
  );
}
```

### **8.6. Preset Templates Gallery**

**Создать:** `/promo-site/components/demos/analytics/TemplatesGallery.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Layout, TrendingUp, Globe, Briefcase, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDashboard } from './DashboardContext';
import type { WidgetLayout } from '@/types/dashboard';

const TEMPLATES = [
  {
    id: 'analyst',
    name: 'Аналитик',
    description: 'Для глубокого анализа данных',
    icon: TrendingUp,
    preview: '/images/template-analyst.png',
    widgets: [
      { id: 'github-1', type: 'github' as const, size: 'large' as const, order: 0 },
      { id: 'currency-1', type: 'currency' as const, size: 'medium' as const, order: 1 },
      { id: 'weather-1', type: 'weather' as const, size: 'small' as const, order: 2 },
    ],
  },
  {
    id: 'trader',
    name: 'Трейдер',
    description: 'Фокус на финансах',
    icon: Briefcase,
    preview: '/images/template-trader.png',
    widgets: [
      { id: 'currency-1', type: 'currency' as const, size: 'large' as const, order: 0 },
      { id: 'currency-2', type: 'currency' as const, size: 'large' as const, order: 1 },
      { id: 'weather-1', type: 'weather' as const, size: 'small' as const, order: 2 },
    ],
  },
  {
    id: 'developer',
    name: 'Разработчик',
    description: 'GitHub на первом месте',
    icon: Globe,
    preview: '/images/template-developer.png',
    widgets: [
      { id: 'github-1', type: 'github' as const, size: 'large' as const, order: 0 },
      { id: 'github-2', type: 'github' as const, size: 'medium' as const, order: 1 },
      { id: 'weather-1', type: 'weather' as const, size: 'medium' as const, order: 2 },
    ],
  },
  {
    id: 'balanced',
    name: 'Сбалансированный',
    description: 'Все в меру',
    icon: Layout,
    preview: '/images/template-balanced.png',
    widgets: [
      { id: 'weather-1', type: 'weather' as const, size: 'medium' as const, order: 0 },
      { id: 'currency-1', type: 'currency' as const, size: 'medium' as const, order: 1 },
      { id: 'github-1', type: 'github' as const, size: 'medium' as const, order: 2 },
    ],
  },
];

export default function TemplatesGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useDashboard();

  const applyTemplate = (widgets: WidgetLayout[]) => {
    dispatch({ type: 'SET_WIDGETS', payload: widgets });
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className="fixed top-6 left-40 z-40"
      >
        <Layout className="w-4 h-4 mr-2" />
        Шаблоны
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Выберите шаблон">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-accent-primary transition-colors overflow-hidden group"
                onClick={() => applyTemplate(template.widgets)}
              >
                {/* Preview Image */}
                <div className="h-32 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center relative overflow-hidden">
                  <Icon className="w-12 h-12 text-accent-primary opacity-50 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-text-tertiary mb-3">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <Check className="w-3 h-3" />
                    {template.widgets.length} виджетов
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
```

### **8.7. Particle Background Effect**

**Создать:** `/promo-site/components/demos/analytics/ParticleBackground.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Создать частицы
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  );
}
```

---

## **Часть 9: Интеграция WOW-фичей**

### **9.1. Обновить главную страницу**

**Обновить:** `/promo-site/app/portfolio/analytics-dashboard/page.tsx`

```typescript
'use client';

import { DashboardProvider } from '@/components/demos/analytics/DashboardContext';
import DashboardGrid from '@/components/demos/analytics/DashboardGrid';
import AddWidgetButton from '@/components/demos/analytics/AddWidgetButton';
import SmartAssistant from '@/components/demos/analytics/SmartAssistant';
import ThemeSelector from '@/components/demos/analytics/ThemeSelector';
import KeyboardShortcuts from '@/components/demos/analytics/KeyboardShortcuts';
import UsageStats from '@/components/demos/analytics/UsageStats';
import ShareDashboard from '@/components/demos/analytics/ShareDashboard';
import TemplatesGallery from '@/components/demos/analytics/TemplatesGallery';
import ParticleBackground from '@/components/demos/analytics/ParticleBackground';

export default function AnalyticsDashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background-primary relative overflow-hidden">
        {/* Animated Background */}
        <ParticleBackground />

        {/* Main Content */}
        <div className="relative z-10 p-4 md:p-8">
          {/* Hero Header */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Интерактивный Дашборд 2026
            </h1>
            <p className="text-text-secondary text-lg">
              Перетаскивайте, настраивайте, анализируйте — все в одном месте
            </p>
          </header>

          {/* Dashboard Grid */}
          <DashboardGrid />
        </div>

        {/* Floating Controls */}
        <AddWidgetButton />
        <SmartAssistant />
        <ThemeSelector />
        <KeyboardShortcuts />
        <UsageStats />
        <ShareDashboard />
        <TemplatesGallery />
      </div>
    </DashboardProvider>
  );
}
```

---

## **Дополнительные улучшения (опционально)**

### **1. Real-time Collaboration Indicator**
```typescript
// Показывать "фейковых" пользователей для демонстрации коллаборации
const DEMO_USERS = [
  { id: 1, name: 'Алексей М.', avatar: '👨‍💻', color: 'bg-blue-500' },
  { id: 2, name: 'Мария К.', avatar: '👩‍💼', color: 'bg-purple-500' },
];
```

### **2. Voice Commands Demo**
```typescript
// Симуляция голосовых команд (визуальная демонстрация)
const VOICE_COMMANDS = [
  'Добавить виджет погоды',
  'Оптимизировать layout',
  'Показать статистику',
];
```

### **3. Micro-interactions**
```typescript
// Празднование достижений с конфетти
import confetti from 'canvas-confetti';

const celebrateAction = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};
```

---

## **Итоговая структура файлов**

```
promo-site/
├── app/
│   └── portfolio/
│       └── analytics-dashboard/
│           ├── page.tsx (обновлен с WOW-фичами)
│           └── dashboard.css (новый)
├── components/
│   └── demos/
│       └── analytics/
│           ├── Core Components:
│           ├── DashboardContext.tsx (новый)
│           ├── DashboardGrid.tsx (новый)
│           ├── SortableWidget.tsx (новый)
│           ├── WidgetRegistry.tsx (новый)
│           │
│           ├── Base Widgets:
│           ├── WeatherWidget.tsx (обновлен)
│           ├── CurrencyWidget.tsx (обновлен + исправлен)
│           ├── GitHubWidget.tsx (эталон, без изменений)
│           │
│           ├── Add/Remove:
│           ├── AddWidgetButton.tsx (новый)
│           ├── AddWidgetModal.tsx (новый)
│           │
│           └── WOW Features:
│               ├── SmartAssistant.tsx (AI помощник)
│               ├── ThemeSelector.tsx (темы)
│               ├── KeyboardShortcuts.tsx (горячие клавиши)
│               ├── UsageStats.tsx (статистика)
│               ├── ShareDashboard.tsx (экспорт/поделиться)
│               ├── TemplatesGallery.tsx (шаблоны)
│               └── ParticleBackground.tsx (эффекты)
└── types/
    └── dashboard.ts (новый)
```

---

## **Критерии успеха**

✅ **Функциональность:**
- Полноценный drag & drop с @dnd-kit
- Изменение размеров виджетов
- Добавление/удаление виджетов
- Персистентность layout

✅ **Визуал:**
- Единообразие всех виджетов
- Исправлен баг CurrencyWidget
- Плавные анимации
- Адаптивный дизайн

✅ **WOW-фактор (для промо):**
- AI Assistant с умными рекомендациями
- Красивые темы оформления
- Шаблоны layouts
- Статистика и аналитика
- Share/Export функции
- Particle effects
- Keyboard shortcuts

✅ **Код:**
- TypeScript типизация
- Чистая архитектура (Context + Reducers)
- Переиспользуемые компоненты
- Соответствие best practices 2026

---

## **Метрики для ДЕМО на промо-сайте**

### **Производительность:**
- ⚡ Lighthouse Performance: > 90
- 🎨 First Contentful Paint: < 1.5s
- 🚀 Time to Interactive: < 3s
- 📦 Bundle size: < 200KB (gzipped)

### **UX Метрики:**
- 👆 Touch target size: ≥ 44x44px
- 🎯 Click delay: < 100ms
- ✨ Animation fps: 60fps
- 📱 Mobile responsive: 320px - 1920px

### **Accessibility:**
- ♿ WCAG 2.1 Level AA
- ⌨️ Keyboard navigation: 100%
- 📢 Screen reader: Tested
- 🎨 Color contrast: ≥ 4.5:1

---

## **Ожидаемый результат**

🎯 **Главная цель:** Создать впечатляющий интерактивный дашборд, который:

1. **Демонстрирует технологическую экспертизу:**
   - Современный стек (React 18, TypeScript, @dnd-kit)
   - Продвинутые паттерны (Context, Reducers, Custom Hooks)
   - Performance optimization

2. **Впечатляет визуально:**
   - Плавные анимации Framer Motion
   - Particle background effects
   - Gradient акценты
   - Темы оформления

3. **Показывает инновации:**
   - AI-powered suggestions
   - Smart layout optimization
   - Real-time analytics
   - Advanced keyboard shortcuts

4. **Удобен в использовании:**
   - Интуитивный DnD
   - Быстрая кастомизация
   - Сохранение предпочтений
   - Шаблоны для быстрого старта

5. **Готов к масштабированию:**
   - Расширяемая архитектура
   - Widget registry pattern
   - Typed interfaces
   - Documentation-ready

### **🎬 Демо-сценарий для клиентов:**

1. **Первое впечатление (0-10 сек):**
   - Particle background включается
   - Виджеты появляются с анимацией
   - Gradient заголовок привлекает внимание

2. **Интерактивность (10-30 сек):**
   - Клиент перетаскивает виджет
   - Видит плавные transitions
   - Пробует изменить размер

3. **WOW-момент (30-60 сек):**
   - Нажимает на AI Assistant
   - Получает умные рекомендации
   - Layout оптимизируется автоматически
   - Появляется success toast

4. **Персонализация (60-120 сек):**
   - Переключает темы
   - Применяет шаблон "Trader"
   - Добавляет новый виджет
   - Видит статистику использования

5. **Sharing (120-180 сек):**
   - Экспортирует конфигурацию
   - Копирует share-ссылку
   - Понимает возможности integration

### **💼 Бизнес-ценность для клиента:**

✅ **Доказывает:** Мы владеем современными технологиями  
✅ **Показывает:** Внимание к деталям и UX  
✅ **Демонстрирует:** Способность создавать впечатляющие интерфейсы  
✅ **Убеждает:** Мы можем реализовать сложные проекты  

---

**Время выполнения:** ~6-8 часов (с WOW-фичами)  
**Сложность:** Высокая (но результат того стоит!)  
**Приоритет:** 🔥 Критически важно для промо-сайта  

---

## **🎁 Бонус: Future Enhancements**

После основной реализации можно добавить:

1. **🎮 Gamification:**
   - Achievements system ("Dashboard Master", "Speed Customizer")
   - Progress badges
   - Usage streaks

2. **🤝 Collaboration:**
   - Real-time cursors (фейковые для демо)
   - "3 users online" indicator
   - Team templates

3. **📊 Advanced Analytics:**
   - Heat map кликов
   - Time spent на каждом виджете
   - A/B testing layouts

4. **🎤 Voice Commands (visual demo):**
   - "Add weather widget" визуальная демонстрация
   - Microphone animation
   - Speech recognition UI

5. **🌐 3D Mode:**
   - Three.js integration
   - 3D widget flip effects
   - Spatial computing hints

6. **📱 Mobile App Tease:**
   - "Get it on iOS/Android" banners
   - QR code для мобильной версии
   - App store screenshots

---

**Финальная мысль:** Этот дашборд должен быть флагманским демо на промо-сайте, которое заставляет клиентов сказать: "Вау! Хочу такое же!"
