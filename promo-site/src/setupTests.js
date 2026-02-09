// setupTests.js
require('@testing-library/jest-dom');

// Mock next/router for tests
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next/link for tests
jest.mock('next/link', () => {
  return ({ children }) => children;
});

// Mock SWR hooks
jest.mock('swr', () => ({
  useSWR: jest.fn(),
  mutate: jest.fn(),
}));