'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { FarmNewEditForm } from '../farm-new-edit-form';

export function FarmCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Farm"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Farmers', href: paths.dashboard.farmers.list },
          { name: 'Farms' },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FarmNewEditForm />
    </DashboardContent>
  );
}