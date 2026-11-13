'use server';

import { auth } from '@/lib/auth/server';

export async function getSessionAction() {
  const session = await auth.getSession();

  return session;
}
