import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { _vouchers } from '@/_mock/_vouchers';

import { VoucherEditView } from '@/sections/voucher/view/voucher-edit-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Voucher edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentVoucher = _vouchers.find((voucher) => voucher.id === id);

  return <VoucherEditView voucher={currentVoucher} />;
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
    return _vouchers.map((voucher) => ({ id: voucher.id }));
  }
  return [];
}
