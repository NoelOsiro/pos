import type { IAgentItem } from '@/types/agent';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { CustomPopover } from '@/components/custom-popover';
import { ConfirmDialog } from '@/components/custom-dialog';

import { AGENT_STATUS_OPTIONS } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';
import { toast } from '@/components/snackbar';

type Props = {
  row: IAgentItem;
  selected: boolean;
  onSelectRow: () => void;
  onStatusChange: (status: string) => void;
};

export function AgentTableRow({ row, selected, onSelectRow, onStatusChange }: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const { setAgentStatus } = useAgentStore();

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setOpenStatusDialog(true);
    handleClosePopover();
  };

  const handleConfirmStatus = async () => {
    try {
      await onStatusChange(selectedStatus);
      toast.success(`Status changed to ${selectedStatus}`);
    } catch (error) {
      toast.error('Status change failed');
    }
    setOpenStatusDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 1.5,
          px: 2,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <IconButton
          onClick={onSelectRow}
          sx={{
            ...(selected && { bgcolor: 'primary.lighter' }),
          }}
        >
          <Iconify icon="solar:alt-arrow-down-bold" />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{row.employee_number}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">{row.full_name}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">{row.phone}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">{row.branch_name}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Label
              variant="soft"
              color={
                (row.status === 'active' && 'success') ||
                (row.status === 'suspended' && 'warning') ||
                'default'
              }
            >
              {row.status}
            </Label>
          </Box>
        </Box>

        <IconButton color="default" onClick={handleOpenPopover}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Box>

      <CustomPopover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem
          component={RouterLink}
          href={paths.dashboard.agents.edit(row.id)}
          onClick={handleClosePopover}
        >
          <ListItemIcon>
            <Iconify icon="solar:pen-bold" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleClosePopover(); }}>
          <ListItemIcon>
            <Iconify icon="solar:user-check-bold" />
          </ListItemIcon>
          <ListItemText>Change Status</ListItemText>
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        title="Change agent status"
        content={`Are you sure you want to change status to ${selectedStatus}?`}
        action={
          <Button variant="contained" onClick={handleConfirmStatus}>
            Confirm
          </Button>
        }
      />
    </>
  );
}
