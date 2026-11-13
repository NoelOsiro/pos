'use client';

import { paths } from '@/routes/paths';
import { useState, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { DashboardContent } from '@/layouts/dashboard';
import api, { cooperativeEndpoints } from '@/auth/services/api';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

type BuyerType = 'processor' | 'factory' | 'exporter' | 'auction' | 'miller' | 'retailer' | 'other';
type Buyer = {
  id: string;
  name: string;
  buyer_type: BuyerType;
  registration_number: string;
  kra_pin: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  county: string;
  address: string;
  status: 'active' | 'blocked';
  blocked_reason: string;
};
type ListResponse = { count: number; results: Buyer[] };
type BuyerDraft = Omit<Buyer, 'id' | 'status' | 'blocked_reason'>;
const EMPTY_BUYER: BuyerDraft = {
  name: '',
  buyer_type: 'processor',
  registration_number: '',
  kra_pin: '',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  county: '',
  address: '',
};

export function BuyerListView() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<BuyerDraft>(EMPTY_BUYER);
  const [blockBuyer, setBlockBuyer] = useState<Buyer | null>(null);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.get<ListResponse>(cooperativeEndpoints.buyers, {
      params: { limit: rowsPerPage, offset: page * rowsPerPage },
    }).then(({ data }) => {
      if (active) {
        setBuyers(data.results);
        setCount(data.count);
      }
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load buyers.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [page, refresh, rowsPerPage]);

  const saveBuyer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post(cooperativeEndpoints.buyers, draft);
      toast.success('Buyer added.');
      setDraft(EMPTY_BUYER);
      setDialogOpen(false);
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not add buyer.');
    } finally {
      setSaving(false);
    }
  };

  const setBuyerStatus = async () => {
    if (!blockBuyer || !blockReason.trim()) return;
    setActingOn(blockBuyer.id);
    try {
      await api.post(`${cooperativeEndpoints.buyers}${blockBuyer.id}/block/`, { reason: blockReason });
      toast.success('Buyer blocked.');
      setBlockBuyer(null);
      setBlockReason('');
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not block buyer.');
    } finally {
      setActingOn(null);
    }
  };

  const unblock = async (buyer: Buyer) => {
    setActingOn(buyer.id);
    try {
      await api.post(`${cooperativeEndpoints.buyers}${buyer.id}/unblock/`);
      toast.success('Buyer unblocked.');
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not unblock buyer.');
    } finally {
      setActingOn(null);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Buyers"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Commercial' },
          { name: 'Buyers' },
        ]}
        action={<Button variant="contained" onClick={() => setDialogOpen(true)}>Add buyer</Button>}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : buyers.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No buyers have been added to this cooperative yet.</Alert>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead><TableRow>{['Buyer', 'Type', 'KRA PIN', 'Contact', 'Location', 'Status', ''].map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {buyers.map((buyer) => (
                    <TableRow key={buyer.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{buyer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{buyer.registration_number}</Typography>
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{buyer.buyer_type}</TableCell>
                      <TableCell>{buyer.kra_pin || '—'}</TableCell>
                      <TableCell>{buyer.contact_name || '—'}<br />{buyer.contact_phone}</TableCell>
                      <TableCell>{buyer.county || '—'}</TableCell>
                      <TableCell>
                        <Chip size="small" label={buyer.status} color={buyer.status === 'active' ? 'success' : 'error'} />
                        {buyer.blocked_reason && <Typography display="block" variant="caption">{buyer.blocked_reason}</Typography>}
                      </TableCell>
                      <TableCell align="right">
                        {buyer.status === 'active' ? (
                          <Button size="small" color="error" disabled={actingOn !== null} onClick={() => { setBlockBuyer(buyer); setBlockReason(''); }}>Block</Button>
                        ) : (
                          <Button size="small" disabled={actingOn !== null} onClick={() => unblock(buyer)}>Unblock</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
              onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }}
            />
          </>
        )}
      </Card>

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="md">
        <form onSubmit={saveBuyer}>
          <DialogTitle>Add buyer</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
              <TextField label="Buyer name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
              <TextField select label="Buyer type" value={draft.buyer_type} onChange={(event) => setDraft({ ...draft, buyer_type: event.target.value as BuyerType })}>
                {['processor', 'factory', 'exporter', 'auction', 'miller', 'retailer', 'other'].map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
              <TextField label="Registration number" value={draft.registration_number} onChange={(event) => setDraft({ ...draft, registration_number: event.target.value })} />
              <TextField label="KRA PIN" value={draft.kra_pin} onChange={(event) => setDraft({ ...draft, kra_pin: event.target.value.toUpperCase() })} inputProps={{ maxLength: 11 }} />
              <TextField label="Contact name" value={draft.contact_name} onChange={(event) => setDraft({ ...draft, contact_name: event.target.value })} />
              <TextField label="Contact phone" value={draft.contact_phone} onChange={(event) => setDraft({ ...draft, contact_phone: event.target.value })} />
              <TextField label="Contact email" type="email" value={draft.contact_email} onChange={(event) => setDraft({ ...draft, contact_email: event.target.value })} />
              <TextField label="County" value={draft.county} onChange={(event) => setDraft({ ...draft, county: event.target.value })} />
              <TextField label="Address" multiline value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} sx={{ gridColumn: { sm: '1 / -1' } }} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <LoadingButton type="submit" variant="contained" loading={saving}>Save buyer</LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={blockBuyer !== null} onClose={() => !actingOn && setBlockBuyer(null)} fullWidth maxWidth="xs">
        <DialogTitle>Block buyer</DialogTitle>
        <DialogContent><TextField autoFocus label="Reason" value={blockReason} onChange={(event) => setBlockReason(event.target.value)} fullWidth multiline minRows={3} required sx={{ mt: 1 }} /></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBlockBuyer(null)} disabled={actingOn !== null}>Cancel</Button>
          <LoadingButton variant="contained" color="error" loading={actingOn !== null} disabled={!blockReason.trim()} onClick={setBuyerStatus}>Block buyer</LoadingButton>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
