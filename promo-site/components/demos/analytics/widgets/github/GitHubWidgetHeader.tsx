import { Github, User, Calendar, MapPin, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubWidgetHeaderProps {
  username: string;
  onUsernameChange: (username: string) => void;
  lastUpdate: number;
  className?: string;
}

export function GitHubWidgetHeader({
  username,
  onUsernameChange,
  lastUpdate,
  className
}: GitHubWidgetHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between pb-3 border-b border-gray-700", className)}>
      <div className="flex items-center space-x-2">
        <Github className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">GitHub Stats</h3>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-400">
          Updated: {new Date(lastUpdate).toLocaleDateString()}
        </div>

        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="bg-gray-800 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="GitHub Username"
          aria-label="Enter GitHub username"
        />
      </div>
    </div>
  );
}
