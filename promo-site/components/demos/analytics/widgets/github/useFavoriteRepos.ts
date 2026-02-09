import { useState, useEffect } from 'react';

export function useFavoriteRepos() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('github-favorites');
    return stored ? JSON.parse(stored) : ['repo1', 'repo2'];
  });

  useEffect(() => {
    localStorage.setItem('github-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (repo: string) => {
    setFavorites(prev =>
      prev.includes(repo)
        ? prev.filter(r => r !== repo)
        : [...prev, repo]
    );
  };

  return { favorites, toggleFavorite };
}
