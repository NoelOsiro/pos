import type { IFarmerItem } from '@/types/farmer';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from '@/routes/components';

import { paths } from '@/routes/paths';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import { CustomPopover } from '@/components/custom-popover';

import { FarmerQuickEditForm } from './farmer-quick-edit-form';

type Props = {
  row: IFarmerItem;
  selected: boolean;
  onSelectRow: () => void;
  onApproveRow: (status: string, reason?: string) => void;
};

export function FarmerTableRow({ row, selected, onSelectRow, onApproveRow }: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const canApprove = row.status === 'pending';
  const canSuspend = row.status === 'active';
  const canReactivate = row.status === 'suspended';
  const canExit = row.status !== 'exited';

  const renderQuickEditForm = () => (
    <FarmerQuickEditForm
      currentFarmer={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
      onApprove={onApproveRow}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem
            component={RouterLink}
            href={paths.dashboard.farmers.edit(row.id)}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        {canApprove && (
          <MenuItem
            onClick={() => {
              onApproveRow('active');
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:check-bold" />
            Approve
          </MenuItem>
        )}

        {canSuspend && (
          <MenuItem
            onClick={() => {
              const reason = window.prompt('Reason for suspension:');
              if (reason) {
                onApproveRow('suspended', reason);
              }
              menuActions.onClose();
            }}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="solar:pause-bold" />
            Suspend
          </MenuItem>
        )}

        {canReactivate && (
          <MenuItem
            onClick={() => {
              onApproveRow('active');
              menuActions.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="solar:play-bold" />
            Reactivate
          </MenuItem>
        )}

        {canExit && (
          <MenuItem
            onClick={() => {
              const reason = window.prompt('Reason for exit:');
              if (reason) {
                onApproveRow('exited', reason);
              }
              menuActions.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:logout-2-bold" />
            Mark as Exited
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            quickEditForm.onTrue();
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Quick Edit
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Mark as Exited"
      content="Are you sure you want to mark this farmer as exited?"
      action={
        <Button variant="contained" color="error" onClick={() => { onApproveRow('exited', 'Marked as exited via bulk action'); confirmDialog.onFalse(); }}>
          Exit
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `${row.id}-checkbox`,
              'aria-label': `${row.id} checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={`${row.first_name} ${row.last_name}`} src={row.national_id_masked} sx={{ bgcolor: 'primary.main' }}>
              {row.first_name.charAt(0)}{row.last_name.charAt(0)}
            </Avatar>

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={paths.dashboard.farmers.edit(row.id)}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.first_name} {row.last_name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                {row.member_number}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.county_name}
          {row.sub_county && <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}> / {row.sub_county}</Box>}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.farm_count}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              (row.status === 'suspended' && 'warning') ||
              (row.status === 'exited' && 'default') ||
              'default'
            }
          >
            {row.status_display}
          </Label>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEditForm.value ? 'inherit' : 'default'}
                onClick={quickEditForm.onTrue}
                size="small"
              >
                <Iconify icon="solar:pen-bold" fontSize={18} />
              </IconButton>
            </Tooltip>

            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
              size="small"
            >
              <Iconify icon="eva:more-vertical-fill" fontSize={18} />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}