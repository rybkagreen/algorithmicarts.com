# Phase 1: Critical Foundation - API Integration

## Goal
Replace mock data with real API integration for currency data and establish proper service layer.

## Tasks

### 3.1 API Service Layer Design
- [ ] Define API client interface contract
- [ ] Create service directory structure (`lib/api/`)
- [ ] Design error handling strategy (retry, fallback, user feedback)
- [ ] Plan authentication requirements (if any)

### 3.2 Currency API Implementation
- [ ] Research available currency APIs (CBR, ExchangeRate-API, etc.)
- [ ] Implement `CurrencyApiService` class with:
  - [ ] `getRates(baseCurrency: string)` method
  - [ ] `getHistoricalRates()` method (future)
  - [ ] Error handling and retry logic
- [ ] Add rate limiting to prevent API abuse
- [ ] Implement caching strategy (localStorage + memory cache)

### 3.3 Hook Refactoring
- [ ] Refactor `useCurrencyRates.ts` to use new API service
- [ ] Remove hardcoded mock data
- [ ] Update type definitions to match real API responses
- [ ] Add loading state improvements (skeleton vs loading indicators)

### 3.4 Error Handling Enhancement
- [ ] Implement comprehensive error types (network, API, parsing)
- [ ] Add user-friendly error messages for different scenarios
- [ ] Create error recovery strategies (offline mode, cached data)

### 3.5 Testing API Integration
- [ ] Create mock API for testing purposes
- [ ] Test success, error, and edge cases
- [ ] Verify error boundaries work correctly
- [ ] Test performance under slow network conditions

## Success Criteria
- CurrencyWidget displays real data from external API
- Error handling works for all failure scenarios
- Performance is acceptable (sub-2s load time)
- Code is properly typed and documented
- Tests cover all API interaction scenarios

## Priority: High
Mock data prevents the widget from being production-ready. Real API integration is essential for functionality.