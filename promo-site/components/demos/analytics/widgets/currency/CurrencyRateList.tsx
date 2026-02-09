import { CurrencyRateCard } from '../../molecules/CurrencyRateCard';
import type { CurrencyRate } from '@/types/demos';

interface CurrencyRateListProps {
  rates: CurrencyRate[];
  baseCurrency: string;
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  showChart?: boolean;
  compact?: boolean;
}

export function CurrencyRateList({
  rates,
  baseCurrency,
  favorites,
  onToggleFavorite,
  showChart = false,
  compact = false,
}: CurrencyRateListProps) {
  return (
    <div className="overflow-y-auto flex-grow">
      <div className="divide-y divide-gray-800/50">
        {rates.map((rate) => (
          <CurrencyRateCard
            key={rate.code}
            rate={rate}
            baseCurrency={baseCurrency}
            isFavorite={favorites.includes(rate.code)}
            onToggleFavorite={onToggleFavorite}
            isCompact={compact}
            showChart={showChart}
          />
        ))}
      </div>
    </div>
  );
}
