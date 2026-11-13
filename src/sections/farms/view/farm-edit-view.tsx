'use client';

import type { IFarmFormData } from '@/types/farmer';

import { useCallback } from 'react';
import { paths } from '@/routes/paths';
import { useFarmStore } from '@/store/farmStore';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { FarmNewEditForm } from '../farm-new-edit-form';

type Props = {
  currentFarm?: IFarmFormData & { id: string; farmer_name?: string; sector_name?: string; is_active?: boolean };
};

export function FarmEditView({ currentFarm }: Props) {
  const { fetchFarms } = useFarmStore();

  const onFetchFarms = useCallback(() => {
    fetchFarms();
  }, [fetchFarms]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Farm"
        backHref={paths.dashboard.farms.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Farms', href: paths.dashboard.farms.list },
          { name: currentFarm?.name || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FarmNewEditForm currentFarm={currentFarm} onUpdated={onFetchFarms} />
    </DashboardContent>
  );
}