import { cn } from '@/lib/utils';
import type { WidgetSize } from '@/types/demos';

interface GitHubWidgetSkeletonProps {
  size: WidgetSize;
}

export function GitHubWidgetSkeleton({ size }: GitHubWidgetSkeletonProps) {
  const itemCount = size === 'small' ? 1 : size === 'medium' ? 5 : 10;

  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-700 rounded w-1/5"></div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-16 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-700 rounded w-16"></div>
              <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
