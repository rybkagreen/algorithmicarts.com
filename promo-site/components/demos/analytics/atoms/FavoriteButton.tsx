import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  size?: number;
  className?: string;
}

export function FavoriteButton({
  isFavorite,
  onClick,
  size = 16,
  className
}: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'p-1 rounded-full transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500',
        className
      )}
    >
      <Star
        size={size}
        fill={isFavorite ? 'currentColor' : 'none'}
        className={isFavorite ? 'text-yellow-400' : 'text-gray-500'}
        aria-hidden="true"
        aria-label="favorite star"
      />
    </button>
  );
}
