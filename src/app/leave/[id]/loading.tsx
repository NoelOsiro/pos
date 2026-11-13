'use client';

import Container from '@mui/material/Container';

import { ProductDetailsSkeleton } from '@/sections/product/product-skeleton';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <ProductDetailsSkeleton />
    </Container>
  );
}
