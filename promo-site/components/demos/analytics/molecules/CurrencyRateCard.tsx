import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CurrencyCode } from '../atoms/CurrencyCode';
import { CurrencyValue } from '../atoms/CurrencyValue';
import { TrendIndicator } from '../atoms/TrendIndicator';
import { FavoriteButton } from '../atoms/FavoriteButton';
import type { CurrencyRate } from '../types';

interface CurrencyRateCardProps {
  rate: CurrencyRate;
  baseCurrency: string;
  isFavorite?: boolean;
  onToggleFavorite?: (code: string) => void;
  isCompact?: boolean;
  showChart?: boolean; // intentionally unused - kept for future implementation
  className?: string;
}

export function CurrencyRateCard({
  rate,
  baseCurrency,
  isFavorite = false,
  onToggleFavorite,
  isCompact = false,
  showChart = false, // intentionally unused - kept for future implementation
  className,
}: CurrencyRateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg transition-colors',
        'hover:bg-gray-800/50',
        isCompact ? 'p-2' : 'p-3',
        className
      )}
      role="article"
      aria-label={`${rate.name} exchange rate: ${rate.rate.toFixed(4)} ${baseCurrency} per ${rate.code}`}
    >
      <div className="flex items-center gap-3">
        <CurrencyCode code={rate.code} name={rate.name} showName={!isCompact} />
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <CurrencyValue
            value={rate.rate}
            baseCurrency={baseCurrency}
            decimals={isCompact ? 2 : 4}
          />
          <TrendIndicator
            change={rate.change24h}
            showValue={!isCompact}
            size={isCompact ? 'sm' : 'md'}
            className="mt-1"
          />
        </div>

        {onToggleFavorite && (
          <FavoriteButton isFavorite={isFavorite} onClick={() => onToggleFavorite(rate.code)} />
        )}
      </div>
    </motion.div>
  );
}
