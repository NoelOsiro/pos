import type { AuthUserView } from '@/auth/hooks/use-auth-user';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from '@/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  memberships: AuthUserView['memberships'];
  activeCooperativeId: string | null;
};

export function ProfileCooperatives({ memberships, activeCooperativeId }: Props) {
  return (
    <Card sx={{ maxWidth: 720 }}>
      <CardHeader title="Cooperatives" subheader="Memberships linked to this account" />

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} sx={{ p: 3, gap: 2 }}>
        {memberships.map((m) => (
          <Box key={m.id} sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, typography: 'body2' }}>
              <Box sx={{ typography: 'subtitle2' }}>
                {m.cooperative_name} ({m.cooperative_code})
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                {m.role_display} · joined {fDate(m.joined_at)}
              </Box>
            </Box>

            {String(m.cooperative_id) === activeCooperativeId && (
              <Chip size="small" color="success" variant="soft" label="Current session" />
            )}
          </Box>
        ))}
      </Stack>
    </Card>
  );
}