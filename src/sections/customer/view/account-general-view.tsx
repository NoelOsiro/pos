'use client';

import { useCustomerStore } from '@/store/customerStore';

import { AccountGeneral } from './account-general';


// ----------------------------------------------------------------------

export function AccountGeneralView({ id }: { id: string }) {
  const customer = useCustomerStore((state) => state.customers.find((c) => c.id === id));
  return <AccountGeneral customer={customer} />;
}
