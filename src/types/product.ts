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
  description?: string;
  isActive?: boolean;
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

export type ProductCsvRow = Omit<ProductFormValues, 'categoryId'> & {
  category: string;
};
