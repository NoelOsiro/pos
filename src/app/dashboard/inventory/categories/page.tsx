import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import {
  canManageInventoryCategoriesAction,
  getInventoryCategoriesAction,
} from '@/app/dashboard/inventory/actions';
import { InventoryCategoriesView } from '@/sections/product/view';

export const metadata: Metadata = {
  title: `Product categories | Dashboard - ${CONFIG.appName}`,
};

export default async function Page() {
  const [categories, canManage] = await Promise.all([
    getInventoryCategoriesAction(),
    canManageInventoryCategoriesAction(),
  ]);

  return <InventoryCategoriesView categories={categories} canManage={canManage} />;
}
