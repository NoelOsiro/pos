'use client';

import { useCallback, useEffect, useState } from 'react';

import type { IFarmerFormData } from '@/types/farmer';

import { paths } from '@/routes/paths';

import { useFarmerStore } from '@/store/farmerStore';
import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { FarmerNewEditForm } from '../farmer-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function FarmerEditView({ id }: Props) {
  const { fetchFarmer, fetchFarmers } = useFarmerStore();
  const [farmer, setFarmer] = useState<(IFarmerFormData & { id: string; member_number?: string; national_id_masked?: string; status?: string; farm_count?: number; created_at?: string })>();

  useEffect(() => {
    fetchFarmer(id).then((data) => {
      setFarmer({
        ...data,
        national_id: '',
        county: data.county ?? null,
        ward: data.ward ?? '',
        village: data.village ?? '',
        payout_phone: data.payout_phone ?? '',
        date_of_birth: data.date_of_birth ?? null,
      });
    });
  }, [fetchFarmer, id]);

  const onFetchFarmers = useCallback(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Farmer"
        backHref={paths.dashboard.farmers.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Farmers', href: paths.dashboard.farmers.root },
          { name: farmer?.member_number || farmer?.first_name || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FarmerNewEditForm currentFarmer={farmer} onUpdated={onFetchFarmers} />
    </DashboardContent>
  );
}