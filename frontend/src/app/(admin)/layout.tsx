'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';
import { Shield, Server, Users, Settings } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

const ADMIN_MENU: SidebarItem[] = [
  { icon: Shield, label: 'Admin Dashboard', href: '/admin' },
  { icon: Server, label: 'All Nodes', href: '/admin/nodes' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

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
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-950">
        <Loading text="Loading admin..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar items={ADMIN_MENU} role="ADMIN" />
      <main className="flex-1 md:pl-64 overflow-x-hidden pt-16 md:pt-0">
        <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
