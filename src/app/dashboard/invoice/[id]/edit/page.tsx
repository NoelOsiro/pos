import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { _invoices } from '@/_mock/_invoice';

import { InvoiceEditView } from '@/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Invoice edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return <InvoiceEditView invoice={currentInvoice} />;
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
    return _invoices.map((invoice) => ({ id: invoice.id }));
  }
  return [];
}
