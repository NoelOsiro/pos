import type { StoredTokens } from '../types';

// ----------------------------------------------------------------------
// Tokens live in `sessionStorage` (cleared when the tab closes).
// PKCE material never outlives the tab either.
// ----------------------------------------------------------------------

export const ACCESS_TOKEN_KEY = 'mavunoflow.access_token';
export const REFRESH_TOKEN_KEY = 'mavunoflow.refresh_token';
export const TOKEN_EXPIRES_AT_KEY = 'mavunoflow.access_token_expires_at';
export const OAUTH_STATE_KEY = 'mavunoflow.oauth.state';
export const OAUTH_VERIFIER_KEY = 'mavunoflow.oauth.code_verifier';
export const OAUTH_RETURN_TO_KEY = 'mavunoflow.oauth.return_to';
export const OAUTH_COOPERATIVE_KEY = 'mavunoflow.oauth.cooperative_id';

/** Refresh a little before the token actually dies. */
export const TOKEN_EXPIRY_SKEW_SECONDS = 30;

// ----------------------------------------------------------------------

function storage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function read(key: string): string | null {
  try {
    return storage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    storage()?.setItem(key, value);
  } catch {
    /* storage unavailable — the session simply stays in memory */
  }
}

function remove(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    /* noop */
  }
}

// ----------------------------------------------------------------------

export function getStoredTokens(): StoredTokens | null {
  const accessToken = read(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  const expiresAt = read(TOKEN_EXPIRES_AT_KEY);

  return {
    accessToken,
    refreshToken: read(REFRESH_TOKEN_KEY),
    expiresAt: expiresAt ? Number(expiresAt) : null,
  };
}

export function storeTokens(tokens: {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number;
}): void {
  write(ACCESS_TOKEN_KEY, tokens.accessToken);

  if (tokens.refreshToken) {
    // `ROTATE_REFRESH_TOKEN` is on server-side: always keep the newest one.
    write(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  const expiresIn = tokens.expiresIn;

  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn)) {
    write(TOKEN_EXPIRES_AT_KEY, String(Math.floor(Date.now() / 1000) + expiresIn));
  } else {
    remove(TOKEN_EXPIRES_AT_KEY);
  }
}

export function clearTokens(): void {
  remove(ACCESS_TOKEN_KEY);
  remove(REFRESH_TOKEN_KEY);
  remove(TOKEN_EXPIRES_AT_KEY);
}

export function getAccessToken(): string | null {
  return read(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return read(REFRESH_TOKEN_KEY);
}

export function isAccessTokenExpired(skewSeconds = TOKEN_EXPIRY_SKEW_SECONDS): boolean {
  const expiresAt = read(TOKEN_EXPIRES_AT_KEY);

  if (!expiresAt) {
    return true;
  }

  return Number(expiresAt) - skewSeconds <= Date.now() / 1000;
}

// ----------------------------------------------------------------------
// PKCE transaction state
// ----------------------------------------------------------------------

export type PkceTransaction = {
  state: string;
  verifier: string;
};

export function storePkceTransaction(transaction: PkceTransaction): void {
  write(OAUTH_STATE_KEY, transaction.state);
  write(OAUTH_VERIFIER_KEY, transaction.verifier);
}

export function getPkceTransaction(): PkceTransaction | null {
  const state = read(OAUTH_STATE_KEY);
  const verifier = read(OAUTH_VERIFIER_KEY);

  if (!state || !verifier) {
    return null;
  }

  return { state, verifier };
}

export function clearPkceTransaction(): void {
  remove(OAUTH_STATE_KEY);
  remove(OAUTH_VERIFIER_KEY);
}

function isValidReturnTo(path: string): boolean {
  // Only allow relative paths starting with / but not //
  return path.startsWith('/') && !path.startsWith('//');
}

export function storeReturnTo(returnTo: string | null): void {
  if (returnTo && isValidReturnTo(returnTo)) {
    write(OAUTH_RETURN_TO_KEY, returnTo);
  } else {
    remove(OAUTH_RETURN_TO_KEY);
  }
}

export function consumeReturnTo(): string | null {
  const value = read(OAUTH_RETURN_TO_KEY);
  remove(OAUTH_RETURN_TO_KEY);

  if (value && isValidReturnTo(value)) {
    return value;
  }
  return null;
}

export function storeCooperativeHint(cooperativeId: string | null): void {
  if (cooperativeId) {
    write(OAUTH_COOPERATIVE_KEY, cooperativeId);
  } else {
    remove(OAUTH_COOPERATIVE_KEY);
  }
}

export function consumeCooperativeHint(): string | null {
  const value = read(OAUTH_COOPERATIVE_KEY);
  remove(OAUTH_COOPERATIVE_KEY);

  return value;
}