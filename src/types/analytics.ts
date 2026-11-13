import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IAnalyticsOverview = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
};

export type IAnalyticsSalesPoint = {
  date: string;
  sales: number;
  orders: number;
};

export type IAnalyticsProduct = {
  id: string;
  name: string;
  sales: number;
  revenue: number;
};
