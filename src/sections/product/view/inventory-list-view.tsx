'use client';

import type { IProductItem } from '@/types/product';

import { useState } from 'react';

import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { Iconify } from '@/components/iconify';
import { InventoryCsvImport } from './inventory-csv-import';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

type Props = {
  products: IProductItem[];
  canManage: boolean;
};

function formatPrice(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InventoryListView({ products, canManage }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryOptions = [...new Set(products.map((product) => product.category || 'Uncategorized'))]
    .sort((a, b) => a.localeCompare(b));
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      (product.category || 'Uncategorized').toLowerCase().includes(query);
    const matchesCategory =
      !categoryFilter || (product.category || 'Uncategorized') === categoryFilter;
    const lowStock = product.stockQuantity <= product.minStock;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive) ||
      (statusFilter === 'low-stock' && product.isActive && lowStock) ||
      (statusFilter === 'out-of-stock' && product.isActive && product.stockQuantity === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lastPage = Math.max(0, Math.ceil(filteredProducts.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);

  const paginatedProducts = filteredProducts.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage,
  );

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

      {canManage && <InventoryCsvImport />}

      <Card>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ p: { xs: 2, md: 2.5 } }}
        >
          <TextField
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search products..."
            aria-label="Search products"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(0);
            }}
            sx={{ minWidth: { sm: 180 } }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categoryOptions.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(0);
            }}
            sx={{ minWidth: { sm: 180 } }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="low-stock">Low stock</MenuItem>
            <MenuItem value="out-of-stock">Out of stock</MenuItem>
          </TextField>
        </Stack>
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
              {paginatedProducts.map((product) => {
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
                      {canManage ? (
                        <Button
                          component={RouterLink}
                          href={paths.dashboard.inventory.edit(product.id)}
                          size="small"
                        >
                          Edit
                        </Button>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!filteredProducts.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="subtitle1">
                      {products.length ? 'No matching products' : 'No products yet'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {products.length
                        ? 'Try changing your search or filters.'
                        : 'Add your first product to start tracking inventory.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!!filteredProducts.length && (
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={(_event, nextPage) => setPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            }}
          />
        )}
      </Card>
    </DashboardContent>
  );
}
