import { eq } from "drizzle-orm";

import type { UserRole } from "@/auth/types";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { shopMembers, users } from "@/schema/pos";

export async function getDashboardContext(): Promise<{
  userId: string;
  role: UserRole;
  shopId: string;
} | null> {
  const session = await auth.getSession();
  const userId = session?.data?.user?.id;

  if (!userId) return null;

  const [[profile], memberships] = await Promise.all([
    db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1),
    db
      .select({ shopId: shopMembers.shopId })
      .from(shopMembers)
      .where(eq(shopMembers.userId, userId))
      .limit(2),
  ]);

  const role = profile?.role;
  if (
    role !== "admin" &&
    role !== "manager" &&
    role !== "cashier" &&
    role !== "viewer"
  ) {
    return null;
  }
  if (memberships.length === 0) {
    throw new Error("Your account is not associated with a shop.");
  }
  if (memberships.length > 1) {
    throw new Error("Your account has multiple shops. Select a shop to continue.");
  }

  return { userId, role, shopId: memberships[0].shopId };
}
