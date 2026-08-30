'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white font-bold">Create an account</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-900 text-red-200 text-sm rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              id="displayName"
              type="text"
              placeholder="Username"
              label="Username"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
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
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" loading={loading}>
            Sign Up
          </Button>
          <div className="text-sm text-center text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-minecraft-accent hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
