import { cn } from '@/lib/utils';
import { TrendIndicator } from '../../atoms/TrendIndicator';
import { FavoriteButton } from '../../atoms/FavoriteButton';
import type { WeatherForecast } from '@/types/demos';

interface WeatherForecastItemProps {
  forecast: WeatherForecast;
  location: string;
  isFavorite: boolean;
  onToggleFavorite: (location: string) => void;
  compact?: boolean;
  showChart?: boolean;
}

export function WeatherForecastItem({
  forecast,
  location,
  isFavorite,
  onToggleFavorite,
  compact = false,
  showChart = false, // intentionally unused - kept for future implementation
}: WeatherForecastItemProps) {
  return (
    <div className={cn(
      'flex items-center justify-between py-3',
      compact ? 'py-2' : 'py-3'
    )}>
      <div className="flex items-center space-x-3">
        <div className="text-xl">{forecast.condition === 'sunny' ? '☀️' : '☁️'}</div>
        <div>
          <div className={cn(
            'font-medium',
            compact ? 'text-sm' : 'text-base'
          )}>
            {forecast.location}
          </div>
          <div className={cn(
            'text-gray-400',
            compact ? 'text-xs' : 'text-sm'
          )}>
            {new Date(forecast.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className={cn(
            'font-mono font-medium',
            compact ? 'text-sm' : 'text-base'
          )}>
            {forecast.temperature}°C
          </div>
          <TrendIndicator
            change={forecast.change24h}
            showValue={!compact}
            size={compact ? 'sm' : 'md'}
            className="mt-1"
          />
        </div>

        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => onToggleFavorite(forecast.location)}
        />
      </div>
    </div>
  );
}
