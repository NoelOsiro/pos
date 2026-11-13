import type { UserRole } from './types';

// ----------------------------------------------------------------------
// Client-side mirror of `accounts.permissions.PERMISSION_MATRIX`.
// The backend re-checks every permission on each request, so this only drives UI.
// ----------------------------------------------------------------------

const PERMISSION_MATRIX: Record<UserRole, string[]> = {
  superadmin: ['*'],
  coopadmin: [
    'cooperative.manage',
    'cooperative.view',
    'farmer.*',
    'farm.*',
    'collection.*',
    'transaction.*',
    'loan.*',
    'cashflow.*',
    'agent.manage',
    'member.manage',
  ],
  agent: [
    'farmer.view',
    'farmer.create',
    'farmer.update',
    'farm.view',
    'farm.create',
    'collection.*',
    'transaction.view',
  ],
  farmer: ['farm.view_own', 'collection.view_own', 'transaction.view_own'],
  county_admin: [
    'cooperative.view',
    'collection.view',
    'transaction.view',
    'farmer.view',
    'report.view',
  ],
  capital_provider: ['portfolio.view', 'loan.view', 'repayment.view', 'report.view'],
  api_client: [
    'cooperative.view',
    'farmer.*',
    'farm.*',
    'collection.*',
    'transaction.*',
    'cashflow.*',
    'report.*',
  ],
};

// ----------------------------------------------------------------------

export function getPermissions(role: UserRole | null | undefined): string[] {
  if (!role) {
    return [];
  }

  return PERMISSION_MATRIX[role] ?? [];
}

export function hasPermission(role: UserRole | null | undefined, permission: string): boolean {
  const permissions = getPermissions(role);

  if (!permission) {
    return false;
  }

  return permissions.some((granted) => {
    if (granted === '*' || granted === permission) {
      return true;
    }

    if (granted.endsWith('.*')) {
      return permission.startsWith(granted.slice(0, -1));
    }

    return false;
  });
}