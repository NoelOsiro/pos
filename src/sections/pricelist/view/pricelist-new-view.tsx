'use client';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { useState, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { Iconify } from '@/components/iconify';
import { DashboardContent } from '@/layouts/dashboard';
import api, { cooperativeEndpoints } from '@/auth/services/api';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

type CooperativeSector = { id: string; is_primary: boolean; sector: { id: string; name: string } };
type SectorResponse = { sectors: CooperativeSector[] };
type EntryDraft = { grade: string; unit: string; unit_price: string; adjustment_factor: string; conversion_factor: string };

const blankEntry = (): EntryDraft => ({
  grade: '',
  unit: 'kg',
  unit_price: '',
  adjustment_factor: '1.0000',
  conversion_factor: '1.000',
});

export function PriceListNewView() {
  const router = useRouter();
  const [sectors, setSectors] = useState<CooperativeSector[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().slice(0, 10));
  const [effectiveTo, setEffectiveTo] = useState('');
  const [entries, setEntries] = useState<EntryDraft[]>([blankEntry()]);

  useEffect(() => {
    let active = true;
    api.get<SectorResponse>(cooperativeEndpoints.sectors).then(({ data }) => {
      if (active) {
        setSectors(data.sectors);
        setSector(data.sectors.find((item) => item.is_primary)?.sector.id ?? data.sectors[0]?.sector.id ?? '');
      }
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load cooperative sectors.');
    }).finally(() => {
      if (active) setLoadingSectors(false);
    });
    return () => { active = false; };
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (effectiveTo && effectiveTo < effectiveFrom) {
      setError('The end date must be on or after the start date.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.post(cooperativeEndpoints.priceLists, {
        name,
        sector,
        effective_from: effectiveFrom,
        effective_to: effectiveTo || null,
        currency: 'KES',
        entries: entries.map((entry) => ({
          ...entry,
          grade: entry.grade.trim(),
          unit_price: entry.unit_price,
        })),
      });
      toast.success('Draft price list created.');
      router.push(paths.dashboard.pricelists.list);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not create price list.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New price list"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Price lists', href: paths.dashboard.pricelists.list },
          { name: 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <form onSubmit={submit}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Price list details</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} required fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField select label="Sector" value={sector} onChange={(event) => setSector(event.target.value)} required fullWidth disabled={loadingSectors}>
                  {sectors.map((item) => <MenuItem key={item.sector.id} value={item.sector.id}>{item.sector.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Effective from" type="date" value={effectiveFrom} onChange={(event) => setEffectiveFrom(event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Effective to" type="date" value={effectiveTo} onChange={(event) => setEffectiveTo(event.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} helperText="Leave blank for an open-ended list." />
              </Grid>
            </Grid>
            {loadingSectors && <Stack alignItems="center" sx={{ mt: 2 }}><CircularProgress size={24} /></Stack>}
          </Card>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6">Grade prices</Typography>
                <Typography variant="body2" color="text.secondary">Add one price entry for each grade and unit.</Typography>
              </Box>
              <Button startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => setEntries((current) => [...current, blankEntry()])}>Add grade</Button>
            </Stack>
            <Stack spacing={2}>
              {entries.map((entry, index) => (
                <Grid container spacing={1.5} key={index} alignItems="center">
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField label="Grade" value={entry.grade} onChange={(event) => setEntries((current) => current.map((item, i) => i === index ? { ...item, grade: event.target.value } : item))} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField select label="Unit" value={entry.unit} onChange={(event) => setEntries((current) => current.map((item, i) => i === index ? { ...item, unit: event.target.value } : item))} fullWidth>
                      <MenuItem value="kg">kg</MenuItem><MenuItem value="litre">litre</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField label="Price (KES)" type="number" inputProps={{ min: '0.01', step: '0.01' }} value={entry.unit_price} onChange={(event) => setEntries((current) => current.map((item, i) => i === index ? { ...item, unit_price: event.target.value } : item))} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField label="Adjustment" type="number" inputProps={{ min: '0.0001', max: '9.9999', step: '0.0001' }} value={entry.adjustment_factor} onChange={(event) => setEntries((current) => current.map((item, i) => i === index ? { ...item, adjustment_factor: event.target.value } : item))} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 5, sm: 2 }}>
                    <TextField label="Conversion" type="number" inputProps={{ min: '0.001', max: '999.999', step: '0.001' }} value={entry.conversion_factor} onChange={(event) => setEntries((current) => current.map((item, i) => i === index ? { ...item, conversion_factor: event.target.value } : item))} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 1, sm: 1 }}>
                    <IconButton aria-label="Remove grade" disabled={entries.length === 1} onClick={() => setEntries((current) => current.filter((_, i) => i !== index))}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Card>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="outlined" onClick={() => router.push(paths.dashboard.pricelists.list)}>Cancel</Button>
            <LoadingButton type="submit" variant="contained" loading={saving} disabled={loadingSectors || sectors.length === 0}>Create draft</LoadingButton>
          </Stack>
        </Stack>
      </form>
    </DashboardContent>
  );
}
