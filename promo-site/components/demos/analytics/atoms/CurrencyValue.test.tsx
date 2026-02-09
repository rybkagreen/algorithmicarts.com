import { render, screen } from '@testing-library/react';
import { CurrencyValue } from './CurrencyValue';

describe('CurrencyValue', () => {
  it('renders value with correct formatting and base currency', () => {
    render(<CurrencyValue value={1.2345} baseCurrency="EUR" />);
    
    expect(screen.getByText('1.2345 EUR')).toBeInTheDocument();
  });

  it('formats with specified decimal places', () => {
    render(<CurrencyValue value={1.2345} baseCurrency="EUR" decimals={2} />);
    
    expect(screen.getByText('1.23 EUR')).toBeInTheDocument();
  });

  it('handles integer values correctly', () => {
    render(<CurrencyValue value={2} baseCurrency="USD" decimals={0} />);
    
    expect(screen.getByText('2 USD')).toBeInTheDocument();
  });
});