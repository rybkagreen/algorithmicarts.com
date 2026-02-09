import { render, screen } from '@testing-library/react';
import { CurrencyCode } from './CurrencyCode';

describe('CurrencyCode', () => {
  it('renders currency code and name correctly', () => {
    render(<CurrencyCode code="USD" name="US Dollar" showName={true} />);
    
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('US Dollar')).toBeInTheDocument();
  });

  it('renders only code when showName is false', () => {
    render(<CurrencyCode code="USD" name="US Dollar" showName={false} />);
    
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.queryByText('US Dollar')).not.toBeInTheDocument();
  });
});