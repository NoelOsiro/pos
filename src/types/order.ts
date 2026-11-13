import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IOrderProductItem = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type IOrderItem = {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customer?: any;
  userId?: string;
  userName?: string;
  status: string;
  subtotal: number;
  taxes?: number;
  tax?: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  totalQuantity?: number;
  createdAt: IDateValue;
  history?: any;
  items: IOrderProductItem[];
  payment?: any;
  delivery?: any;
  shippingAddress?: any;
};

export type IOrderFilters = {
  name: string;
  status: string;
  customer: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IOrderTableFilters = {
  name?: string;
  status?: string;
  endDate?: IDatePickerControl;
  startDate?: IDatePickerControl;
};
