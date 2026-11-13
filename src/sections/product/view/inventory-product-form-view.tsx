'use client';

import type { ChangeEvent, FormEvent } from 'react';
import type { ICategoryItem, IProductItem, ProductFormValues } from '@/types/product';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { toast } from '@/components/snackbar';
import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { createInventoryProductAction, updateInventoryProductAction } from '@/app/dashboard/inventory/actions';

type Props = {
  categories: ICategoryItem[];
  product?: IProductItem;
};

function initialValues(product?: IProductItem): ProductFormValues {
  return {
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    categoryId: product?.categoryId ?? '',
    price: product ? String(product.price) : '',
    costPrice: product?.costPrice === undefined ? '' : String(product.costPrice),
    stockQuantity: product?.stockQuantity ?? 0,
    minStock: product?.minStock ?? 0,
    coverUrl: product?.coverUrl ?? '',
    description: product?.description ?? '',
    isActive: product?.isActive ?? true,
  };
}

export function InventoryProductFormView({ categories, product }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(product));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStringChange =
    (field: 'name' | 'sku' | 'categoryId' | 'price' | 'costPrice' | 'coverUrl' | 'description') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));
  const handleNumberChange =
    (field: 'stockQuantity' | 'minStock') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [field]: Number(event.target.value) }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = product
        ? await updateInventoryProductAction(product.id, values)
        : await createInventoryProductAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const productId = result.id ?? product?.id;
      if (!productId) {
        toast.error('The product was saved, but its details page could not be opened.');
        return;
      }

      toast.success(product ? 'Product updated.' : 'Product added.');
      router.push(paths.dashboard.inventory.details(productId));
    } catch (error) {
      console.error('Inventory product form submission failed:', error);
      toast.error('Unable to save the product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={product ? 'Edit product' : 'Add product'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Inventory', href: paths.dashboard.inventory.list },
          ...(product
            ? [
                { name: product.name, href: paths.dashboard.inventory.details(product.id) },
                { name: 'Edit product' },
              ]
            : [{ name: 'Add product' }]),
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box component="form" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Product name"
                value={values.name}
                onChange={handleStringChange('name')}
                required
                fullWidth
                inputProps={{ maxLength: 160 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="SKU"
                value={values.sku}
                onChange={handleStringChange('sku')}
                required
                fullWidth
                inputProps={{ maxLength: 80 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Category"
                value={values.categoryId}
                onChange={handleStringChange('categoryId')}
                fullWidth
              >
                <MenuItem value="">Uncategorized</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Selling price"
                type="number"
                value={values.price}
                onChange={handleStringChange('price')}
                required
                fullWidth
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Cost price"
                type="number"
                value={values.costPrice}
                onChange={handleStringChange('costPrice')}
                fullWidth
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Stock quantity"
                type="number"
                value={values.stockQuantity}
                onChange={handleNumberChange('stockQuantity')}
                required
                fullWidth
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Low stock threshold"
                type="number"
                value={values.minStock}
                onChange={handleNumberChange('minStock')}
                required
                fullWidth
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Image URL"
                value={values.coverUrl}
                onChange={handleStringChange('coverUrl')}
                fullWidth
                inputProps={{ maxLength: 2048 }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                value={values.description}
                onChange={handleStringChange('description')}
                fullWidth
                multiline
                minRows={3}
                inputProps={{ maxLength: 2000 }}
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.isActive}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, isActive: event.target.checked }))
                    }
                  />
                }
                label="Active product"
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
            <Button
              type="button"
              color="inherit"
              onClick={() =>
                router.push(
                  product
                    ? paths.dashboard.inventory.details(product.id)
                    : paths.dashboard.inventory.list
                )
              }
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : product ? 'Save changes' : 'Add product'}
            </Button>
          </Stack>
        </Card>
      </Box>
    </DashboardContent>
  );
}
