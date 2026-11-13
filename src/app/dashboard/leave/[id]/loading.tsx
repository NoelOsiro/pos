'use client';

import { DashboardContent } from '@/layouts/dashboard';

import { ProductDetailsSkeleton } from '@/sections/product/product-skeleton';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <DashboardContent sx={{ pt: 5 }}>
      <ProductDetailsSkeleton />
    </DashboardContent>
  );
}
