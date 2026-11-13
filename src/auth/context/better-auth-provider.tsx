"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getSessionAction } from "@/app/auth/actions";
import { authClient } from "@/lib/auth/client";
import { AuthContext } from "./auth-context";
import { hasPermission } from "../permissions";

import type { AuthContextValue, UserRole } from "../types";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const USER_ROLES: readonly UserRole[] = [
  "admin",
  "manager",
  "cashier",
  "viewer",
];

function parseUserRole(value: unknown): UserRole | null {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : null;
}

export function BetterAuthProvider({ children }: Props) {
  const [sessionValue, setSessionValue] = useState<{
    data: { user: AuthContextValue["user"] } | null;
    onboardingComplete: boolean | null;
    role: UserRole | null;
    isPending: boolean;
  }>({ data: null, onboardingComplete: null, role: null, isPending: true });

  useEffect(() => {
    let mounted = true;

    getSessionAction()
      .then((result) => {
        if (!mounted) return;
        const data = result?.data ?? null;
        setSessionValue({
          data,
          onboardingComplete: result?.onboardingComplete ?? null,
          role: parseUserRole(result?.role),
          isPending: false,
        });
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        console.error("Failed to load the current auth session:", error);
        setSessionValue({
          data: null,
          onboardingComplete: null,
          role: null,
          isPending: false,
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const data = sessionValue?.data;
  const user = useMemo(
    () => (data?.user ? { ...data.user, role: sessionValue.role } : null),
    [data, sessionValue.role],
  );
  const onboardingComplete = sessionValue.onboardingComplete;
  const authenticated = !!data;
  const unauthenticated = !data && !sessionValue.isPending;
  const role = sessionValue.role;

  const refreshSession = useCallback(async () => {
    const result = await getSessionAction();

    if (!result?.data?.user) {
      throw new Error("Unable to load the current user session");
    }

    setSessionValue({
      data: result.data,
      onboardingComplete: result.onboardingComplete ?? null,
      role: parseUserRole(result.role),
      isPending: false,
    });
  }, []);

  const signIn = useCallback(
    async (params: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        email: params.email,
        password: params.password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to sign in");
      }

      if (!result.data?.user) {
        throw new Error("Sign in succeeded, but no user session was returned");
      }

      await refreshSession();
    },
    [refreshSession],
  );

  const signUp = useCallback(
    async (params: {
      email: string;
      password: string;
      passwordConfirm: string;
      firstName: string;
      lastName: string;
    }) => {
      await authClient.signUp.email({
        email: params.email,
        password: params.password,
        name: `${params.firstName} ${params.lastName}`,
      });
      setSessionValue({
        data: null,
        onboardingComplete: null,
        role: null,
        isPending: false,
      });
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setSessionValue({
      data: null,
      onboardingComplete: null,
      role: null,
      isPending: false,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user,
      loading: sessionValue.isPending,
      authenticated,
      unauthenticated,
      onboardingComplete,
      refreshSession,
      role,
      signIn,
      signUp,
      signOut,
      hasPermission: (permission: string) => hasPermission(role, permission),
    }),
    [
      user,
      sessionValue.isPending,
      authenticated,
      unauthenticated,
      onboardingComplete,
      refreshSession,
      role,
      signIn,
      signUp,
      signOut,
    ],
  ) as AuthContextValue;

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
