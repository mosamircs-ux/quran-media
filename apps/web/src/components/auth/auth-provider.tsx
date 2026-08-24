'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '@/lib/auth/session';

interface AuthContextValue {
  user: AuthUser | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, locale?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (customEmail?: string, customName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  demoLogin: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setStatus('authenticated');
          return;
        }
      }
      setUser(null);
      setStatus('unauthenticated');
    } catch {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }
      setUser(data.user);
      setStatus('authenticated');
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  };

  const signUp = async (email: string, password: string, name: string, locale: string = 'ar') => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to sign up' };
      }
      setUser(data.user);
      setStatus('authenticated');
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  };

  const signInWithGoogle = async (customEmail?: string, customName?: string) => {
    try {
      const res = await fetch('/api/auth/oauth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customEmail || 'google.user@quranmedia.studio',
          name: customName || 'Google Creator',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Google login failed' };
      }
      setUser(data.user);
      setStatus('authenticated');
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Google OAuth error' };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  const demoLogin = async () => {
    await signIn('creator@quranmedia.studio', 'demo123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        demoLogin,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
