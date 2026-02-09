import { cn } from '@/lib/utils';
import type { WidgetSize } from '@/types/demos';

interface WeatherWidgetSkeletonProps {
  size: WidgetSize;
}

export function WeatherWidgetSkeleton({ size }: WeatherWidgetSkeletonProps) {
  const itemCount = size === 'small' ? 1 : size === 'medium' ? 3 : 5;

  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-700 rounded w-1/6"></div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-700 rounded w-12"></div>
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
