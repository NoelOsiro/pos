import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { ProductCreateView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateView />;
}
