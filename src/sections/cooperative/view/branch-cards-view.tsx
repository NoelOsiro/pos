'use client';

import { paths } from '@/routes/paths';
import { useAuthUser } from '@/auth/hooks';
import { useState, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { DashboardContent } from '@/layouts/dashboard';
import api, { cooperativeEndpoints } from '@/auth/services/api';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

type CooperativeBranch = {
  id: string;
  name: string;
  code: string;
  is_head_office: boolean;
  county: { id: number; name: string; code: string } | null;
  sub_county: string;
  ward: string;
  address_line: string;
  contact_phone: string;
  contact_email: string;
  status: 'active' | 'inactive';
};

type BranchesResponse = { branches: CooperativeBranch[] };

type County = { id: number; name: string; code: string };

type BranchForm = {
  name: string;
  code: string;
  county_id: number | '';
  sub_county: string;
  ward: string;
  address_line: string;
  contact_phone: string;
  contact_email: string;
  is_head_office: boolean;
};

const EMPTY_BRANCH: BranchForm = {
  name: '',
  code: '',
  county_id: '',
  sub_county: '',
  ward: '',
  address_line: '',
  contact_phone: '',
  contact_email: '',
  is_head_office: false,
};

export function BranchCardsView() {
  const { hasPermission } = useAuthUser();
  const [branches, setBranches] = useState<CooperativeBranch[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BranchForm>(EMPTY_BRANCH);

  const loadBranches = () =>
    api.get<BranchesResponse>(cooperativeEndpoints.branches).then(({ data }) => setBranches(data.branches));

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get<BranchesResponse>(cooperativeEndpoints.branches),
      api.get<County[]>(cooperativeEndpoints.counties),
    ])
      .then(([{ data: branchData }, { data: countyData }]) => {
        if (active) {
          setBranches(branchData.branches);
          setCounties(countyData);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load cooperative branches.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCreateBranch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post(cooperativeEndpoints.branches, form);
      await loadBranches();
      setForm(EMPTY_BRANCH);
      setDialogOpen(false);
      toast.success('Branch added.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not add branch.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Branches"
        action={hasPermission('cooperative.manage') ? (
          <Button variant="contained" onClick={() => setDialogOpen(true)}>Add branch</Button>
        ) : undefined}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperative' },
          { name: 'Branches' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading && (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      )}
      {!loading && !error && branches.length === 0 && (
        <Alert severity="info">No branches have been added to this cooperative yet.</Alert>
      )}
      {!loading && !error && branches.length > 0 && (
        <Grid container spacing={3}>
          {branches.map((branch) => (
            <Grid key={branch.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ p: 3, height: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Box>
                    <Typography variant="h6">{branch.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{branch.code}</Typography>
                  </Box>
                  <Chip
                    label={branch.status}
                    size="small"
                    color={branch.status === 'active' ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Stack>

                <Stack spacing={1} sx={{ mt: 2, flexGrow: 1 }}>
                  {branch.is_head_office && <Chip label="Head office" size="small" color="primary" sx={{ alignSelf: 'flex-start' }} />}
                  <Typography variant="body2">
                    <strong>Location:</strong> {[branch.county?.name, branch.sub_county, branch.ward].filter(Boolean).join(', ')}
                  </Typography>
                  {branch.address_line && <Typography variant="body2"><strong>Address:</strong> {branch.address_line}</Typography>}
                  {branch.contact_phone && <Typography variant="body2"><strong>Phone:</strong> {branch.contact_phone}</Typography>}
                  {branch.contact_email && <Typography variant="body2"><strong>Email:</strong> {branch.contact_email}</Typography>}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleCreateBranch}>
          <DialogTitle>Add cooperative branch</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
              <TextField label="Branch name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <TextField label="Branch code" required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} />
              <TextField select label="County" required value={form.county_id} onChange={(event) => setForm({ ...form, county_id: Number(event.target.value) })}>
                {counties.map((county) => <MenuItem key={county.id} value={county.id}>{county.name}</MenuItem>)}
              </TextField>
              <TextField label="Sub-county" required value={form.sub_county} onChange={(event) => setForm({ ...form, sub_county: event.target.value })} />
              <TextField label="Ward" value={form.ward} onChange={(event) => setForm({ ...form, ward: event.target.value })} />
              <TextField label="Phone" required value={form.contact_phone} onChange={(event) => setForm({ ...form, contact_phone: event.target.value })} />
              <TextField label="Email" type="email" value={form.contact_email} onChange={(event) => setForm({ ...form, contact_email: event.target.value })} />
              <TextField label="Address" multiline value={form.address_line} onChange={(event) => setForm({ ...form, address_line: event.target.value })} />
              <TextField select label="Office type" value={String(form.is_head_office)} onChange={(event) => setForm({ ...form, is_head_office: event.target.value === 'true' })}>
                <MenuItem value="false">Branch office</MenuItem>
                <MenuItem value="true">Head office</MenuItem>
              </TextField>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <LoadingButton type="submit" variant="contained" loading={saving}>Save branch</LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </DashboardContent>
  );
}
