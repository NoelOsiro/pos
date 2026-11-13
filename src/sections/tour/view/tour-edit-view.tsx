'use client';

import type { ITourItem } from '@/types/tour';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  tour?: ITourItem;
};

export function TourEditView({ tour }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.tour.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tour', href: paths.dashboard.tour.root },
          { name: tour?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TourNewEditForm currentTour={tour} />
    </DashboardContent>
  );
}
