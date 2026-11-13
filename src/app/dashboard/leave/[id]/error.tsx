'use client';

import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { DashboardContent } from '@/layouts/dashboard';

import { Iconify } from '@/components/iconify';
import { EmptyContent } from '@/components/empty-content';

// ----------------------------------------------------------------------

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DashboardContent sx={{ pt: 5 }}>
      <EmptyContent
        filled
        title="Product not found!"
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.leave.root}
            startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
            sx={{ mt: 3 }}
          >
            Back to list
          </Button>
        }
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    </DashboardContent>
  );
}
