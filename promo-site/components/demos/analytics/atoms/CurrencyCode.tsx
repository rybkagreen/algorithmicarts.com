import { cn } from '@/lib/utils';

interface CurrencyCodeProps {
  code: string;
  name?: string;
  showName?: boolean;
  className?: string;
}

export function CurrencyCode({
  code,
  name,
  showName = false,
  className
}: CurrencyCodeProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-cyan-400 font-medium">{code}</span>
      {showName && name && (
        <span className="text-xs text-gray-400">{name}</span>
      )}
    </div>
  );
}
