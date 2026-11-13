import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type ICustomerItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  role?: string;
  username?: string;
  service_type?: string;
  company?: string;
  totalSpent: number;
  totalOrders: number;
  totalFollowers?: number;
  totalFollowing?: number;
  lastOrderDate?: IDateValue;
  isActive?: boolean;
  isVerified?: boolean;
  avatarUrl?: string;
  coverUrl?: string;
  createdAt?: IDateValue;
  updatedAt?: IDateValue;
};

export type ICustomerFilters = {
  name: string;
  status: string;
  city: string;
  role?: string[];
};

export type ICustomerTableFilters = {
  name?: string;
  role?: string[];
  status?: string;
};
