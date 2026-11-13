import { fSub, fAdd } from '@/utils/format-time';

import { _mock } from './_mock';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'draft', label: 'Draft' },
];

const makeItems = (index: number) =>
  Array.from({ length: 3 }, (_, itemIndex) => {
    const quantity = _mock.number.nativeS(index + itemIndex);
    const unitPrice = _mock.number.price(index + itemIndex);

    return {
      id: _mock.id(index * 3 + itemIndex),
      productId: _mock.id(index * 3 + itemIndex + 50),
      sku: `SKU-${index + 1}-${itemIndex + 1}`,
      name: _mock.productName(index + itemIndex),
      quantity,
      unitPrice,
      lineTotal: quantity * unitPrice,
    };
  });

export const _invoices = Array.from({ length: 20 }, (_, index) => {
  const items = makeItems(index);
  const tax = _mock.number.price(index + 1);
  const discount = _mock.number.price(index + 2);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const totalAmount = subtotal + tax - discount;
  const status =
    (index % 2 && 'paid') || (index % 3 && 'pending') || (index % 4 && 'overdue') || 'draft';

  return {
    id: _mock.id(index),
    invoiceNumber: `INV-199${index}`,
    orderId: _mock.id(index + 100),
    customerId: _mock.id(index + 200),
    customerName: _mock.fullName(index),
    status,
    subtotal,
    tax,
    discount,
    totalAmount,
    dueDate: fAdd({ days: index + 15, hours: index }),
    paidDate: status === 'paid' ? fSub({ days: index }) : undefined,
    createdAt: fSub({ days: index }),
    items,
  };
});
