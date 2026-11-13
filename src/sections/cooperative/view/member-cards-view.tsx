'use client';

import { paths } from '@/routes/paths';
import { useAuthUser } from '@/auth/hooks';
import { useState, useEffect } from 'react';
import { DashboardContent } from '@/layouts/dashboard';
import api, { cooperativeEndpoints } from '@/auth/services/api';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

type CooperativeMember = {
  id: number;
  role: string;
  is_active: boolean;
  joined_at: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile?: { phone?: string; avatar_url?: string };
  };
};

type MembersResponse = { members: CooperativeMember[] };

export function MemberCardsView() {
  const { cooperative } = useAuthUser();
  const [members, setMembers] = useState<CooperativeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cooperative) {
      setLoading(false);
      setError('Select a cooperative to view its members.');
      return () => {};
    }

    let active = true;
    setLoading(true);
    setError(null);

    api
      .get<MembersResponse>(cooperativeEndpoints.members(cooperative.id))
      .then(({ data }) => {
        if (active) setMembers(data.members);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load cooperative members.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cooperative]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cooperative members"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperative' },
          { name: 'Members' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading && (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      )}
      {!loading && !error && members.length === 0 && (
        <Alert severity="info">There are no active members in this cooperative.</Alert>
      )}
      {!loading && !error && members.length > 0 && (
        <Grid container spacing={3}>
          {members.map((member) => {
            const name = [member.user.first_name, member.user.last_name].filter(Boolean).join(' ') || member.user.email;
            const initials = [member.user.first_name, member.user.last_name]
              .filter(Boolean)
              .map((part) => part.charAt(0))
              .join('')
              .toUpperCase();

            return (
              <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card sx={{ p: 3, height: 1 }}>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Avatar
                      src={member.user.profile?.avatar_url || undefined}
                      alt={name}
                      sx={{ width: 72, height: 72 }}
                    >
                      {initials || name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{name}</Typography>
                      <Typography variant="body2" color="text.secondary">{member.user.email}</Typography>
                    </Box>
                    <Chip
                      label={member.role.replaceAll('_', ' ')}
                      size="small"
                      color={member.role === 'coopadmin' ? 'primary' : 'default'}
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    {member.user.profile?.phone && (
                      <Typography variant="body2" color="text.secondary">{member.user.profile.phone}</Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </DashboardContent>
  );
}
