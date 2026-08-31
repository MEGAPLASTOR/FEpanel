'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    const cleanInput = identifier.trim();
    const emailToUse = cleanInput.includes('@') ? cleanInput : `${cleanInput.toLowerCase()}@minecraft.panel`;
    const isAdminAccount = cleanInput.toUpperCase() === 'MEGAPLASTOR';

    try {
      await login(emailToUse, password);
      window.location.href = isAdminAccount ? '/admin' : '/slots';
    } catch (err: any) {
      // Error message is automatically converted to friendly Vietnamese in useAuth
    }
  };

  return (
    <div className="w-full max-w-md p-1 rounded-3xl bg-gradient-to-b from-galaxy-primary/30 via-galaxy-secondary/20 to-transparent shadow-2xl">
      <Card className="w-full bg-galaxy-card/95 backdrop-blur-xl border-galaxy-border rounded-[22px]">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-galaxy-secondary to-galaxy-primary flex items-center justify-center text-white shadow-galaxy-glow mb-2">
            <Sparkles className="w-6 h-6 text-galaxy-accent animate-pulse" />
          </div>
          <CardTitle className="text-2xl text-galaxy-text font-extrabold tracking-wide">
            OCEAN <span className="text-galaxy-primary">GALAXY</span>
          </CardTitle>
          <CardDescription className="text-galaxy-text-sub text-xs">
            Hệ thống Quản lý & Treo Acc Minecraft Đám mây
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-galaxy-error/15 border border-galaxy-error/40 text-galaxy-error text-xs rounded-xl flex items-center gap-2">
                <span className="font-bold">⚠️</span> {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-galaxy-text-sub flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-galaxy-primary" /> Tên tài khoản hoặc Email
              </label>
              <Input
                placeholder="VD: MEGAPLASTOR hoặc email của bạn..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="bg-galaxy-bg"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-galaxy-text-sub flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-galaxy-primary" /> Mật khẩu
                </label>
                <Link href="/forgot-password" className="text-[11px] text-galaxy-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-galaxy-bg"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full py-2.5 shadow-galaxy-glow" loading={loading}>
              Đăng nhập hệ thống
            </Button>
            <div className="text-xs text-center text-galaxy-text-sub">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-galaxy-primary hover:text-galaxy-primary-hover font-semibold hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
