# Atomic Design System for Analytics Dashboard

## Atoms
The smallest building blocks of the UI that cannot be broken down further.

### CurrencyIcon
Displays a currency code with an associated icon/emoji.
- Props: `code` (string), `className` (optional string)
- Usage: Shows visual representation of currency

### TrendIndicator
Shows the direction and magnitude of change with appropriate color coding.
- Props: `change` (number), `showValue` (optional boolean), `size` ('sm' | 'md' | 'lg'), `className` (optional string)
- Usage: Displays positive/negative trends with arrows and percentages

### FavoriteButton
Interactive button to toggle favorite status.
- Props: `isFavorite` (boolean), `onClick` (function), `className` (optional string), `size` (optional number)
- Usage: Allows users to mark/unmark items as favorites

### CurrencyValue
Formats and displays currency values.
- Props: `value` (number), `baseCurrency` (string), `decimals` (optional number), `className` (optional string)
- Usage: Shows formatted currency amounts

### CurrencyCode
Displays currency code and optionally the full name.
- Props: `code` (string), `name` (optional string), `showName` (optional boolean), `className` (optional string)
- Usage: Shows currency abbreviation and name

## Molecules
Groups of atoms bonded together forming relatively simple UI components.

### CurrencyRateCard
A card displaying currency information with all relevant details.
- Props: `rate` (CurrencyRate), `baseCurrency` (string), `isCompact` (optional boolean), `isFavorite` (optional boolean), `onToggleFavorite` (optional function), `showChart` (optional boolean), `className` (optional string)
- Usage: Individual currency display with all relevant information

## Organisms
Complex components formed by combining molecules and atoms.

### CurrencyWidgetContainer
Wraps the entire currency widget with appropriate styling based on size.
- Props: `children` (ReactNode), `size` (WidgetSize), `className` (optional string)
- Usage: Provides consistent container styling for currency widgets

### CurrencyWidgetHeader
Header section with title, last update time, and currency selector.
- Props: `baseCurrency` (string), `onCurrencyChange` (function), `lastUpdate` (number), `className` (optional string)
- Usage: Top section of the widget with controls and information

## Templates
Defines the structure and layout of pages using organisms.

## Pages
Specific instances of templates filled with real content.

---

## Guidelines for Component Development

1. **Consistency**: All components should follow the same design language and interaction patterns
2. **Accessibility**: All components must be keyboard navigable and screen reader friendly
3. **Responsiveness**: Components should adapt gracefully to different screen sizes
4. **Performance**: Components should be optimized for fast rendering
5. **Maintainability**: Components should be well-documented and easy to modify