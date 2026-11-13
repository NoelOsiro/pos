import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { getProducts } from '@/actions/product-ssr';

import { ProductShopView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Leave Management - ${CONFIG.appName}` };

export default async function Page() {
  const { products } = await getProducts();

  return <ProductShopView products={products} />;
}
