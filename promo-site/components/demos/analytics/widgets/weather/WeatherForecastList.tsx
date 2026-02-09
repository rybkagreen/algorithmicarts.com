import { WeatherForecastItem } from './WeatherForecastItem';
import type { WeatherForecast } from '@/types/demos';

interface WeatherForecastListProps {
  forecasts: WeatherForecast[];
  location: string;
  favorites: string[];
  onToggleFavorite: (location: string) => void;
  showChart?: boolean;
  compact?: boolean;
}

export function WeatherForecastList({
  forecasts,
  location,
  favorites,
  onToggleFavorite,
  showChart = false,
  compact = false,
}: WeatherForecastListProps) {
  return (
    <div className="overflow-y-auto flex-grow">
      <div className="divide-y divide-gray-800/50">
        {forecasts.map((forecast) => (
          <WeatherForecastItem
            key={`${forecast.location}-${forecast.date}`}
            forecast={forecast}
            location={location}
            isFavorite={favorites.includes(forecast.location)}
            onToggleFavorite={onToggleFavorite}
            compact={compact}
            showChart={showChart}
          />
        ))}
      </div>
    </div>
  );
}
