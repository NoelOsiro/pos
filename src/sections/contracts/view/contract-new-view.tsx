'use client';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { useState, useEffect } from 'react';
import { toast } from '@/components/snackbar';
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
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

type Buyer = { id: string; name: string; status: 'active' | 'blocked' };
type BuyerResponse = { count: number; results: Buyer[] };
type CooperativeSector = { sector: { id: string; name: string } };
type SectorResponse = { sectors: CooperativeSector[] };
type ContractLineDraft = {
  sector: string;
  grade: string;
  unit: 'kg' | 'litre';
  price_basis: 'fixed' | 'floating';
  unit_price: string;
  min_quantity: string;
  max_quantity: string;
};

const newLine = (): ContractLineDraft => ({
  sector: '',
  grade: '',
  unit: 'kg',
  price_basis: 'fixed',
  unit_price: '',
  min_quantity: '',
  max_quantity: '',
});

export function ContractNewView() {
  const router = useRouter();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [sectors, setSectors] = useState<CooperativeSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyer, setBuyer] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [settlementMode, setSettlementMode] = useState<'platform' | 'direct'>('platform');
  const [boardRef, setBoardRef] = useState('');
  const [boardDate, setBoardDate] = useState('');
  const [lines, setLines] = useState<ContractLineDraft[]>([newLine()]);
  const [signedContract, setSignedContract] = useState<File | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get<BuyerResponse>(cooperativeEndpoints.buyers, { params: { limit: 200, status: 'active' } }),
      api.get<SectorResponse>(cooperativeEndpoints.sectors),
    ]).then(([{ data: buyerData }, { data: sectorData }]) => {
      if (active) {
        setBuyers(buyerData.results);
        setSectors(sectorData.sectors);
        setBuyer(buyerData.results[0]?.id ?? '');
        setLines([{ ...newLine(), sector: sectorData.sectors[0]?.sector.id ?? '' }]);
      }
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load buyers and sectors.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const uploadSignedContract = async (contractId: string) => {
    if (!signedContract) {
      setError('Choose the signed contract file to continue.');
      return;
    }
    const payload = new FormData();
    payload.append('kind', 'signed_contract');
    payload.append('file', signedContract);
    await api.post(`${cooperativeEndpoints.contracts}${contractId}/documents/`, payload);
    toast.success('Contract draft and private document saved.');
    router.push(paths.dashboard.contracts.root);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (endDate < startDate) {
      setError('End date must be on or after the start date.');
      return;
    }
    if (!signedContract && !draftId) {
      setError('A signed contract document is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let contractId = draftId;
      if (!contractId) {
        const { data } = await api.post<{ id: string }>(cooperativeEndpoints.contracts, {
          buyer,
          title,
          start_date: startDate,
          end_date: endDate,
          payment_terms_days: Number(paymentTerms),
          settlement_mode: settlementMode,
          currency: 'KES',
          board_resolution_ref: boardRef,
          board_resolution_date: boardDate || null,
          lines: lines.map((line) => ({
            ...line,
            grade: line.grade.trim(),
            unit_price: line.price_basis === 'fixed' ? line.unit_price : null,
            min_quantity: line.min_quantity || null,
            max_quantity: line.max_quantity || null,
          })),
        });
        contractId = data.id;
        setDraftId(contractId);
      }
      await uploadSignedContract(contractId);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not save contract.');
    } finally {
      setSaving(false);
    }
  };

  const updateLine = (index: number, changes: Partial<ContractLineDraft>) => {
    setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, ...changes } : line));
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New buyer contract"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Contracts', href: paths.dashboard.contracts.root },
          { name: 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loading ? <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress /></Stack> : (
        <form onSubmit={submit}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            {buyers.length === 0 && (
              <Alert severity="warning" action={<Button color="inherit" href={paths.dashboard.buyers.root}>Add buyer</Button>}>
                Add an active buyer before creating a contract.
              </Alert>
            )}
            {draftId && <Alert severity="info">Draft {draftId.slice(0, 8)} has been saved. Retry the private signed-document upload below.</Alert>}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contract terms</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField select label="Buyer" value={buyer} onChange={(event) => setBuyer(event.target.value)} required fullWidth disabled={!buyers.length || !!draftId}>
                    {buyers.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Contract title" value={title} onChange={(event) => setTitle(event.target.value)} required fullWidth disabled={!!draftId} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Start date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required fullWidth disabled={!!draftId} slotProps={{ inputLabel: { shrink: true } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="End date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required fullWidth disabled={!!draftId} slotProps={{ inputLabel: { shrink: true } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Payment terms (days)" type="number" inputProps={{ min: 0, max: 180 }} value={paymentTerms} onChange={(event) => setPaymentTerms(event.target.value)} required fullWidth disabled={!!draftId} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField select label="Settlement mode" value={settlementMode} onChange={(event) => setSettlementMode(event.target.value as 'platform' | 'direct')} fullWidth disabled={!!draftId}>
                    <MenuItem value="platform">Platform settlement</MenuItem><MenuItem value="direct">Direct to cooperative</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Board resolution reference" value={boardRef} onChange={(event) => setBoardRef(event.target.value)} fullWidth disabled={!!draftId} helperText="Required when cooperative governance settings require a board reference." />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Board resolution date" type="date" value={boardDate} onChange={(event) => setBoardDate(event.target.value)} fullWidth disabled={!!draftId} slotProps={{ inputLabel: { shrink: true } }} />
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6">Contract lines</Typography>
                  <Typography variant="body2" color="text.secondary">Prices are visible only to roles permitted to view contracts.</Typography>
                </Box>
                {!draftId && <Button onClick={() => setLines((current) => [...current, newLine()])}>Add line</Button>}
              </Stack>
              <Stack spacing={2}>
                {lines.map((line, index) => (
                  <Grid container spacing={1.5} key={index}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField select label="Sector" value={line.sector} onChange={(event) => updateLine(index, { sector: event.target.value })} required fullWidth disabled={!!draftId}>
                        {sectors.map((item) => <MenuItem key={item.sector.id} value={item.sector.id}>{item.sector.name}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <TextField label="Grade (blank = all)" value={line.grade} onChange={(event) => updateLine(index, { grade: event.target.value })} fullWidth disabled={!!draftId} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField select label="Unit" value={line.unit} onChange={(event) => updateLine(index, { unit: event.target.value as ContractLineDraft['unit'] })} fullWidth disabled={!!draftId}>
                        <MenuItem value="kg">kg</MenuItem><MenuItem value="litre">litre</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField select label="Price basis" value={line.price_basis} onChange={(event) => updateLine(index, { price_basis: event.target.value as ContractLineDraft['price_basis'], unit_price: '' })} fullWidth disabled={!!draftId}>
                        <MenuItem value="fixed">Fixed</MenuItem><MenuItem value="floating">Floating</MenuItem>
                      </TextField>
                    </Grid>
                    {line.price_basis === 'fixed' && (
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField label="Unit price (KES)" type="number" inputProps={{ min: '0.01', step: '0.01' }} value={line.unit_price} onChange={(event) => updateLine(index, { unit_price: event.target.value })} required fullWidth disabled={!!draftId} />
                      </Grid>
                    )}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField label="Minimum quantity" type="number" inputProps={{ min: '0.001', step: '0.001' }} value={line.min_quantity} onChange={(event) => updateLine(index, { min_quantity: event.target.value })} fullWidth disabled={!!draftId} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField label="Maximum quantity" type="number" inputProps={{ min: '0.001', step: '0.001' }} value={line.max_quantity} onChange={(event) => updateLine(index, { max_quantity: event.target.value })} fullWidth disabled={!!draftId} />
                    </Grid>
                    {!draftId && lines.length > 1 && <Grid size={{ xs: 12 }}><Button color="error" onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}>Remove line</Button></Grid>}
                  </Grid>
                ))}
              </Stack>
            </Card>
            {!draftId && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Signed agreement</Typography>
                <TextField
                  type="file"
                  required
                  fullWidth
                  inputProps={{ accept: 'application/pdf,image/jpeg,image/png' }}
                  onChange={(event) => setSignedContract((event.target as HTMLInputElement).files?.[0] ?? null)}
                  helperText="PDF, JPEG, or PNG; maximum 10 MB. The file is stored privately."
                />
              </Card>
            )}
            {draftId && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Signed agreement</Typography>
                <TextField type="file" required fullWidth inputProps={{ accept: 'application/pdf,image/jpeg,image/png' }} onChange={(event) => setSignedContract((event.target as HTMLInputElement).files?.[0] ?? null)} helperText="PDF, JPEG, or PNG; maximum 10 MB. The file is stored privately." />
              </Card>
            )}
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" onClick={() => router.push(paths.dashboard.contracts.root)}>Cancel</Button>
              <LoadingButton type="submit" variant="contained" loading={saving} disabled={loading || !buyers.length || !sectors.length}>
                {draftId ? 'Retry document upload' : 'Save draft'}
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      )}
    </DashboardContent>
  );
}
