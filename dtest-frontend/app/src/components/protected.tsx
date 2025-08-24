'use client';
import { useEffect } from 'react';
import { useAuth } from '../lib/auth-store';
import { useRouter } from 'next/navigation';

export function Protected({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.user) router.push('/');
  }, [auth.user, router]); // <- added router to dependencies

  if (!auth.user) return <div>Redirecting...</div>;

  return <>{children}</>;
}