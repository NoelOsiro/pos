'use client';

import { paths } from '@/routes/paths';
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
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

type CooperativeSector = {
  id: string;
  is_primary: boolean;
  sector: {
    id: string;
    code: string;
    name: string;
    is_regulated: boolean;
    primary_regulator: string;
    description: string;
  };
};

type SectorsResponse = { sectors: CooperativeSector[] };

export function SectorCardsView() {
  const [sectors, setSectors] = useState<CooperativeSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api
      .get<SectorsResponse>(cooperativeEndpoints.sectors)
      .then(({ data }) => {
        if (active) setSectors(data.sectors);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load cooperative sectors.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Sectors"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperative' },
          { name: 'Sectors' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading && (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      )}
      {!loading && !error && sectors.length === 0 && (
        <Alert severity="info">No sectors have been assigned to this cooperative yet.</Alert>
      )}
      {!loading && !error && sectors.length > 0 && (
        <Grid container spacing={3}>
          {sectors.map(({ id, is_primary, sector }) => (
            <Grid key={id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ p: 3, height: 1 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Typography variant="h6">{sector.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{sector.code}</Typography>
                    </Box>
                    {is_primary && <Chip label="Primary" size="small" color="primary" variant="outlined" />}
                  </Stack>
                  {sector.description && <Typography variant="body2">{sector.description}</Typography>}
                  <Chip
                    label={sector.is_regulated ? `Regulated${sector.primary_regulator ? ` · ${sector.primary_regulator}` : ''}` : 'Not regulated'}
                    size="small"
                    color={sector.is_regulated ? 'warning' : 'default'}
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardContent>
  );
}
