import { Sun, Cloud, Droplets, Wind, Thermometer, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeatherWidgetHeaderProps {
  location: string;
  onLocationChange: (location: string) => void;
  lastUpdate: number;
  className?: string;
}

export function WeatherWidgetHeader({
  location,
  onLocationChange,
  lastUpdate,
  className
}: WeatherWidgetHeaderProps) {
  const formattedDate = format(lastUpdate, 'MMM d, yyyy HH:mm');

  return (
    <div className={cn("flex items-center justify-between pb-3 border-b border-gray-700", className)}>
      <div className="flex items-center space-x-2">
        <Sun className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Weather Forecast</h3>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-gray-400">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>

        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="bg-gray-800 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Select location"
        >
          <option value="Moscow">Moscow</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Sydney">Sydney</option>
        </select>
      </div>
    </div>
  );
}
