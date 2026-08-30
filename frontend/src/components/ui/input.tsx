import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-galaxy-text-sub uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border border-galaxy-border bg-galaxy-bg-sub/80 px-3.5 py-2 text-sm text-galaxy-text placeholder:text-galaxy-text-sub/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-galaxy-primary focus-visible:border-galaxy-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error && 'border-galaxy-error focus-visible:ring-galaxy-error',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-galaxy-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
