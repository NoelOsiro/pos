"use client";

import { useEffect } from "react";

import { paths } from "@/routes/paths";
import { useRouter, usePathname } from "@/routes/hooks";

import { SplashScreen } from "@/components/loading-screen";

import { useAuthContext } from "../hooks";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated, loading, onboardingComplete } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      const queryString = new URLSearchParams({
        returnTo: pathname,
      }).toString();
      router.replace(`${paths.auth.signIn}?${queryString}`);
    } else if (onboardingComplete !== true) {
      router.replace(paths.onboarding);
    }
  }, [authenticated, loading, onboardingComplete, pathname, router]);

  if (loading || !authenticated || onboardingComplete !== true) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
