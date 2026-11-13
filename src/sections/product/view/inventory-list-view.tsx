'use client';

import type { IProductItem } from '@/types/product';

import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { Iconify } from '@/components/iconify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';

type Props = {
  products: IProductItem[];
  canManage: boolean;
};

function formatPrice(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InventoryListView({ products, canManage }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Inventory"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Products' },
        ]}
        action={canManage ? (
          <Button
            component={RouterLink}
            href={paths.dashboard.inventory.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add product
          </Button>
        ) : undefined}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const lowStock = product.stockQuantity <= product.minStock;

                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography
                        component={RouterLink}
                        href={paths.dashboard.inventory.details(product.id)}
                        variant="subtitle2"
                        color="inherit"
                        sx={{ textDecoration: 'none' }}
                      >
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category || 'Uncategorized'}</TableCell>
                    <TableCell align="right">{formatPrice(product.price)}</TableCell>
                    <TableCell align="right">
                      <Box component="span" sx={{ color: lowStock ? 'error.main' : 'text.primary' }}>
                        {product.stockQuantity}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={product.isActive ? (lowStock ? 'Low stock' : 'Active') : 'Inactive'}
                        color={!product.isActive ? 'default' : lowStock ? 'warning' : 'success'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={RouterLink}
                        href={paths.dashboard.inventory.edit(product.id)}
                        size="small"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!products.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="subtitle1">No products yet</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Add your first product to start tracking inventory.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
}
