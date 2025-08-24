'use client';
import { useAuth } from '../lib/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.user) router.push('/');
    else if (auth.user.role !== 'admin') router.push('/user/dashboard');
  }, [auth.user, router]); // <- added router here

  if (!auth.user || auth.user.role !== 'admin') return <div>Checking permissions...</div>;

  return <>{children}</>;
}
