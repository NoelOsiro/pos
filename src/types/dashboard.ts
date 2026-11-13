import type { UserRole } from "@/auth/types";

export type PosDashboardData = {
  snapshotId: string;
  fetchedAt: string;
  shopName: string;
  userName: string;
  role: UserRole;
  summary: {
    grossSales: number;
    completedOrders: number;
    itemsSold: number;
    yearRevenue: number;
    yearOrders: number;
    yearItemsSold: number;
    todayRevenue: number;
    todayOrders: number;
    stockUnits: number;
    productCount: number;
    activeProducts: number;
    lowStockProducts: number;
    retailValue: number;
  };
  monthly: {
    revenue: number[];
    orders: number[];
    itemsSold: number[];
  };
  categorySales: { label: string; value: number }[];
  sellers: {
    id: string;
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
    orders: number;
    sales: number;
    rank: string;
  }[];
  latestProducts: {
    id: string;
    name: string;
    coverUrl: string;
    price: number;
  }[];
};
