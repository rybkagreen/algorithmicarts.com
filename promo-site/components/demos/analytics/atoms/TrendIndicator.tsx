import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  change: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrendIndicator({
  change,
  showValue = true,
  size = 'md',
  className
}: TrendIndicatorProps) {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <span
      className={cn(
        'flex items-center gap-1',
        isPositive ? 'text-green-500' : 'text-red-500',
        textSizes[size],
        className
      )}
      aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(change)}%`}
    >
      <Icon className={sizeClasses[size]} aria-hidden="true" />
      {showValue && (
        <span className="font-medium">
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      )}
    </span>
  );
}
