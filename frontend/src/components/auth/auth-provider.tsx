'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const init = useAuth((state) => state.init);

  useEffect(() => {
    const unsubscribe = init();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [init]);

  return <>{children}</>;
}
