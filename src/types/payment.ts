import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IPayment = {
  id: string;
  orderId?: string;
  invoiceId?: string;
  amount: number;
  method: string;
  status: string;
  transactionRef?: string;
  createdAt: IDateValue;
};

export type IPaymentFilters = {
  name: string;
  method: string;
  status: string;
  endDate: IDateValue;
  startDate: IDateValue;
};

export type IPaymentTableFilters = {
  method: string[];
  status: string[];
};
