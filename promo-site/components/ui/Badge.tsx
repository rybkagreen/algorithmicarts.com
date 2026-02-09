import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted';
  className?: string;
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-background-tertiary text-text-secondary border-border-primary',
    accent: 'bg-accent-primary/10 text-accent-primary border-accent-primary/30',
    muted: 'bg-background-secondary text-text-muted border-border-secondary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono border transition-colors duration-150',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
