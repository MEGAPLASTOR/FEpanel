'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const init = useAuth((state) => state.init);
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    const unsubscribe = init();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [init]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loading text="Initializing..." />
      </div>
    );
  }

  return <>{children}</>;
}
