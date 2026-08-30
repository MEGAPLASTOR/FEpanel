import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  className?: string;
  size?: number;
}

export function Loading({ text, className, size = 24 }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2 text-gray-400", className)}>
      <Loader2 size={size} className="animate-spin text-minecraft-green" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
}
