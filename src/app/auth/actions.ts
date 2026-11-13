"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { users } from "@/schema/pos";

export async function getSessionAction() {
  const session = await auth.getSession();
  const userId = session?.data?.user?.id;

  if (!userId) {
    return { ...session, onboardingComplete: null, role: null };
  }

  const [profile] = await db
    .select({ onboardingComplete: users.onboardingComplete, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    ...session,
    onboardingComplete: profile?.onboardingComplete ?? false,
    role: profile?.role ?? null,
  };
}
