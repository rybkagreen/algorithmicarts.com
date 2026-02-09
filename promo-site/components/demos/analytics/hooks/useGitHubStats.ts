import { useState, useEffect, useCallback } from 'react';
import type { GitHubStats } from '../types';

interface UseGitHubStatsOptions {
  username?: string;
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseGitHubStatsReturn {
  data: GitHubStats | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
}

// Mock GitHub data for demo purposes
const MOCK_GITHUB_DATA: Record<string, GitHubStats> = {
  octocat: {
    username: 'octocat',
    name: 'The Octocat',
    bio: 'GitHub mascot',
    followers: 124000,
    following: 1,
    publicRepos: 12,
    publicGists: 0,
    profileViews: 123456,
    lastUpdate: Date.now(),
    stats: [
      { label: 'Stars', value: 12400, change: 5.2 },
      { label: 'Commits', value: 1240, change: 2.1 },
      { label: 'PRs', value: 420, change: -1.3 },
      { label: 'Issues', value: 87, change: 0.8 },
      { label: 'Contributors', value: 24, change: 4.5 },
    ],
  },
  defunkt: {
    username: 'defunkt',
    name: 'Chris Wanstrath',
    bio: 'Co-founder of GitHub',
    followers: 24000,
    following: 50,
    publicRepos: 42,
    publicGists: 124,
    profileViews: 54321,
    lastUpdate: Date.now(),
    stats: [
      { label: 'Stars', value: 24000, change: 3.2 },
      { label: 'Commits', value: 2400, change: 1.5 },
      { label: 'PRs', value: 840, change: 0.7 },
      { label: 'Issues', value: 174, change: -0.5 },
      { label: 'Contributors', value: 48, change: 2.3 },
    ],
  },
  pjhyett: {
    username: 'pjhyett',
    name: 'PJ Hyett',
    bio: 'Co-founder of GitHub',
    followers: 18000,
    following: 42,
    publicRepos: 36,
    publicGists: 87,
    profileViews: 98765,
    lastUpdate: Date.now(),
    stats: [
      { label: 'Stars', value: 18000, change: 4.7 },
      { label: 'Commits', value: 1800, change: 3.2 },
      { label: 'PRs', value: 630, change: 1.8 },
      { label: 'Issues', value: 126, change: 0.9 },
      { label: 'Contributors', value: 36, change: 1.7 },
    ],
  },
};

export function useGitHubStats(
  username: string = 'octocat',
  options: UseGitHubStatsOptions = {}
): UseGitHubStatsReturn {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<GitHubStats | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(undefined);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockData = MOCK_GITHUB_DATA[username] || MOCK_GITHUB_DATA.octocat;
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [username, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, mutate };
}
