export type UserRole = "admin" | "manager" | "cashier" | "viewer";

export type StoredTokens = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
};

export type AuthContextValue = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: UserRole | null;
  } | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  onboardingComplete: boolean | null;
  refreshSession: () => Promise<void>;
  role: UserRole | null;
  signIn: (params: {
    email: string;
    password: string;
    returnTo?: string | null;
  }) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
};
