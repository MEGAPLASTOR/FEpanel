'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/ui/sidebar';
import { Loading } from '@/components/ui/loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [user, initialized, router]);

  if (!initialized) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-galaxy-bg">
        <Loading text="Đang tải dữ liệu Quản trị viên..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-galaxy-bg text-galaxy-text galaxy-bg-glow">
      <Sidebar role="ADMIN" />
      <main className="flex-1 md:pl-64 overflow-x-hidden pt-16 md:pt-0">
        <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
