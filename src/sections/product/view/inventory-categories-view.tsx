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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';

type Props = {
  categories: ICategoryItem[];
  canManage: boolean;
};

export function InventoryCategoriesView({ categories, canManage }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Products</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{category.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>{category.description || '—'}</TableCell>
                  <TableCell align="right">{category.productCount ?? 0}</TableCell>
                </TableRow>
              ))}
              {!categories.length && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No categories have been created.
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
