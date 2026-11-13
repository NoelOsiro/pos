import type { AuthUserView } from '@/auth/hooks/use-auth-user';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from '@/utils/format-time';

import { Iconify } from '@/components/iconify';
import { CooperativeSummary } from '@/auth/types';

// ----------------------------------------------------------------------

type Props = {
  user: AuthUserView;
  cooperative: CooperativeSummary | null;
};

export function ProfileHome({ user, cooperative }: Props) {
  const rows = [
    { icon: 'fluent:mail-24-filled', label: user.email },
    user.profile?.phone && { icon: 'solar:phone-bold', label: user.profile.phone },
    cooperative && {
      icon: 'ic:round-business-center',
      label: `${cooperative.role_display} at ${cooperative.name} (${cooperative.code})`,
    },
    user.countyIds?.length > 0 && {
      icon: 'mingcute:location-fill',
      label: `Assigned to ${user.countyIds.length} county${user.countyIds.length > 1 ? ' areas' : ''}`,
    },
    user.date_joined && {
      icon: 'solar:calendar-date-bold',
      label: `Member since ${fDate(user.date_joined)}`,
    },
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <Card sx={{ maxWidth: 560 }}>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        {rows.map((row) => (
          <Box key={row.label} sx={{ display: 'flex', alignItems: 'center' }}>
            <Iconify width={24} icon={row.icon} sx={{ mr: 2, flexShrink: 0 }} />
            {row.label}
          </Box>
        ))}
      </Stack>
    </Card>
  );
}