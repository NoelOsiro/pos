"use client";

import { useEffect } from "react";

import { paths } from "@/routes/paths";
import { useSearchParams } from "@/routes/hooks";

import { CONFIG } from "@/global-config";

import { SplashScreen } from "@/components/loading-screen";

import { useAuthContext } from "../hooks";

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const { loading, authenticated, onboardingComplete } = useAuthContext();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || CONFIG.auth.redirectPath;

  useEffect(() => {
    if (!loading && authenticated) {
      // Use a full navigation so the auth guards re-read the session.
      window.location.href =
        onboardingComplete === true ? returnTo : paths.onboarding;
    }
  }, [authenticated, loading, onboardingComplete, returnTo]);

  if (loading || authenticated) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
