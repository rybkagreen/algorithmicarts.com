import { GitHubStatItem } from './GitHubStatItem';
import type { GitHubStat } from '@/types/demos';

interface GitHubStatListProps {
  stats: GitHubStat[];
  username: string;
  favorites: string[];
  onToggleFavorite: (label: string) => void;
  showChart?: boolean;
  compact?: boolean;
}

export function GitHubStatList({
  stats,
  username,
  favorites,
  onToggleFavorite,
  showChart = false,
  compact = false,
}: GitHubStatListProps) {
  return (
    <div className="overflow-y-auto flex-grow">
      <div className="divide-y divide-gray-800/50">
        {stats.map((stat) => (
          <GitHubStatItem
            key={`${username}-${stat.label}`}
            stat={stat}
            username={username}
            isFavorite={favorites.includes(stat.label)}
            onToggleFavorite={onToggleFavorite}
            compact={compact}
            showChart={showChart}
          />
        ))}
      </div>
    </div>
  );
}
