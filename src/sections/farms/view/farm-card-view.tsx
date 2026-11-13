'use client';

import { useEffect } from 'react';
import { paths } from '@/routes/paths';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useFarmStore } from '@/store/farmStore';
import { useSetState } from 'minimal-shared/hooks';
import { useShallow } from 'zustand/react/shallow';
import { useFarmerStore } from '@/store/farmerStore';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { FarmCardList } from '../farm-card-list';
import { FarmTableToolbar } from '../farm-table-toolbar';
import { FarmTableFiltersResult } from '../farm-table-filters-result';

export function FarmCardsView() {
  const { farms, fetchFarms } = useFarmStore(
    useShallow((state) => ({
      farms: state.farms,
      fetchFarms: state.fetchFarms,
    }))
  );

  const { farmers, fetchFarmers } = useFarmerStore(
    useShallow((state) => ({
      farmers: state.farmers,
      fetchFarmers: state.fetchFarmers,
    }))
  );

  const filters = useSetState<{ status: string; farmer: string }>({ status: 'all', farmer: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    fetchFarms();
    fetchFarmers();
  }, [fetchFarms, fetchFarmers]);

  const canReset = currentFilters.status !== 'all' || !!currentFilters.farmer;

  const handleReset = () => {
    updateFilters({ status: 'all', farmer: '' });
  };

  const farmerOptions = farmers.map((farmer) => ({
    id: farmer.id,
    name: `${farmer.first_name} ${farmer.last_name}`,
  }));

  return (
    <DashboardContent>
        <CustomBreadcrumbs
          heading="Farms"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Farmers', href: paths.dashboard.farmers.list },
            { name: 'Farms' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.farms.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Farm
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <FarmTableToolbar
          filters={filters as any}
          onResetPage={handleReset}
          options={{ farmers: farmerOptions }}
        />

        {canReset && (
          <FarmTableFiltersResult
            filters={filters as any}
            totalResults={farms.length}
            onResetPage={handleReset}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ mt: { xs: 3, md: 5 } }}>
          <FarmCardList
            farms={farms.map((farm) => ({
              id: farm.id,
              name: farm.name,
              farmer_name: farm.farmer_name,
              sector_name: farm.sector_name,
              size_acres: farm.size_acres,
              county_name: farm.county.toString(),
              is_active: farm.is_active,
            }))}
          />
        </Box>
      </DashboardContent>
  );
}