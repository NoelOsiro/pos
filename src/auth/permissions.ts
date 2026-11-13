import type { UserRole } from "./types";

const ROLE_PERMISSIONS: Record<UserRole, readonly string[]> = {
  admin: ["*"],
  manager: ["inventory:read", "inventory:write", "sales:read", "sales:write", "reports:read"],
  cashier: ["inventory:read", "sales:read", "sales:create"],
  viewer: ["inventory:read", "sales:read", "reports:read"],
};

export function getPermissions(role: UserRole | null): readonly string[] {
  return role ? ROLE_PERMISSIONS[role] : [];
}

export function hasPermission(role: UserRole | null, permission: string): boolean {
  const permissions = getPermissions(role);
  return permissions.includes("*") || permissions.includes(permission);
}
