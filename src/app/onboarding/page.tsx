import type { Metadata } from "next";

import { CONFIG } from "@/global-config";
import { OnboardingView } from "@/sections/onboarding/view/onboarding-view";

export const metadata: Metadata = { title: `Get started - ${CONFIG.appName}` };

export default function OnboardingPage() {
  return <OnboardingView />;
}
