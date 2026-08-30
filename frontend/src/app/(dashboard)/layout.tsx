'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';
import { LayoutDashboard, Server, CreditCard } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

const USER_MENU: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Server, label: 'My Slots', href: '/slots' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
];

export default function DashboardLayout({
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
        <Loading text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar items={USER_MENU} role="USER" />
      <main className="flex-1 md:pl-64 overflow-x-hidden pt-16 md:pt-0">
        <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
