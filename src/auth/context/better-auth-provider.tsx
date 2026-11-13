'use client';

import { useEffect, useMemo, useState } from 'react';

import { getSessionAction } from '@/app/auth/actions';
import { authClient } from '@/lib/auth/client';
import { AuthContext } from './auth-context';
import { hasPermission } from '../permissions';

import type { AuthContextValue, UserRole } from '../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function BetterAuthProvider({ children }: Props) {
  const [sessionValue, setSessionValue] = useState<{
    data: { user: any } | null;
    isPending: boolean;
  }>({ data: null, isPending: true });

  useEffect(() => {
    let mounted = true;

    getSessionAction()
      .then((result: any) => {
        if (!mounted) return;
        const data = result?.data ?? null;
        setSessionValue({ data, isPending: false });
      })
      .catch(() => {
        if (!mounted) return;
        setSessionValue({ data: null, isPending: false });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const data = sessionValue?.data;
  const user = data?.user ?? null;
  const authenticated = !!data;
  const unauthenticated = !data && !sessionValue.isPending;
  const role = (user?.role as UserRole | null) ?? null;

  const signIn = async (params: { email: string; password: string }) => {
    const result = await (authClient as any).signIn.email({
      email: params.email,
      password: params.password,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Failed to sign in');
    }

    if (!result.data?.user) {
      throw new Error('Sign in succeeded, but no user session was returned');
    }

    setSessionValue({ data: result.data, isPending: false });
  };

  const signUp = async (params: {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
  }) => {
    await (authClient as any).signUp.email({
      email: params.email,
      password: params.password,
      name: `${params.firstName} ${params.lastName}`,
    });
    setSessionValue({ data: null, isPending: false });
  };

  const signOut = async () => {
    await (authClient as any).signOut();
    setSessionValue({ data: null, isPending: false });
  };

  const memoizedValue = useMemo(
    () => ({
      user,
      loading: sessionValue.isPending,
      authenticated,
      unauthenticated,
      role,
      signIn,
      signUp,
      signOut,
      hasPermission: (permission: string) => hasPermission(role, permission),
      checkUserSession: undefined,
    }),
    [user, sessionValue.isPending, authenticated, unauthenticated, role, signIn, signUp, signOut]
  ) as AuthContextValue;

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
