import type { AuthUserView } from '@/auth/hooks/use-auth-user';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from '@/components/iconify';

type Props = {
  user: AuthUserView;
};

export function ProfileHome({ user }: Props) {
  const rows = [
    { icon: 'fluent:mail-24-filled', label: user.email },
    user.role && { icon: 'solar:user-id-bold', label: user.role },
  ].filter((row): row is { icon: string; label: string } => Boolean(row));

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
