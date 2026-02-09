import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { WidgetSize } from '../types';

interface CurrencyWidgetContainerProps {
  children: React.ReactNode;
  size: WidgetSize;
  className?: string;
}

export const CurrencyWidgetContainer = forwardRef<HTMLDivElement, CurrencyWidgetContainerProps>(
  ({ children, size, className }, ref) => {
    const sizeClasses = {
      nano: 'min-h-[100px] max-h-[200px]',
      tiny: 'min-h-[150px] max-h-[250px]',
      small: 'min-h-[200px] max-h-[300px]',
      medium: 'min-h-[300px] max-h-[500px]',
      large: 'min-h-[500px] max-h-[800px]',
      huge: 'min-h-[800px] max-h-[1200px]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-background-tertiary border border-border-primary rounded-lg p-4',
          sizeClasses[size],
          className
        )}
        role="region"
        aria-label="Currency Exchange Rates Widget"
      >
        {children}
      </div>
    );
  }
);

CurrencyWidgetContainer.displayName = 'CurrencyWidgetContainer';
