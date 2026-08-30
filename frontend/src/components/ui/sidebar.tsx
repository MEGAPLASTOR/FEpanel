'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, User, Menu, X, Sparkles, Server, Shield, Layers } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface SidebarProps {
  items?: SidebarItem[];
  role?: 'USER' | 'ADMIN';
}

export function Sidebar({ items, role }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if current user is the master admin MEGAPLASTOR
  const isAdmin =
    role === 'ADMIN' ||
    user?.email?.toLowerCase().includes('megaplastor') ||
    user?.displayName?.toLowerCase() === 'megaplastor';

  const defaultUserMenu: SidebarItem[] = [
    { icon: Server, label: 'Minecraft Slots', href: '/slots' },
  ];

  const defaultAdminMenu: SidebarItem[] = [
    { icon: Shield, label: 'Tổng quan Admin', href: '/admin' },
    { icon: Layers, label: 'Khách hàng & Cấp Slot', href: '/admin/users' },
    { icon: Server, label: 'Quản lý VPS Nodes', href: '/admin/nodes' },
    { icon: Server, label: 'Xem Giao diện User', href: '/slots' },
  ];

  const menuItems = items || (isAdmin ? defaultAdminMenu : defaultUserMenu);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-galaxy-card border border-galaxy-border rounded-xl text-galaxy-primary shadow-galaxy-glow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar with Ocean Galaxy Theme */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-galaxy-bg-sub/95 backdrop-blur-md border-r border-galaxy-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Ocean Galaxy */}
        <div className="h-20 flex items-center px-6 border-b border-galaxy-border/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-galaxy-secondary to-galaxy-primary flex items-center justify-center text-white shadow-galaxy-glow">
              <Sparkles className="w-5 h-5 text-galaxy-accent animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-galaxy-text tracking-wide flex items-center gap-1.5">
                OCEAN <span className="text-galaxy-primary">GALAXY</span>
              </h1>
              <p className="text-[10px] font-mono text-galaxy-text-sub uppercase tracking-wider">
                Minecraft Cloud
              </p>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-galaxy-text-sub/70">
            {isAdmin ? 'Quản trị hệ thống' : 'Bảng điều khiển'}
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/slots' && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-galaxy-card text-galaxy-primary border border-galaxy-primary/50 shadow-galaxy-glow font-semibold'
                      : 'text-galaxy-text-sub hover:bg-galaxy-card-hover hover:text-galaxy-text hover:border-galaxy-border/60 border border-transparent'
                  )}
                >
                  <item.icon size={18} className={isActive ? 'text-galaxy-primary' : 'text-galaxy-text-sub'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-galaxy-border bg-galaxy-bg/60">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-galaxy-card border border-galaxy-border/70">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-galaxy-secondary/60 to-galaxy-card-hover border border-galaxy-secondary/50 flex items-center justify-center text-galaxy-highlight font-bold text-sm">
              {user?.displayName?.charAt(0).toUpperCase() || (isAdmin ? 'A' : 'U')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-galaxy-text truncate">
                {user?.displayName || (isAdmin ? 'MEGAPLASTOR' : user?.email?.split('@')[0] || 'User')}
              </p>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  'inline-block w-1.5 h-1.5 rounded-full',
                  isAdmin ? 'bg-galaxy-warning' : 'bg-galaxy-success'
                )} />
                <p className="text-[10px] text-galaxy-text-sub uppercase font-mono">
                  {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-galaxy-error hover:bg-galaxy-error/10 border border-transparent hover:border-galaxy-error/30 transition-all duration-200"
          >
            <LogOut size={15} />
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
