import type { IFarmerCard } from '@/types/farmer';
import type { CardProps } from '@mui/material/Card';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { fShortenNumber } from '@/utils/format-number';

import { Iconify } from '@/components/iconify';

type Props = CardProps & {
  farmer: IFarmerCard;
};

export function FarmerCard({ farmer, sx, ...other }: Props) {
  const statusColor = {
    active: 'success',
    pending: 'warning',
    suspended: 'warning',
    exited: 'default',
  }[farmer.status] || 'default';

  return (
    <Card sx={[{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ position: 'relative', p: 2 }}>
        <Avatar
          alt={`${farmer.first_name} ${farmer.last_name}`}
          sx={{
            width: 72,
            height: 72,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 600,
          }}
        >
          {farmer.first_name.charAt(0)}{farmer.last_name.charAt(0)}
        </Avatar>

        <ListItemText
          sx={{ mb: 1 }}
          primary={farmer.member_number}
          secondary={`${farmer.first_name} ${farmer.last_name}`}
          slotProps={{
            primary: { sx: { typography: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 } },
            secondary: { sx: { typography: 'h6', fontWeight: 600 } },
          }}
        />

        <Chip
          label={farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
          size="small"
          color={statusColor as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mx: 2 }} />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:phone-bold" fontSize={18} color="text.secondary" />
            <Typography variant="body2" color="text.primary">{farmer.phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:map-bold" fontSize={18} color="text.secondary" />
            <Typography variant="body2" color="text.secondary">{farmer.county_name}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Iconify icon="solar:layers-bold" fontSize={18} color="text.secondary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" color="text.primary">
            {farmer.farm_count} {farmer.farm_count === 1 ? 'farm' : 'farms'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mx: 2 }} />

      <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.farmers.edit(farmer.id)}
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:pen-bold" fontSize={16} />}
        >
          Edit
        </Button>
        <Button
          component={RouterLink}
          href={paths.dashboard.farms.list}
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:layers-bold" fontSize={16} />}
        >
          Farms
        </Button>
      </Box>
    </Card>
  );
}