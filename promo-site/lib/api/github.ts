import { GitHubStats } from '@/types/demos';

const GITHUB_API_URL = 'https://api.github.com';

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    // Fetch user data
    const userResponse = await fetch(`${GITHUB_API_URL}/users/${username}`);
    if (!userResponse.ok) throw new Error('GitHub API error');
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`);
    if (!reposResponse.ok) throw new Error('GitHub API error');
    const repos = await reposResponse.json();

    // Calculate stats
    const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

    // Get top languages
    const languages: Record<string, number> = {};
    repos.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / repos.length) * 100),
        color: LANGUAGE_COLORS[name] || '#858585',
      }));

    // Generate mock activity data (GitHub API has rate limits for events)
    const recentActivity = generateMockActivity();

    return {
      username: userData.login,
      name: userData.name || userData.login,
      avatar: userData.avatar_url,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
      contributions: Math.floor(Math.random() * 2000) + 500, // Mock data
      topLanguages,
      recentActivity,
      stats: [
        { label: 'Stars', value: totalStars, change: 5.2 },
        { label: 'Forks', value: totalForks, change: 2.1 },
        { label: 'Contributors', value: 24, change: -1.3 },
        { label: 'Commits', value: 1240, change: 0.8 },
        { label: 'PRs', value: 420, change: 4.5 },
      ],
    };
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return getMockGitHubStats(username);
  }
}

function generateMockActivity() {
  const activity = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    activity.push({
      date: date.toISOString().split('T')[0],
      commits: Math.floor(Math.random() * 15),
      prs: Math.floor(Math.random() * 5),
      issues: Math.floor(Math.random() * 3),
    });
  }

  return activity.reverse();
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
};

function getMockGitHubStats(username: string): GitHubStats {
  return {
    username,
    name: 'Demo User',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    publicRepos: 42,
    followers: 128,
    following: 64,
    totalStars: 356,
    totalForks: 89,
    contributions: 1247,
    topLanguages: [
      { name: 'TypeScript', percentage: 45, color: '#3178c6' },
      { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
      { name: 'Python', percentage: 15, color: '#3572A5' },
      { name: 'Go', percentage: 10, color: '#00ADD8' },
    ],
    recentActivity: generateMockActivity(),
    stats: [
      { label: 'Stars', value: 356, change: 5.2 },
      { label: 'Forks', value: 89, change: 2.1 },
      { label: 'Contributors', value: 24, change: -1.3 },
      { label: 'Commits', value: 1247, change: 0.8 },
      { label: 'PRs', value: 420, change: 4.5 },
    ],
  };
}
