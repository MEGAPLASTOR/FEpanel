'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) return;
    try {
      await register(email, password, displayName);
      window.location.href = '/dashboard';
    } catch (err) {
      // Error handled in store
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
            TẠO TÀI KHOẢN MỚI
          </CardTitle>
          <CardDescription className="text-galaxy-text-sub text-xs">
            Nhận ngay hạn mức Slot miễn phí để treo acc Minecraft
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
                <User className="w-3.5 h-3.5 text-galaxy-primary" /> Tên người dùng (Username)
              </label>
              <Input
                placeholder="VD: PlayerOne"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="bg-galaxy-bg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-galaxy-text-sub flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-galaxy-primary" /> Địa chỉ Email
              </label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-galaxy-bg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-galaxy-text-sub flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-galaxy-primary" /> Mật khẩu bảo mật
              </label>
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
            <Button type="submit" className="w-full py-2.5" loading={loading}>
              Tạo tài khoản & Bắt đầu
            </Button>
            <div className="text-xs text-center text-galaxy-text-sub">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-galaxy-primary hover:text-galaxy-primary-hover font-semibold hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
