import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { _customerList } from '@/_mock/_customerList';

import { CustomerEditView } from '@/sections/customer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Customer edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentCustomer = _customerList.find((customer) => customer.id === id);

  return <CustomerEditView customer={currentCustomer} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
export const dynamic = 'force-dynamic';

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _customerList.map((customer) => ({ id: customer.id }));
  }
  return [];
}
