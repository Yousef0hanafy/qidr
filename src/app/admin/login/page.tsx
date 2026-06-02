'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Please enter the admin password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Login successful!');
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast.error(data.error || data.message || 'Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            autoFocus
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Authenticating...
          </span>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      <Toaster position="top-center" richColors />

      {/* Branding */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#003327]">
            <Lock className="size-5 text-[#F1CDAB]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">قدر</span>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Qidr Admin
            </span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>
            Enter the admin password to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading...</div>}>
            <AdminLoginForm />
          </Suspense>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            This area is restricted to authorized personnel only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
