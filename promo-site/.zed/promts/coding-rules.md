# Qwen Code Agent Rules for Zed Editor
# Place this file in your project root as: .zed/prompts/coding-rules.md
# Or configure in Zed settings: Settings > AI > Custom Instructions

---

## 🎯 PROJECT CONTEXT

**Project:** Analytics Dashboard Platform (2026 Architecture)
**Phase:** 3 - Composition & Ecosystem
**Stack:** Next.js 14, TypeScript, React 18, Tailwind CSS

**Architecture Pillars:**
1. Atomic Design System (Atoms → Molecules → Organisms → Templates → Pages)
2. Micro-Frontend Architecture (Independent widget deployment)
3. AI-Powered Adaptive Layouts (Context-aware interfaces)
4. Low-Code Composition System (Drag-and-drop dashboards)

---

## 📐 ATOMIC DESIGN - STRICT HIERARCHY

**Directory Structure:**
```
components/demos/analytics/
├── atoms/           # Level 1: Smallest units (CurrencyIcon, TrendIndicator)
├── molecules/       # Level 2: Atom combinations (CurrencyRateCard)
├── organisms/       # Level 3: Complex components (CurrencyWidgetContainer)
├── templates/       # Level 4: Layouts (DashboardTemplate)
└── widgets/         # Isolated micro-frontends
```

**RULES:**
- ❌ NEVER skip levels (atom → organism without molecule)
- ✅ ALWAYS compose bottom-up
- ✅ Each level ONLY imports from levels below
- ✅ Atoms: Max 50 lines, no state, no data fetching
- ✅ Molecules: Max 100 lines, simple UI state only
- ✅ Organisms: Max 200 lines, can use hooks & business logic

---

## 🏗️ MICRO-FRONTEND WIDGETS

**Widget Structure:**
```
widgets/currency/
├── index.ts              # Public API exports
├── CurrencyWidget.tsx    # Main component
├── types.ts              # Widget-specific types
├── hooks/                # Widget-specific hooks
├── components/           # Internal components
└── __tests__/            # Tests
```

**RULES:**
- ✅ Widgets are FULLY isolated (own types, hooks, components)
- ❌ NO cross-widget imports
- ✅ Use event bus for inter-widget communication
- ✅ Register in WIDGET_REGISTRY with lazy loading
- ✅ Must be independently deployable

---

## 🤖 AI & ANALYTICS INTEGRATION

**MANDATORY for ALL components:**

```typescript
import { useAnalytics } from '@/lib/analytics';

// Track widget loads
useEffect(() => {
  trackEvent('widget:loaded', {
    widgetId: id,
    widgetType: 'currency',
    size: currentSize
  });
}, []);

// Track ALL user interactions
const handleClick = () => {
  trackEvent('widget:interaction', {
    widgetId: id,
    action: 'rate_selected',
    context: { /* relevant data */ }
  });
};
```

**Required Events:**
- `widget:loaded` - Component mount
- `widget:interaction` - User actions
- `widget:resized` - Size changes
- `widget:error` - Errors
- `layout:changed` - Layout adaptations

---

## 📏 TYPESCRIPT STRICT MODE

**tsconfig.json requirements:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**RULES:**
- ❌ NEVER use `any` (use `unknown` with type guards)
- ✅ ALWAYS explicit return types for functions
- ✅ Use discriminated unions for complex state
- ✅ Prefer `interface` for objects, `type` for unions

**Example:**
```typescript
// ✅ CORRECT
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// ❌ WRONG
function getUser(id) {  // Missing types
  return fetch(`/api/users/${id}`).then(r => r.json());
}
```

---

## ⚡ PERFORMANCE RULES

**Memoization:**
```typescript
// ✅ Memoize expensive computations
const sorted = useMemo(() => 
  data.sort((a, b) => b.value - a.value),
  [data]
);

// ✅ Memoize callbacks
const handleClick = useCallback((id: string) => {
  onClick?.(id);
}, [onClick]);

// ✅ Memoize components
const Item = memo(RateItem);
```

**Code Splitting:**
```typescript
// ✅ Lazy load widgets
const Widget = lazy(() => import('./widgets/currency'));

// ✅ Dynamic imports for heavy features
const Converter = dynamic(() => import('./CurrencyConverter'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

**Virtualization:**
```typescript
// ✅ For lists > 50 items
import { FixedSizeList } from 'react-window';

if (items.length > 50) {
  return <FixedSizeList height={600} itemCount={items.length} itemSize={72} />;
}
```

---

## 🧪 TESTING REQUIREMENTS

**Coverage Minimums:**
- Components: > 80%
- Hooks: > 90%
- Utilities: > 95%

**Test Structure:**
```typescript
describe('CurrencyWidget', () => {
  describe('Rendering', () => {
    it('renders rates correctly', () => { });
  });
  
  describe('Interactions', () => {
    it('handles rate selection', () => { });
  });
  
  describe('Accessibility', () => {
    it('has no a11y violations', async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

---

## ♿ ACCESSIBILITY - WCAG 2.1 AA

**MANDATORY attributes:**
```typescript
<div
  role="region"
  aria-label="Currency Rates Widget"
  aria-live="polite"
>
  <div className="sr-only" role="status">
    {announcement}
  </div>
  
  <button
    aria-label="Add to favorites"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter') handleClick();
    }}
  >
    <Star />
  </button>
</div>
```

**Requirements:**
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- Screen reader friendly
- Focus indicators visible

---

## 📦 GRID SYSTEM

**Fractional Units:**
```typescript
// ✅ Supports fractional grid positions
interface GridPosition {
  col: number;      // Can be 1.5, 2.5, etc.
  row: number;
  colSpan: number;  // Can be 1.5 columns
  rowSpan: number;
}
```

**Responsive Presets:**
```typescript
const GRID_PRESETS = {
  mobile: { cols: 4, gap: 8 },
  tablet: { cols: 8, gap: 12 },
  desktop: { cols: 12, gap: 16 },
  wide: { cols: 16, gap: 20 }
};
```

---

## 🎨 STYLING GUIDELINES

**CSS Modules + Tailwind:**
```typescript
import styles from './Widget.module.css';

<div className={cn(
  styles.widget,
  'flex items-center gap-4',
  variant === 'primary' && 'bg-blue-500'
)}>
```

**CSS Variables:**
```css
:root {
  --color-primary: #00d9ff;
  --spacing-md: 1rem;
  --border-radius: 0.5rem;
}
```

---

## 🚀 CODE REVIEW CHECKLIST

Before committing, verify:

**Architecture:**
- [ ] Follows atomic design hierarchy
- [ ] Widget properly isolated
- [ ] No cross-widget dependencies
- [ ] Analytics events tracked

**Code Quality:**
- [ ] TypeScript strict, no `any`
- [ ] Explicit return types
- [ ] No console.logs
- [ ] Error boundaries present

**Performance:**
- [ ] Expensive ops memoized
- [ ] Lists virtualized if > 50 items
- [ ] Code split appropriately

**Testing:**
- [ ] Tests written and passing
- [ ] Coverage > 80%
- [ ] A11y tests included

**Accessibility:**
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] ARIA attributes present

---

## ⚠️ CRITICAL RULES

1. **NEVER skip atomic design levels** - Always compose bottom-up
2. **ALWAYS track analytics** - AI depends on this data
3. **WIDGETS MUST be isolated** - No cross-widget imports
4. **NO `any` type** - Use proper TypeScript types
5. **A11y is mandatory** - WCAG 2.1 AA minimum
6. **Test before commit** - 80%+ coverage required

---

## 📝 COMMIT MESSAGE FORMAT

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, refactor, test, docs, style, perf, chore
**Scope:** atom, molecule, organism, widget, grid, analytics
**Examples:**
- `feat(widget): add currency converter feature`
- `fix(organism): resolve race condition in CurrencyWidgetContainer`
- `refactor(atom): simplify TrendIndicator component`

---

## 🔧 ZED-SPECIFIC COMMANDS

When I ask you to:

**"Create a new widget":**
1. Create widget folder structure
2. Implement main component with analytics
3. Register in WIDGET_REGISTRY
4. Add tests with > 80% coverage
5. Update documentation

**"Refactor component":**
1. Check atomic design level compliance
2. Extract reusable atoms/molecules
3. Add memoization where needed
4. Ensure TypeScript strict compliance
5. Update tests

**"Fix accessibility":**
1. Add/fix ARIA attributes
2. Ensure keyboard navigation
3. Check color contrast
4. Add screen reader support
5. Run axe-core tests

---

**Last Updated:** February 7, 2026
**Architecture Phase:** 3 (Composition & Ecosystem)
