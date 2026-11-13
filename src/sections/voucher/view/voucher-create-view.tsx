'use client';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { VoucherNewEditForm } from '../voucher-new-edit-form';

// ----------------------------------------------------------------------

export function VoucherCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new voucher"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vouchers', href: paths.dashboard.voucher.root },
          { name: 'New voucher' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <VoucherNewEditForm />
    </DashboardContent>
  );
}
