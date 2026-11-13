import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { CONFIG } from '@/global-config';

import {
  canManageInventoryProductsAction,
  getInventoryCategoriesAction,
} from '@/app/dashboard/inventory/actions';
import { InventoryProductFormView } from '@/sections/product/view';
import { paths } from '@/routes/paths';

export const metadata: Metadata = {
  title: `Add product | Dashboard - ${CONFIG.appName}`,
};

export default async function Page() {
  const [categories, canManage] = await Promise.all([
    getInventoryCategoriesAction(),
    canManageInventoryProductsAction(),
  ]);
  if (!canManage) redirect(paths.dashboard.inventory.list);

  return <InventoryProductFormView categories={categories} />;
}
