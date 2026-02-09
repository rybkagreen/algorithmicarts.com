import { useState, useEffect } from 'react';

export function useFavoriteLocations() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('weather-favorites');
    return stored ? JSON.parse(stored) : ['Moscow', 'London'];
  });

  useEffect(() => {
    localStorage.setItem('weather-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (location: string) => {
    setFavorites(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  return { favorites, toggleFavorite };
}
