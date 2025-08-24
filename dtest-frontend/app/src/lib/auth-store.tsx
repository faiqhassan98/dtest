import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('dtest_token');
    const u = localStorage.getItem('dtest_user');
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u) as User);
  }, []);

  function signIn(t: string, u: User) {
    localStorage.setItem('dtest_token', t);
    localStorage.setItem('dtest_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }

  function signOut() {
    localStorage.removeItem('dtest_token');
    localStorage.removeItem('dtest_user');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}