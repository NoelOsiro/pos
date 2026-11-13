"use server";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { shops, shopMembers, users } from "@/schema/pos";

const BUSINESS_TYPES = [
  "liquor_store",
  "grocery_store",
  "mini_mart",
  "pharmacy",
  "clothing",
  "electronics",
  "restaurant",
  "other",
] as const;

type ShopDetails = {
  firstName: string;
  lastName: string;
  name: string;
  businessType: string;
  location: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
};

type OnboardingResult =
  { error: string } | { success: true; shopName: string; inviteCode?: string };

function normalized(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function inviteCodeHash(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

async function getCurrentUser() {
  const session = await auth.getSession();
  const user = session?.data?.user;

  if (!user?.id || !user.email) {
    throw new Error("You must be signed in to complete onboarding.");
  }

  const [profile] = await db
    .select({ id: users.id, onboardingComplete: users.onboardingComplete })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!profile) {
    await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        name: user.name ?? null,
      })
      .onConflictDoNothing();
  } else if (profile.onboardingComplete) {
    throw new Error("Your onboarding is already complete.");
  }

  const [verifiedProfile] = await db
    .select({ id: users.id, onboardingComplete: users.onboardingComplete })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!verifiedProfile) {
    throw new Error(
      "Your user profile is not ready yet. Please try again shortly.",
    );
  }
  if (verifiedProfile.onboardingComplete) {
    throw new Error("Your onboarding is already complete.");
  }

  return { id: user.id, name: user.name ?? "" };
}

export async function createShopAndCompleteOnboarding(
  input: ShopDetails,
): Promise<OnboardingResult> {
  if (!input || typeof input !== "object") {
    return { error: "Invalid shop details." };
  }

  const firstName = normalized(input.firstName);
  const lastName = normalized(input.lastName);
  const name = normalized(input.name);
  const location = normalized(input.location);
  const address = normalized(input.address);
  const contactEmail = normalized(input.contactEmail);
  const contactPhone = normalized(input.contactPhone);

  if (!firstName || !lastName || !name || !location || !address) {
    return { error: "Complete your name and all required shop details." };
  }
  if (firstName.length > 80 || lastName.length > 80 || name.length > 160) {
    return {
      error:
        "Names must be 80 characters or fewer; shop names must be 160 or fewer.",
    };
  }
  if (
    location.length > 120 ||
    address.length > 300 ||
    contactPhone.length > 40
  ) {
    return { error: "Location, address, or phone number is too long." };
  }
  if (contactEmail.length > 254) {
    return { error: "Contact email is too long." };
  }

  if (
    typeof input.businessType !== "string" ||
    !(BUSINESS_TYPES as readonly string[]).includes(input.businessType)
  ) {
    return { error: "Select a valid business type." };
  }

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Enter a valid contact email address." };
  }

  try {
    const user = await getCurrentUser();
    const shopId = randomUUID();
    const inviteCode = randomBytes(16).toString("hex").toUpperCase();
    const now = new Date();

    await db.batch([
      db.insert(shops).values({
        id: shopId,
        name,
        location,
        address,
        businessType: input.businessType,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        inviteCodeHash: inviteCodeHash(inviteCode),
        createdBy: user.id,
        createdAt: now,
        updatedAt: now,
      }),
      db.insert(shopMembers).values({
        id: randomUUID(),
        shopId,
        userId: user.id,
        role: "admin",
        createdAt: now,
      }),
      db
        .update(users)
        .set({
          name: `${firstName} ${lastName}`,
          role: "admin",
          onboardingComplete: true,
          updatedAt: now,
        })
        .where(eq(users.id, user.id)),
    ]);

    return { success: true, shopName: name, inviteCode };
  } catch (error) {
    console.error("Failed to create shop during onboarding:", error);
    return { error: "Unable to create your shop. Please try again." };
  }
}

export async function joinShopAndCompleteOnboarding(input: {
  firstName: string;
  lastName: string;
  inviteCode: string;
}): Promise<OnboardingResult> {
  if (!input || typeof input !== "object") {
    return { error: "Enter your name and a valid shop invite code." };
  }

  const firstName = normalized(input.firstName);
  const lastName = normalized(input.lastName);
  const inviteCode = normalized(input.inviteCode)
    .replace(/[\s-]/g, "")
    .toUpperCase();

  if (
    !firstName ||
    !lastName ||
    firstName.length > 80 ||
    lastName.length > 80 ||
    !/^[A-F0-9]{32}$/.test(inviteCode)
  ) {
    return {
      error: "Enter your name and a valid 32-character shop invite code.",
    };
  }

  try {
    const user = await getCurrentUser();
    const [shop] = await db
      .select({ id: shops.id, name: shops.name })
      .from(shops)
      .where(eq(shops.inviteCodeHash, inviteCodeHash(inviteCode)))
      .limit(1);

    if (!shop) {
      return {
        error: "That invite code was not found. Check the code and try again.",
      };
    }

    const now = new Date();

    await db.batch([
      db
        .insert(shopMembers)
        .values({
          id: randomUUID(),
          shopId: shop.id,
          userId: user.id,
          role: "cashier",
          createdAt: now,
        })
        .onConflictDoNothing(),
      db
        .update(users)
        .set({
          name: `${firstName} ${lastName}`,
          role: "cashier",
          onboardingComplete: true,
          updatedAt: now,
        })
        .where(eq(users.id, user.id)),
    ]);

    return { success: true, shopName: shop.name };
  } catch (error) {
    console.error("Failed to join shop during onboarding:", error);
    return { error: "Unable to join the shop. Please try again." };
  }
}
