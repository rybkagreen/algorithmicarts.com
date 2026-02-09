import { DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CurrencyWidgetHeaderProps {
  baseCurrency: string;
  onCurrencyChange: (currency: string) => void;
  lastUpdate: number;
  className?: string;
}

export function CurrencyWidgetHeader({
  baseCurrency,
  onCurrencyChange,
  lastUpdate,
  className
}: CurrencyWidgetHeaderProps) {
  const formattedDate = format(lastUpdate, 'MMM d, yyyy HH:mm');

  return (
    <div className={cn("flex items-center justify-between pb-3 border-b border-gray-700", className)}>
      <div className="flex items-center space-x-2">
        <DollarSign className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Exchange Rates</h3>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>

        <select
          value={baseCurrency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-gray-800 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Select base currency"
        >
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="CNY">CNY</option>
        </select>
      </div>
    </div>
  );
}
