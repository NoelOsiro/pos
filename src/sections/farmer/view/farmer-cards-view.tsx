'use client';

import { useCallback, useEffect } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useShallow } from 'zustand/react/shallow';

import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { useFarmerStore } from '@/store/farmerStore';
import { FARMER_STATUS_OPTIONS } from '@/types/farmer';
import { DashboardContent } from '@/layouts/dashboard';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { FarmerCardList } from '../farmer-card-list';
import { FarmerTableToolbar } from '../farmer-table-toolbar';
import { FarmerTableFiltersResult } from '../farmer-table-filters-result';

const COUNTY_OPTIONS = [
  { id: 1, name: 'Nairobi' },
  { id: 2, name: 'Kiambu' },
  { id: 3, name: 'Machakos' },
  { id: 4, name: 'Kisumu' },
  { id: 5, name: 'Mombasa' },
];

export function FarmerCardsView() {
  const confirmDialog = useBoolean();

  const { farmers, fetchFarmers, approveFarmer } = useFarmerStore(
    useShallow((state) => ({
      farmers: state.farmers,
      fetchFarmers: state.fetchFarmers,
      approveFarmer: state.approveFarmer,
    }))
  );

  const filters = useSetState<{ status: string; county: string }>({ status: 'all', county: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    fetchFarmers({
      status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
      county: currentFilters.county || undefined,
    });
  }, [fetchFarmers, currentFilters]);

  const canReset = currentFilters.status !== 'all' || !!currentFilters.county;

  const handleReset = () => {
    updateFilters({ status: 'all', county: '' });
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Approve farmers"
      content="Are you sure you want to approve selected farmers?"
      action={
        <Button variant="contained" color="success" onClick={confirmDialog.onFalse}>
          Approve
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Farmers"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Farmers', href: paths.dashboard.farmers.list },
            { name: 'Cards' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.farmers.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Register Farmer
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <FarmerTableToolbar
          filters={filters as any}
          onResetPage={handleReset}
          options={{ counties: COUNTY_OPTIONS }}
        />

        {canReset && (
          <FarmerTableFiltersResult
            filters={filters as any}
            totalResults={farmers.length}
            onResetPage={handleReset}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ mt: { xs: 3, md: 5 } }}>
          <FarmerCardList
            farmers={farmers.map((farmer) => ({
              id: farmer.id,
              member_number: farmer.member_number,
              first_name: farmer.first_name,
              last_name: farmer.last_name,
              status: farmer.status,
              farm_count: farmer.farm_count,
              phone: farmer.phone,
              county_name: farmer.county_name,
            }))}
          />
        </Box>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

import Box from '@mui/material/Box';