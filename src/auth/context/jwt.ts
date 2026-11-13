// ----------------------------------------------------------------------
// Compatibility shim — legacy Django JWT auth replaced by Neon Managed Better Auth.
// Zustand stores import JWT_STORAGE_KEY for token persistence; Neon uses
// httpOnly cookies so this value is kept as a no-op compatibility export.
// ----------------------------------------------------------------------

export const JWT_STORAGE_KEY = 'pos_auth_token';
