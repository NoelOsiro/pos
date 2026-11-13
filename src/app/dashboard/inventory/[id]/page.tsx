import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { CONFIG } from '@/global-config';
import {
  canManageInventoryProductsAction,
  getInventoryProductAction,
} from '@/app/dashboard/inventory/actions';
import { InventoryProductDetailsView } from '@/sections/product/view';

export const metadata: Metadata = {
  title: `Product details | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [product, canManage] = await Promise.all([
    getInventoryProductAction(id),
    canManageInventoryProductsAction(),
  ]);

  if (!product) notFound();

  return <InventoryProductDetailsView product={product} canManage={canManage} />;
}
