import type { IFarmTableFilters } from '@/types/farmer';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';
import { Iconify } from '@/components/iconify';
import { usePopover } from 'minimal-shared/hooks';
import { CustomPopover } from '@/components/custom-popover';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IFarmTableFilters>;
  options: {
    farmers: { id: string; name: string }[];
  };
};

export function FarmTableToolbar({ filters, options, onResetPage }: Props) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterFarmer = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      updateFilters({ farmer: newValue });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      updateFilters({ status: newValue });
    },
    [onResetPage, updateFilters]
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
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
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="filter-farmer-select">Farmer</InputLabel>
          <Select
            value={currentFilters.farmer || ''}
            onChange={handleFilterFarmer}
            input={<OutlinedInput label="Farmer" />}
            inputProps={{ id: 'filter-farmer-select' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="">All</MenuItem>
            {options.farmers.map((farmer) => (
              <MenuItem key={farmer.id} value={farmer.id}>
                {farmer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="filter-status-select">Status</InputLabel>
          <Select
            value={currentFilters.status || 'all'}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'filter-status-select' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Search by farm name..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      {renderMenuActions()}
    </>
  );
}