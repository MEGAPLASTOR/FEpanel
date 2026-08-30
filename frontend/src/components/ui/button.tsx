import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-galaxy-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-galaxy-primary text-galaxy-bg hover:bg-galaxy-primary-hover shadow-galaxy-glow font-bold',
        destructive:
          'bg-galaxy-error text-white hover:bg-galaxy-error/90 shadow-sm',
        outline:
          'border border-galaxy-border bg-galaxy-card text-galaxy-text hover:bg-galaxy-card-hover hover:border-galaxy-primary/50 hover:text-galaxy-primary',
        secondary:
          'bg-galaxy-secondary text-white hover:bg-galaxy-secondary-hover shadow-galaxy-purple',
        ghost:
          'hover:bg-galaxy-card-hover text-galaxy-text-sub hover:text-galaxy-text',
        link: 'text-galaxy-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-xl px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
