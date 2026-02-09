# Phase 2: Architecture Refinement - Separation of Concerns

## Goal
Refactor components to separate data fetching, state management, and UI rendering responsibilities.

## Tasks

### 4.1 Component Analysis
- [ ] Identify components that mix multiple concerns (CurrencyWidget, GitHubWidget, WeatherWidget)
- [ ] Document current responsibility mixing patterns
- [ ] Create refactoring plan for each component

### 4.2 Data Layer Extraction
- [ ] Extract data fetching logic from components into service classes:
  - [ ] `CurrencyService.ts`
  - [ ] `GitHubService.ts` 
  - [ ] `WeatherService.ts`
- [ ] Implement consistent API response handling
- [ ] Add request cancellation support
- [ ] Create unified error handling interface

### 4.3 State Management Refactoring
- [ ] Move local state to dedicated state management hooks:
  - [ ] `useCurrencyState.ts`
  - [ ] `useFavoriteState.ts`
- [ ] Implement proper state transitions and loading states
- [ ] Add optimistic updates for user actions
- [ ] Create state persistence strategy (localStorage + sync)

### 4.4 UI Component Refactoring
- [ ] Convert CurrencyWidget to pure presentational component
- [ ] Remove data fetching and state logic from UI components
- [ ] Standardize prop interfaces across widget types
- [ ] Implement consistent loading/error states

### 4.5 Hook Consolidation
- [ ] Review existing hooks (`useAdaptiveLayout`, `useFavoriteCurrencies`)
- [ ] Identify opportunities for hook composition
- [ ] Create utility hooks for common patterns (debounce, throttle, resize observer)

### 4.6 Testing Refinement
- [ ] Update tests to reflect new architecture
- [ ] Add integration tests for component-service interactions
- [ ] Test state management edge cases
- [ ] Verify performance improvements

## Success Criteria
- Components are pure presentational (no side effects)
- Services handle all data operations
- State management is centralized and consistent
- Code is more maintainable and testable
- Performance metrics show improvement

## Priority: High
Current component structure violates SRP and makes testing difficult. This refactor will significantly improve code quality.