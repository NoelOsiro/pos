'use client';

import type { IFarmItem, IFarmTableFilters } from '@/types/farmer';

import { paths } from '@/routes/paths';
import { toast } from '@/components/snackbar';
import { useEffect, useCallback } from 'react';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useFarmStore } from '@/store/farmStore';
import { useShallow } from 'zustand/react/shallow';
import { Scrollbar } from '@/components/scrollbar';
import { useFarmerStore } from '@/store/farmerStore';
import { DashboardContent } from '@/layouts/dashboard';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '@/components/table';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { FarmTableRow } from '../farm-table-row';
import { FarmTableToolbar } from '../farm-table-toolbar';
import { FarmTableFiltersResult } from '../farm-table-filters-result';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'farmer_name', label: 'Farmer', width: 180 },
  { id: 'sector_name', label: 'Sector', width: 140 },
  { id: 'size_acres', label: 'Size', width: 120 },
  { id: 'county', label: 'County', width: 140 },
  { id: 'is_active', label: 'Status', width: 120 },
  { id: '', width: 88 },
];

export function FarmListView() {
  const table = useTable();

  const confirmDialog = useBoolean();

  const { farms, fetchFarms, deleteFarm } = useFarmStore(
    useShallow((state) => ({
      farms: state.farms,
      fetchFarms: state.fetchFarms,
      deleteFarm: state.deleteFarm,
    }))
  );

  const { farmers } = useFarmerStore(
    useShallow((state) => ({
      farmers: state.farmers,
    }))
  );

  const filters = useSetState<IFarmTableFilters>({ name: '', farmer: '', status: 'all' });
  const { state: currentFilters } = filters;

  useEffect(() => {
    fetchFarms({
      farmer: currentFilters.farmer || undefined,
    });
  }, [fetchFarms, currentFilters.farmer]);

  const dataFiltered = applyFilter({
    inputData: farms,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name || !!currentFilters.farmer || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteFarm(id);
        toast.success('Delete success!');
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch {
        toast.error('Delete failed!');
      }
    },
    [dataInPage.length, table, deleteFarm]
  );

  const handleDeleteRows = useCallback(async () => {
    const selectedFarms = farms.filter((row) => table.selected.includes(row.id));
    for (const farm of selectedFarms) {
      await deleteFarm(farm.id);
    }
    toast.success('Delete success!');
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, farms, deleteFarm]);

  const farmerOptions = farmers.map((farmer) => ({
    id: farmer.id,
    name: `${farmer.first_name} ${farmer.last_name}`,
  }));

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button variant="contained" color="error" onClick={handleDeleteRows}>
          Delete
        </Button>
      }
    />
  );

  return (
    <>
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

        <Card>
          <FarmTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ farmers: farmerOptions }}
          />

          {canReset && (
            <FarmTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <FarmTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IFarmItem[];
  comparator: (a: any, b: any) => number;
  filters: IFarmTableFilters;
}) {
  const { name, farmer, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((farm) =>
      farm.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (farmer) {
    inputData = inputData.filter((farm) => farm.farmer === farmer);
  }

  if (status !== 'all') {
    const isActive = status === 'active';
    inputData = inputData.filter((farm) => farm.is_active === isActive);
  }

  return inputData;
}