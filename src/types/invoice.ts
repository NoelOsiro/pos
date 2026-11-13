import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IInvoiceItem = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type IInvoice = {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  dueDate: IDateValue;
  paidDate?: IDateValue;
  items: IInvoiceItem[];
  createdAt: IDateValue;
};

export type IInvoiceFilters = {
  name: string;
  status: string;
  customer: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IInvoiceTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};
