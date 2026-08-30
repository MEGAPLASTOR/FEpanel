'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Users, Activity, Sparkles, Shield, ArrowRight, RefreshCw, Cpu, HardDrive } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalNodes: 1,
    onlineNodes: 1,
    totalUsers: 3,
    totalSlots: 4,
    runningSlots: 2,
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      {/* Hero Banner Ocean Galaxy */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-galaxy-card via-galaxy-bg-sub to-galaxy-card border border-galaxy-border p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-galaxy-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-galaxy-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-galaxy-secondary/20 border border-galaxy-secondary/40 text-galaxy-secondary-hover text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" /> BẢNG ĐIỀU KHIỂN TỐI CAO • ADMIN MASTER
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-galaxy-text tracking-tight">
            Chào mừng trở lại, <span className="text-transparent bg-clip-text bg-gradient-to-r from-galaxy-primary via-galaxy-highlight to-galaxy-accent">MEGAPLASTOR</span>
          </h1>
          <p className="text-galaxy-text-sub text-sm leading-relaxed">
            Hệ thống đang quản lý các máy chủ VPS Windows 10 và điều phối các Slot Minecraft treo acc tự động cho khách hàng.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/admin/users">
              <Button className="shadow-galaxy-glow">
                <Users className="w-4 h-4 mr-2" />
                Cấp Hạn Mức Slot Khách Hàng
              </Button>
            </Link>
            <Link href="/admin/nodes">
              <Button variant="outline" className="border-galaxy-border">
                <Server className="w-4 h-4 mr-2 text-galaxy-primary" />
                Quản Lý VPS Windows 10
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-galaxy-card/90 border-galaxy-border shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-galaxy-text-sub uppercase tracking-wider">
                Máy chủ VPS Nodes
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-galaxy-bg-sub border border-galaxy-border text-galaxy-primary">
                <Server className="w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-galaxy-text mb-1">
              {stats.totalNodes} <span className="text-xs text-galaxy-success font-medium">(100% Online)</span>
            </div>
            <p className="text-xs text-galaxy-text-sub">
              Hệ điều hành: Windows 10 Pro
            </p>
          </CardContent>
        </Card>

        <Card className="bg-galaxy-card/90 border-galaxy-border shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-galaxy-text-sub uppercase tracking-wider">
                Tổng Khách Hàng
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-galaxy-bg-sub border border-galaxy-border text-galaxy-accent">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-galaxy-text mb-1">
              {stats.totalUsers} <span className="text-xs text-galaxy-text-sub font-normal">tài khoản</span>
            </div>
            <p className="text-xs text-galaxy-text-sub">
              Tất cả đều được cấp sẵn Slot treo game
            </p>
          </CardContent>
        </Card>

        <Card className="bg-galaxy-card/90 border-galaxy-border shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-galaxy-text-sub uppercase tracking-wider">
                Slots Đang Treo Acc
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-galaxy-bg-sub border border-galaxy-border text-galaxy-secondary-hover">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-galaxy-success mb-1 flex items-center gap-2">
              {stats.runningSlots} <span className="text-xs text-galaxy-text-sub font-normal">/ {stats.totalSlots} Slots đã tạo</span>
            </div>
            <p className="text-xs text-galaxy-text-sub">
              Chạy ngầm liên tục 24/7
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/users" className="group">
          <Card className="bg-galaxy-card/80 border-galaxy-border group-hover:border-galaxy-primary/60 transition-all duration-300 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-galaxy-primary/20 to-galaxy-card-hover border border-galaxy-primary/40 flex items-center justify-center text-galaxy-primary group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-galaxy-text group-hover:text-galaxy-primary transition-colors">
                  Quản lý Khách hàng & Cấp Slot →
                </h3>
                <p className="text-xs text-galaxy-text-sub">
                  Xem danh sách user, nâng hạ hạn mức Slot cho từng người.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/nodes" className="group">
          <Card className="bg-galaxy-card/80 border-galaxy-border group-hover:border-galaxy-primary/60 transition-all duration-300 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-galaxy-secondary/20 to-galaxy-card-hover border border-galaxy-secondary/40 flex items-center justify-center text-galaxy-secondary-hover group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-galaxy-text group-hover:text-galaxy-secondary-hover transition-colors">
                  Quản lý Máy chủ VPS Nodes →
                </h3>
                <p className="text-xs text-galaxy-text-sub">
                  Theo dõi CPU, RAM của máy chủ VPS Windows 10.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
