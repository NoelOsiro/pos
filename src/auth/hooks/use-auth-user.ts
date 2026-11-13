'use client';

import { useMemo } from 'react';

import { getPermissions } from '../permissions';

import { useAuthContext } from './use-auth-context';

import type { AuthContextValue } from '../types';

// ----------------------------------------------------------------------

export type AuthUserView = NonNullable<AuthContextValue['user']> & {
  displayName: string;
  photoURL: string;
  username: string;
};

/** `useAuthContext` + display fields derived from the Neon user payload. */
export function useAuthUser() {
  const { user, role, hasPermission } = useAuthContext();

  return useMemo(() => {
    const displayName =
      user === null
        ? ''
        : user.name ?? user.email;

    return {
      user:
        user === null
          ? null
          : {
              ...user,
              displayName,
              photoURL: user.image ?? '',
              username: user.email,
            } satisfies AuthUserView,
      role,
      permissions: getPermissions(role),
      hasPermission,
    };
  }, [role, hasPermission, user]);
}
