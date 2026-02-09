import { Star, GitPullRequest, AlertTriangle, Eye, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GitHubStat } from '@/types/demos'; // Need to define this type

interface GitHubStatItemProps {
  stat: GitHubStat;
  username: string;
  isFavorite: boolean;
  onToggleFavorite: (label: string) => void;
  compact?: boolean;
  showChart?: boolean;
}

export function GitHubStatItem({
  stat,
  username,
  isFavorite,
  onToggleFavorite,
  compact = false,
  showChart = false, // intentionally unused - kept for future implementation
}: GitHubStatItemProps) {
  // Map stat labels to appropriate icons
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'stars':
        return Star;
      case 'prs':
        return GitPullRequest;
      case 'issues':
        return AlertTriangle;
      case 'views':
        return Eye;
      case 'commits':
        return Calendar;
      default:
        return Star;
    }
  };

  const Icon = getIcon(stat.label);

  return (
    <div className={cn('flex items-center justify-between py-3', compact ? 'py-2' : 'py-3')}>
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
        <span className={cn('font-medium', compact ? 'text-sm' : 'text-base')}>{stat.label}</span>
      </div>

      <div className="flex items-center space-x-4">
        <span className={cn('font-mono font-medium', compact ? 'text-sm' : 'text-base')}>
          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
        </span>

        {stat.change !== undefined && (
          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              stat.change >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            )}
          >
            {stat.change >= 0 ? '+' : ''}
            {stat.change}%
          </span>
        )}

        <button
          onClick={() => onToggleFavorite(stat.label)}
          className={cn(
            'p-1 rounded-full transition-colors',
            isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-400'
          )}
          aria-label={
            isFavorite ? `Remove ${stat.label} from favorites` : `Add ${stat.label} to favorites`
          }
        >
          <Star
            className="h-4 w-4"
            fill={isFavorite ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
