import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import axios, { endpoints } from '@/lib/axios';

import { ProductEditView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { product } = await getProduct(id);

  return <ProductEditView leave={product} />;
}

// ----------------------------------------------------------------------

async function getProduct(id: string) {
  const URL = id ? `${endpoints.leave.details}/${id}` : '';

  const res = await axios.get(URL);

  return res.data;
}

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
    const res = await axios.get(endpoints.leave.list);

    return res.data.products.map((product: { id: string }) => ({ id: product.id }));
  }
  return [];
}
