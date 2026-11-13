import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type ICategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  createdAt?: IDateValue;
};

export type ICategoryFilters = {
  name: string;
  status: string;
};

// ----------------------------------------------------------------------

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  categoryId?: string;
  category?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  minStock: number;
  coverUrl?: string;
  images?: string[];
  description?: string;
  isActive?: boolean;
  available?: boolean;
  gender?: string[];
  colors?: string[];
  totalRatings?: number;
  totalReviews?: number;
  ratings?: { name: string; starCount: number; reviewCount: number }[];
  reviews?: any[];
  createdAt?: IDateValue;
  updatedAt?: IDateValue;
};

export type ProductFormValues = {
  name: string;
  sku: string;
  categoryId: string;
  price: string;
  costPrice: string;
  stockQuantity: number;
  minStock: number;
  coverUrl: string;
  description: string;
  isActive: boolean;
};

export type IProductFilters = {
  name: string;
  category: string;
  status: string;
  priceRange: number[];
  stockStatus: string;
  rating?: string;
  gender?: string[];
  colors?: string[];
};

export type IProductTableFilters = {
  stock: string[];
  category: string[];
};
