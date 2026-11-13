import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const poster = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.post(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to post:', error);
    throw error;
  }
};

export const putter = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.put(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to put:', error);
    throw error;
  }
};

export const deleter = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.delete(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to delete:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    signOut: '/api/auth/sign-out',
  },
  product: {
    list: '/api/products',
    details: (id: string) => `/api/products/${id}`,
    search: '/api/products/search',
    create: '/api/products/create/',
    update: '/api/products/update',
    delete: '/api/products',
  },
  category: {
    list: '/api/categories',
    details: (id: string) => `/api/categories/${id}`,
    search: '/api/categories/search',
    create: '/api/categories/create/',
    update: '/api/categories/update',
    delete: '/api/categories',
  },
  customer: {
    list: '/api/customers',
    details: (id: string) => `/api/customers/${id}`,
    search: '/api/customers/search',
    create: '/api/customers/create/',
    update: '/api/customers/',
    delete: '/api/customers',
  },
  order: {
    list: '/api/orders',
    details: (id: string) => `/api/orders/${id}`,
    search: '/api/orders/search',
    create: '/api/orders/create/',
    update: '/api/orders/update',
    delete: '/api/orders',
  },
  invoice: {
    list: '/api/invoices',
    details: (id: string) => `/api/invoices/${id}`,
    search: '/api/invoices/search',
    create: '/api/invoices/create/',
    update: '/api/invoices/update',
    delete: '/api/invoices',
  },
  payment: {
    list: '/api/payments',
    details: (id: string) => `/api/payments/${id}`,
    create: '/api/payments/create/',
    delete: '/api/payments',
  },
  analytics: {
    overview: '/api/analytics/overview',
    sales: '/api/analytics/sales',
    products: '/api/analytics/products',
  },

  // Legacy Django endpoints (kept for backward compatibility)
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  mail: { list: '/api/mail/list', details: '/api/mail/details', labels: '/api/mail/labels' },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  leave: {
    list: '/api/leave',
    details: '/api/leave/',
    search: '/api/leave/search',
    create: '/api/leave/create/',
    update: '/api/leave/update',
    delete: '/api/leave',
    balances: {
      list: '/api/leave/balances',
      details: '/api/leave/balances/',
      create: '/api/leave/balances/create/',
      update: '/api/leave/balances/update',
      delete: '/api/leave/balances',
    }
  },
  package: {
    list: '/packages',
    details: '/packages/',
    search: '/packages/search',
    create: '/packages/create/',
    update: '/packages/update',
    delete: '/packages',
  },
  voucher: {
    root: '/voucher',
    list: '/voucher/list',
    details: '/voucher/details/',
    create: '/voucher/create/',
    update: '/voucher/update/',
    delete: '/voucher',
  },
  farmer: {
    list: '/api/v1/farmers/',
    details: '/api/v1/farmers/',
    create: '/api/v1/farmers/',
    update: '/api/v1/farmers/',
    status: '/api/v1/farmers/{id}/status/',
  },
  agent: {
    list: '/api/v1/agents/',
    details: '/api/v1/agents/',
    create: '/api/v1/agents/',
    update: '/api/v1/agents/',
    status: '/api/v1/agents/{id}/status/',
    me: '/api/v1/agents/me/',
    invite: '/api/v1/agents/invite/',
    invitations: '/api/v1/agents/invitations/',
    revoke_invitation: '/api/v1/agents/invitations/{id}/revoke/',
    resend_invitation: '/api/v1/agents/invitations/{id}/resend/',
  },
  organization: {
    counties: '/api/v1/counties/',
  },
  farm: {
    list: '/api/v1/farms/',
    details: '/api/v1/farms/',
    create: '/api/v1/farms/',
    update: '/api/v1/farms/',
    delete: '/api/v1/farms/',
  },
  job: {
    list: '/api/jobs',
    details: '/api/jobs/',
    create: '/api/jobs/create/',
    update: '/api/jobs/update',
    delete: '/api/jobs',
  },
  tour: {
    list: '/api/tours',
    details: '/api/tours/',
    create: '/api/tours/create/',
    update: '/api/tours/update',
    delete: '/api/tours',
  },
};
