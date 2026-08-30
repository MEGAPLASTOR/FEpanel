import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-galaxy-primary text-galaxy-bg font-bold',
        secondary:
          'border-galaxy-secondary/40 bg-galaxy-secondary/20 text-galaxy-secondary-hover',
        destructive:
          'border-galaxy-error/40 bg-galaxy-error/15 text-galaxy-error font-medium',
        outline:
          'border-galaxy-border bg-galaxy-bg text-galaxy-text-sub',
        success:
          'border-galaxy-success/40 bg-galaxy-success/15 text-galaxy-success font-medium',
        warning:
          'border-galaxy-warning/40 bg-galaxy-warning/15 text-galaxy-warning font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
