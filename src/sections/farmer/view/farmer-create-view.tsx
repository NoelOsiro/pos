'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { FarmerNewEditForm } from '../farmer-new-edit-form';

export function FarmerCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Register Farmer"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Farmers', href: paths.dashboard.farmers.root },
          { name: 'Register' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FarmerNewEditForm />
    </DashboardContent>
  );
}