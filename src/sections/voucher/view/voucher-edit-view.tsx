'use client';

import type { IVoucherItem } from '@/types/voucher';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { VoucherNewEditForm } from '../voucher-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  voucher?: IVoucherItem;
};

export function VoucherEditView({ voucher: currentVoucher }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.voucher.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vouchers', href: paths.dashboard.voucher.root },
          { name: currentVoucher?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <VoucherNewEditForm currentVoucher={currentVoucher} />
    </DashboardContent>
  );
}
