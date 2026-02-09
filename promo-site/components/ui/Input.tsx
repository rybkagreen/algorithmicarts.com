import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 bg-background-secondary border border-border-primary rounded-lg',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary',
            'transition-colors duration-150',
            error && 'border-accent-error focus:border-accent-error focus:ring-accent-error',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-accent-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
