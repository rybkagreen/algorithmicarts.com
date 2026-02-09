import { render, screen } from '@testing-library/react';
import { TrendIndicator } from './TrendIndicator';

describe('TrendIndicator', () => {
  it('renders positive trend with correct icon and text', () => {
    render(<TrendIndicator change={2.5} showValue={true} />);
    
    // Check the SVG element by its aria-hidden attribute
    const svg = screen.getByLabelText(/trending up/i);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
    // Check the main span class
    const trendElement = screen.getByText('+2.50%').parentElement;
    expect(trendElement).toHaveClass('text-green-500');
  });

  it('renders negative trend with correct icon and text', () => {
    render(<TrendIndicator change={-1.75} showValue={true} />);
    
    expect(screen.getByText('-1.75%')).toBeInTheDocument();
    // Check the main span class
    const trendElement = screen.getByText('-1.75%').parentElement;
    expect(trendElement).toHaveClass('text-red-500');
  });

  it('hides value when showValue is false', () => {
    render(<TrendIndicator change={3.2} showValue={false} />);
    
    expect(screen.queryByText('+3.20%')).not.toBeInTheDocument();
    // Check the SVG element by its aria-hidden attribute
    const svg = screen.getByLabelText(/trending up/i);
    expect(svg).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container } = render(<TrendIndicator change={1.0} size="sm" />);
    
    expect(container.querySelector('svg')).toHaveClass('h-3', 'w-3');
    expect(container.firstChild).toHaveClass('text-xs');
  });
});