import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import {
  canManageInventoryProductsAction,
  getInventoryProductsAction,
} from '@/app/dashboard/inventory/actions';
import { InventoryListView } from '@/sections/product/view';

export const metadata: Metadata = {
  title: `Inventory | Dashboard - ${CONFIG.appName}`,
};

export default async function Page() {
  const [products, canManage] = await Promise.all([
    getInventoryProductsAction(),
    canManageInventoryProductsAction(),
  ]);

  return <InventoryListView products={products} canManage={canManage} />;
}
