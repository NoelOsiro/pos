import { paths } from '@/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  assetsDir: string;
  isStaticExport: boolean;
  auth: {
    method: 'better-auth';
    skip: boolean;
    redirectPath: string;
  };
  oauth: {
    clientId: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revokeEndpoint: string;
    redirectUri: string;
    scopes: string[];
  };
  mapboxApiKey: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'POS',
  appVersion: packageJson.version,
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT ?? 'false'}`),
  /**
   * Auth
   * @method better-auth
   */
  auth: {
    method: 'better-auth',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * OAuth (Better Auth social providers)
   * Endpoints are handled by Better Auth API routes at /api/auth
   */
  oauth: {
    clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID ?? '',
    authorizationEndpoint: '/api/auth/social/google',
    tokenEndpoint: '/api/auth/social/google/callback',
    revokeEndpoint: '/api/auth/sign-out',
    redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI ?? '',
    scopes: (
      process.env.NEXT_PUBLIC_OAUTH_SCOPES ??
      'email profile'
    )
      .split(' ')
      .filter(Boolean),
  },
  /**
   * Mapbox
   */
  mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '',
};
