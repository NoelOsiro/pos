'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import CustomerNewEditForm from '../customer-new-edit-form';

// ----------------------------------------------------------------------

export function CustomerCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new customer"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customers', href: paths.dashboard.customer.root },
          { name: 'New customer' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CustomerNewEditForm />
    </DashboardContent>
  );
}
