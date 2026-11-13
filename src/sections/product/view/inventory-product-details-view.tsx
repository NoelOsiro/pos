'use client';

import type { IProductItem } from '@/types/product';

import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  product: IProductItem;
  canManage: boolean;
};

function formatPrice(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InventoryProductDetailsView({ product, canManage }: Props) {
  const lowStock = product.stockQuantity <= product.minStock;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={product.name}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Inventory', href: paths.dashboard.inventory.list },
          { name: product.name },
        ]}
        action={canManage ? (
          <Button
            component={RouterLink}
            href={paths.dashboard.inventory.edit(product.id)}
            variant="contained"
          >
            Edit product
          </Button>
        ) : undefined}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {product.coverUrl && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              component="img"
              src={product.coverUrl}
              alt={product.name}
              sx={{ width: 1, height: 360, objectFit: 'cover' }}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: product.coverUrl ? 7 : 12 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={!product.isActive ? 'Inactive' : lowStock ? 'Low stock' : 'Active'}
                  color={!product.isActive ? 'default' : lowStock ? 'warning' : 'success'}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
                  gap: 3,
                }}
              >
                <Detail label="Selling price" value={formatPrice(product.price)} />
                <Detail
                  label="Cost price"
                  value={product.costPrice === undefined ? '—' : formatPrice(product.costPrice)}
                />
                <Detail label="Category" value={product.category || 'Uncategorized'} />
                <Detail label="In stock" value={String(product.stockQuantity)} />
                <Detail label="Low stock threshold" value={String(product.minStock)} />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {product.description || 'No description provided.'}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Box>
  );
}
