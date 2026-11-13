'use client';

import type { IAgentItem, IAgentTableFilters } from '@/types/agent';

import { paths } from '@/routes/paths';
import { Label } from '@/components/label';
import { toast } from '@/components/snackbar';
import { useEffect, useCallback } from 'react';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useShallow } from 'zustand/react/shallow';
import { useAgentStore } from '@/store/agentStore';
import { Scrollbar } from '@/components/scrollbar';
import { AGENT_STATUS_OPTIONS } from '@/types/agent';
import { DashboardContent } from '@/layouts/dashboard';
import { ConfirmDialog } from '@/components/custom-dialog';
import { CustomPopover } from '@/components/custom-popover';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useBoolean, usePopover, useSetState } from 'minimal-shared/hooks';
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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';

import { AgentTableRow } from '../agent-table-row';
import { AgentTableToolbar } from '../agent-table-toolbar';
import { AgentTableFiltersResult } from '../agent-table-filters-result';

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...AGENT_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'employee_number', label: 'Employee' },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'branch', label: 'Branch' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

export function AgentListView() {
  const table = useTable();

  const confirmDialog = useBoolean();
  const menuActions = usePopover();

  const { agents, fetchAgents, setAgentStatus } = useAgentStore(
    useShallow((state) => ({
      agents: state.agents,
      fetchAgents: state.fetchAgents,
      setAgentStatus: state.setAgentStatus,
    }))
  );

  const filters = useSetState<IAgentTableFilters>({ name: '', status: 'all', branch: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    fetchAgents({
      status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
      search: currentFilters.name || undefined,
      branch: currentFilters.branch || undefined,
    });
  }, [fetchAgents, currentFilters.status, currentFilters.name, currentFilters.branch]);

  const dataFiltered = applyFilter({
    inputData: agents,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.name || currentFilters.status !== 'all' || !!currentFilters.branch;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await setAgentStatus(id, status);
        toast.success(`Status updated to ${status}!`);
      } catch {
        toast.error('Status update failed!');
      }
    },
    [setAgentStatus]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const handleStatusChangeSelected = useCallback(async () => {
    const selectedAgents = agents.filter((row) => table.selected.includes(row.id));
    for (const agent of selectedAgents) {
      if (agent.status === 'active') {
        await handleChangeStatus(agent.id, 'suspended');
      } else if (agent.status === 'suspended') {
        await handleChangeStatus(agent.id, 'active');
      }
    }
    confirmDialog.onFalse();
  }, [agents, table, handleChangeStatus, confirmDialog]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Change agent status"
      content={
        <>
          Are you sure you want to change status for <strong> {table.selected.length} </strong> agent(s)?
        </>
      }
      action={
        <Button variant="contained" color="warning" onClick={handleStatusChangeSelected}>
          Change Status
        </Button>
      }
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuItem onClick={() => menuActions.onClose()}>
        <Iconify icon="solar:printer-minimalistic-bold" />
        Print
      </MenuItem>
      <MenuItem onClick={() => menuActions.onClose()}>
        <Iconify icon="solar:import-bold" />
        Import
      </MenuItem>
      <MenuItem onClick={() => menuActions.onClose()}>
        <Iconify icon="solar:export-bold" />
        Export
      </MenuItem>
    </CustomPopover>
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Agents"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Agents', href: paths.dashboard.agents.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.agents.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Invite Agent
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
                        (tab.value === 'suspended' && 'warning') ||
                        (tab.value === 'deactivated' && 'default') ||
                        'default'
                      }
                    >
                      {tab.value === 'all'
                        ? agents.length
                        : agents.filter((a) => a.status === tab.value).length}
                    </Label>
                  </Box>
                }
                iconPosition="end"
              />
            ))}
          </Tabs>

          <AgentTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <AgentTableFiltersResult
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
                    <AgentTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onStatusChange={(status) => handleChangeStatus(row.id, status)}
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
  inputData: IAgentItem[];
  comparator: (a: any, b: any) => number;
  filters: IAgentTableFilters;
}) {
  const { name, status, branch } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (agent) =>
        agent.full_name.toLowerCase().includes(name.toLowerCase()) ||
        agent.email.toLowerCase().includes(name.toLowerCase()) ||
        agent.employee_number.toLowerCase().includes(name.toLowerCase()) ||
        agent.phone.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((agent) => agent.status === status);
  }

  if (branch) {
    inputData = inputData.filter(
      (agent) => agent.branch_name.toLowerCase().includes(branch.toLowerCase())
    );
  }

  return inputData;
}
