import type { IFarmCard } from '@/types/farmer';
import type { CardProps } from '@mui/material/Card';

import { paths } from '@/routes/paths';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

type Props = CardProps & {
  farm: IFarmCard;
};

export function FarmCard({ farm, sx, ...other }: Props) {
  return (
    <Card sx={[{ height: '100%', display: 'flex', flexDirection: 'column' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.25rem' }}
        >
          <Iconify icon="solar:folder-bold" fontSize={24} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {farm.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {farm.farmer_name}
          </Typography>
        </Box>

        <Chip
          label={farm.is_active ? 'Active' : 'Inactive'}
          size="small"
          color={farm.is_active ? 'success' : 'default'}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mx: 2 }} />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:map-bold" fontSize={18} color="text.secondary" />
            <Typography variant="body2" color="text.secondary">{farm.county_name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:layers-bold" fontSize={18} color="text.secondary" />
            <Typography variant="body2" color="text.secondary">{farm.size_acres} acres</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Iconify icon="solar:leaf-bold" fontSize={18} color="text.secondary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" color="text.primary">
            {farm.sector_name}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mx: 2 }} />

      <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.farms.edit(farm.id)}
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:pen-bold" fontSize={16} />}
        >
          Edit
        </Button>
      </Box>
    </Card>
  );
}