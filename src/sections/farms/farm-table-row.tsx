import type { IFarmItem } from '@/types/farmer';

import { paths } from '@/routes/paths';
import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { ConfirmDialog } from '@/components/custom-dialog';
import { CustomPopover } from '@/components/custom-popover';
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

import { FarmQuickEditForm } from './farm-quick-edit-form';

type Props = {
  row: IFarmItem;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: (id: string) => void;
};

export function FarmTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderQuickEditForm = () => (
    <FarmQuickEditForm
      currentFarm={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
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
            href={paths.dashboard.farms.edit(row.id)}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete farm"
      content="Are you sure you want to delete this farm?"
      action={
        <Button variant="contained" color="error" onClick={() => { onDeleteRow(row.id); confirmDialog.onFalse(); }}>
          Delete
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
            <Avatar alt={row.name} src={row.name} sx={{ bgcolor: 'primary.main' }}>
              {row.name.charAt(0)}
            </Avatar>

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={paths.dashboard.farms.edit(row.id)}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                {row.farmer_name}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.sector_name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.size_acres} acres</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.county}
          {row.sub_county && <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}> / {row.sub_county}</Box>}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={row.is_active ? 'success' : 'default'}
          >
            {row.is_active ? 'Active' : 'Inactive'}
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