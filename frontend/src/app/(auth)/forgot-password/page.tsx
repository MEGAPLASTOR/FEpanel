'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="space-y-1 relative">
        <Link href="/login" className="absolute left-6 top-6 text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <CardTitle className="text-2xl text-center text-white font-bold mt-2">Reset Password</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      
      {success ? (
        <CardContent className="space-y-4">
          <div className="p-4 bg-minecraft-dark/30 border border-minecraft-dark text-minecraft-accent rounded-md text-center">
            Check your email for the password reset link.
          </div>
          <Button asChild className="w-full mt-4">
            <Link href="/login">Return to Login</Link>
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-900 text-red-200 text-sm rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" loading={loading}>
              Send Reset Link
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
