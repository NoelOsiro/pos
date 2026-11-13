'use client';

import type { IDateValue } from '@/types/common';
import type { IFarmerItem, IFarmerTableFilters } from '@/types/farmer';

import { useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useShallow } from 'zustand/react/shallow';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { useFarmerStore } from '@/store/farmerStore';
import { FARMER_STATUS_OPTIONS } from '@/types/farmer';
import { DashboardContent } from '@/layouts/dashboard';

import { Label } from '@/components/label';
import { toast } from '@/components/snackbar';
import { Iconify } from '@/components/iconify';
import { Scrollbar } from '@/components/scrollbar';
import { ConfirmDialog } from '@/components/custom-dialog';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '@/components/table';

import { FarmerTableRow } from '../farmer-table-row';
import { FarmerTableToolbar } from '../farmer-table-toolbar';
import { FarmerTableFiltersResult } from '../farmer-table-filters-result';

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...FARMER_STATUS_OPTIONS];

const COUNTY_OPTIONS = [
  { id: 1, name: 'Nairobi' },
  { id: 2, name: 'Kiambu' },
  { id: 3, name: 'Machakos' },
  { id: 4, name: 'Kisumu' },
  { id: 5, name: 'Mombasa' },
];

const TABLE_HEAD = [
  { id: 'member_number', label: 'Member' },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'county', label: 'County' },
  { id: 'farms', label: 'Farms' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

export function FarmerListView() {
  const table = useTable();

  const confirmDialog = useBoolean();

  const { farmers, fetchFarmers, approveFarmer, loading } = useFarmerStore(
    useShallow((state) => ({
      farmers: state.farmers,
      fetchFarmers: state.fetchFarmers,
      approveFarmer: state.approveFarmer,
      loading: state.loading,
    }))
  );

  const filters = useSetState<IFarmerTableFilters>({ name: '', status: 'all', county: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    fetchFarmers({
      status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
      search: currentFilters.name || undefined,
      county: currentFilters.county || undefined,
    });
  }, [fetchFarmers, currentFilters.status, currentFilters.name, currentFilters.county]);

  const dataFiltered = applyFilter({
    inputData: farmers,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name || currentFilters.status !== 'all' || !!currentFilters.county;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleApprove = useCallback(
    async (id: string, status: string, reason?: string) => {
      try {
        await approveFarmer(id, status, reason);
        toast.success(`Status updated to ${status}!`);
      } catch (error) {
        toast.error('Status update failed!');
      }
    },
    [approveFarmer]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const handleApproveSelected = useCallback(async () => {
    const selectedFarmers = farmers.filter((row) => table.selected.includes(row.id));
    for (const farmer of selectedFarmers) {
      if (farmer.status === 'pending') {
        await handleApprove(farmer.id, 'active');
      }
    }
    confirmDialog.onFalse();
  }, [farmers, table, handleApprove, confirmDialog]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Approve farmers"
      content={
        <>
          Are you sure you want to approve <strong> {table.selected.length} </strong> pending farmer(s)?
        </>
      }
      action={
        <Button variant="contained" color="success" onClick={handleApproveSelected}>
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
            { name: 'List' },
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

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${theme.vars.palette.grey['500Channel']}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    <Label
                      variant={
                        (tab.value === 'all' || tab.value === currentFilters.status) && 'filled' || 'soft'
                      }
                      color={
                        (tab.value === 'active' && 'success') ||
                        (tab.value === 'pending' && 'warning') ||
                        (tab.value === 'suspended' && 'warning') ||
                        (tab.value === 'exited' && 'default') ||
                        'default'
                      }
                    >
                      {tab.value === 'all'
                        ? farmers.length
                        : farmers.filter((f) => f.status === tab.value).length}
                    </Label>
                  </Box>
                }
                iconPosition="end"
              />
            ))}
          </Tabs>

          <FarmerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ counties: COUNTY_OPTIONS }}
          />

          {canReset && (
            <FarmerTableFiltersResult
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
                    <FarmerTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onApproveRow={(status, reason) => handleApprove(row.id, status, reason)}
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
  inputData: IFarmerItem[];
  comparator: (a: any, b: any) => number;
  filters: IFarmerTableFilters;
}) {
  const { name, status, county } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (farmer) =>
        farmer.first_name.toLowerCase().includes(name.toLowerCase()) ||
        farmer.last_name.toLowerCase().includes(name.toLowerCase()) ||
        farmer.member_number.toLowerCase().includes(name.toLowerCase()) ||
        farmer.phone.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((farmer) => farmer.status === status);
  }

  if (county) {
    inputData = inputData.filter(
      (farmer) => farmer.county.toString() === county
    );
  }

  return inputData;
}