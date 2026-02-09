import { useState, useEffect } from 'react';

export function useFavoriteCurrencies() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('currency-favorites');
    return stored ? JSON.parse(stored) : ['USD', 'EUR'];
  });

  useEffect(() => {
    localStorage.setItem('currency-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (code: string) => {
    setFavorites(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  return { favorites, toggleFavorite };
}
