import { cn } from '@/lib/utils';

interface CurrencyValueProps {
  value: number;
  baseCurrency: string;
  decimals?: number;
  className?: string;
}

export function CurrencyValue({
  value,
  baseCurrency,
  decimals = 4,
  className
}: CurrencyValueProps) {
  return (
    <span className={cn('font-mono', className)}>
      {value.toFixed(decimals)} {baseCurrency}
    </span>
  );
}
