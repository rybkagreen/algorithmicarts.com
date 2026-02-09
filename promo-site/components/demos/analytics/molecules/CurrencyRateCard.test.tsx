import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyRateCard } from './CurrencyRateCard';
import { CurrencyCode } from '../atoms/CurrencyCode';
import { CurrencyValue } from '../atoms/CurrencyValue';
import { TrendIndicator } from '../atoms/TrendIndicator';
import { FavoriteButton } from '../atoms/FavoriteButton';

// Mock child components to isolate testing
jest.mock('../atoms/CurrencyCode', () => ({
  CurrencyCode: ({ code, name }: { code: string; name: string }) => (
    <div data-testid="currency-code">{code} - {name}</div>
  ),
}));

jest.mock('../atoms/CurrencyValue', () => ({
  CurrencyValue: ({ value, baseCurrency }: { value: number; baseCurrency: string }) => (
    <div data-testid="currency-value">{value.toFixed(4)} {baseCurrency}</div>
  ),
}));

jest.mock('../atoms/TrendIndicator', () => ({
  TrendIndicator: ({ change }: { change: number }) => (
    <div data-testid="trend-indicator">Change: {change}%</div>
  ),
}));

jest.mock('../atoms/FavoriteButton', () => ({
  FavoriteButton: ({ isFavorite, onClick }: { isFavorite: boolean; onClick: () => void }) => (
    <button
      data-testid="favorite-button"
      onClick={onClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  ),
}));

describe('CurrencyRateCard', () => {
  const mockRate = {
    code: 'USD',
    name: 'US Dollar',
    rate: 1.0,
    change24h: 0.5,
  };

  it('renders currency code and name correctly', () => {
    render(
      <CurrencyRateCard
        rate={mockRate}
        baseCurrency="EUR"
        isCompact={false}
      />
    );

    expect(screen.getByTestId('currency-code')).toHaveTextContent('USD - US Dollar');
  });

  it('renders currency value with correct formatting', () => {
    render(
      <CurrencyRateCard
        rate={mockRate}
        baseCurrency="EUR"
        isCompact={false}
      />
    );

    expect(screen.getByTestId('currency-value')).toHaveTextContent('1.0000 EUR');
  });

  it('renders trend indicator with correct change value', () => {
    render(
      <CurrencyRateCard
        rate={mockRate}
        baseCurrency="EUR"
        isCompact={false}
      />
    );

    expect(screen.getByTestId('trend-indicator')).toHaveTextContent('Change: 0.5%');
  });

  it('calls onToggleFavorite when favorite button is clicked', () => {
    const toggleMock = jest.fn();
    render(
      <CurrencyRateCard
        rate={mockRate}
        baseCurrency="EUR"
        isFavorite={false}
        onToggleFavorite={toggleMock}
        isCompact={false}
      />
    );

    const favoriteButton = screen.getByTestId('favorite-button');
    fireEvent.click(favoriteButton);
    expect(toggleMock).toHaveBeenCalledWith('USD');
  });

  it('displays compact version correctly', () => {
    render(
      <CurrencyRateCard
        rate={mockRate}
        baseCurrency="EUR"
        isCompact={true}
      />
    );

    // Check that compact mode affects rendering (we'll verify the props are passed)
    const currencyValue = screen.getByTestId('currency-value');
    expect(currencyValue).toHaveTextContent('1.00 EUR'); // Should be 2 decimals in compact mode
  });

  it('has proper accessibility attributes', () => {
    render(
      <CurrencyRateCard
        rate={mockRate}
        baseCurrency="EUR"
        isCompact={false}
      />
    );

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label', 'US Dollar exchange rate: 1.0000 EUR per USD');
  });
});