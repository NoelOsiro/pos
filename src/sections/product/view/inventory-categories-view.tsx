'use client';

import type { FormEvent } from 'react';
import type { ICategoryItem } from '@/types/product';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/paths';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { toast } from '@/components/snackbar';
import { createInventoryCategoryAction } from '@/app/dashboard/inventory/actions';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Iconify } from '@/components/iconify';

type Props = {
  categories: ICategoryItem[];
  canManage: boolean;
};

export function InventoryCategoriesView({ categories, canManage }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const filteredCategories = categories.filter((category) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      (category.description ?? '').toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createInventoryCategoryAction({ name, description });
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Category added.');
      setName('');
      setDescription('');
      router.refresh();
    } catch (error) {
      console.error('Inventory category form submission failed:', error);
      toast.error('Unable to save the category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categories"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Inventory', href: paths.dashboard.inventory.list },
          { name: 'Categories' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {canManage && (
        <Card component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add category
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Category name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 120 }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              inputProps={{ maxLength: 1000 }}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: 150 }}>
              Add category
            </Button>
          </Stack>
        </Card>
      )}

      <TextField
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search categories..."
        aria-label="Search categories"
        sx={{ mb: 3, width: { xs: 1, sm: 360 } }}
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', mr: 1, color: 'text.disabled' }}>
              <Iconify icon="eva:search-fill" />
            </Box>
          ),
        }}
      />

      {filteredCategories.length ? (
        <Grid container spacing={3}>
          {filteredCategories.map((category) => (
            <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{ p: 3, height: 1 }}>
                <Stack spacing={2} sx={{ height: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 1.5,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                    }}
                  >
                    <Iconify icon="solar:widget-5-bold-duotone" width={28} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{category.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.slug}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        minHeight: 40,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {category.description || 'No description'}
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Products
                    </Typography>
                    <Typography variant="subtitle2">{category.productCount ?? 0}</Typography>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {categories.length
              ? 'No categories match your search.'
              : 'No categories have been created.'}
          </Typography>
        </Card>
      )}
    </DashboardContent>
  );
}
