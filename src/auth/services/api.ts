import axios from 'axios';

// ----------------------------------------------------------------------
// Compatibility shim — legacy Django auth service replaced by Neon Managed Better Auth.
// These stubs keep existing non-POS sections compiling. They are not used by POS flows.
// ----------------------------------------------------------------------

const api = axios.create();

export const authEndpoints = {
  csrf: '/api/auth/csrf/',
  login: '/api/auth/login/',
  logout: '/api/auth/logout/',
  me: '/api/auth/me/',
};

export const cooperativeEndpoints = {
  list: '/api/v1/cooperatives/',
  details: (id: string) => `/api/v1/cooperatives/${id}/`,
  members: '/api/v1/cooperatives/members/',
};

export default api;
