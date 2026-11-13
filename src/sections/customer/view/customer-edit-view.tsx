'use client';

import type { ICustomerItem } from '@/types/customer';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import CustomerNewEditForm from '../customer-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  customer?: ICustomerItem;
};

export function CustomerEditView({ customer: currentCustomer }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.customer.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customers', href: paths.dashboard.customer.root },
          { name: currentCustomer?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CustomerNewEditForm currentCustomer={currentCustomer} />
    </DashboardContent>
  );
}
