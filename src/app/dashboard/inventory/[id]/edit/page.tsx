import type { Metadata } from 'next';

import { notFound, redirect } from 'next/navigation';

import { CONFIG } from '@/global-config';
import {
  canManageInventoryProductsAction,
  getInventoryCategoriesAction,
  getInventoryProductAction,
} from '@/app/dashboard/inventory/actions';
import { InventoryProductFormView } from '@/sections/product/view';
import { paths } from '@/routes/paths';

export const metadata: Metadata = {
  title: `Edit product | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [product, categories, canManage] = await Promise.all([
    getInventoryProductAction(id),
    getInventoryCategoriesAction(),
    canManageInventoryProductsAction(),
  ]);

  if (!product) notFound();
  if (!canManage) redirect(paths.dashboard.inventory.list);

  return <InventoryProductFormView categories={categories} product={product} />;
}
