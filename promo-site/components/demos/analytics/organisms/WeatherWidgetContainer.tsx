import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { WidgetSize } from '@/types/demos';

interface WeatherWidgetContainerProps {
  children: React.ReactNode;
  size: WidgetSize;
  className?: string;
}

export const WeatherWidgetContainer = forwardRef<HTMLDivElement, WeatherWidgetContainerProps>(
  ({ children, size, className }, ref) => {
    const sizeClasses = {
      small: 'min-h-[150px] max-h-[300px]',
      medium: 'min-h-[300px] max-h-[500px]',
      large: 'min-h-[500px] max-h-[800px]',
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
        aria-label="Weather Forecast Widget"
      >
        {children}
      </div>
    );
  }
);

WeatherWidgetContainer.displayName = 'WeatherWidgetContainer';
