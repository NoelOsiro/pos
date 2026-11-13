// ----------------------------------------------------------------------
// Roles — mirror of `organizations.RoleChoices` (backend)
// ----------------------------------------------------------------------



/** `superadmin` comes from `User.is_superuser`, `api_client` from client-credentials tokens. */

export type UserRole = 'admin' | 'manager' | 'cashier' | 'viewer';




export type UserProfile = {
  phone: string;
  avatar_url: string;
  preferences: Record<string, unknown>;
  preferred_cooperative: number | null;
};

/** `GET /api/v1/auth/me/` */
export type MeResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  profile: UserProfile;
};

/** The user exposed by the auth context: backend user + token context. */
export type AuthUser = MeResponse & {
  accessToken: string;
  role: UserRole | null;
  countyIds: string[];
};

export type UserType = AuthUser | null;

// ----------------------------------------------------------------------
// Session / PKCE
// ----------------------------------------------------------------------

export type StoredTokens = {
  accessToken: string;
  refreshToken: string | null;
  /** `exp` claim, in seconds. */
  expiresAt: number | null;
};

export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

export type JwtClaims = {
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  scope: string;
  role: UserRole;
  coop_id: string;
  county_ids?: string[];
  client_id?: string;
};

// ----------------------------------------------------------------------
// Login flow steps (POST /api/v1/auth/login/)
// ----------------------------------------------------------------------

export type LoginAction = 'authorize' | 'mfa_enroll' | 'mfa_verify' | 'select_cooperative';

export type LoginResult =
  | { action: 'authorize' }
  | { action: 'mfa_enroll' }
  | { action: 'mfa_verify' }
export type SignUpParams = {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
};

// ----------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  role: UserRole | null;
  signIn: (params: {
    email: string;
    password: string;
    returnTo?: string | null;
  }) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  checkUserSession?: () => Promise<void>;
};