import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteButton } from './FavoriteButton';

describe('FavoriteButton', () => {
  it('renders favorite state correctly', () => {
    render(<FavoriteButton isFavorite={true} onClick={() => {}} />);
    
    // Check the SVG element by its aria-hidden attribute
    const star = screen.getByLabelText(/star/i);
    expect(star).toHaveClass('text-yellow-400');
    expect(star).toHaveAttribute('fill', 'currentColor');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('renders not favorite state correctly', () => {
    render(<FavoriteButton isFavorite={false} onClick={() => {}} />);
    
    // Check the SVG element by its aria-hidden attribute
    const star = screen.getByLabelText(/star/i);
    expect(star).toHaveClass('text-gray-500');
    expect(star).toHaveAttribute('fill', 'none');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Add to favorites');
  });

  it('calls onClick handler when clicked', () => {
    const mockClick = jest.fn();
    render(<FavoriteButton isFavorite={false} onClick={mockClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});