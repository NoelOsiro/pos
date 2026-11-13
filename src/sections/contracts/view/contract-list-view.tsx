'use client';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { useAuthUser } from '@/auth/hooks';
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

type ContractStatus = 'draft' | 'pending_approval' | 'active' | 'suspended' | 'expired' | 'terminated' | 'superseded';
type ContractLine = { sector_name: string; grade: string; unit: string; price_basis: string; unit_price: string | null };
type BuyerContract = {
  id: string;
  reference: string;
  buyer_name: string;
  title: string;
  start_date: string;
  end_date: string;
  status: ContractStatus;
  lines: ContractLine[];
  documents: { id: string; original_name: string; kind: string }[];
};
type ListResponse = { count: number; results: BuyerContract[] };

const STATUSES: Array<ContractStatus | 'all'> = ['all', 'draft', 'pending_approval', 'active', 'suspended', 'expired', 'terminated', 'superseded'];
const STATUS_COLORS: Record<ContractStatus, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  draft: 'default',
  pending_approval: 'warning',
  active: 'success',
  suspended: 'error',
  expired: 'default',
  terminated: 'default',
  superseded: 'default',
};
type ReasonAction = 'reject' | 'suspend' | 'terminate';

export function ContractListView() {
  const router = useRouter();
  const { hasPermission } = useAuthUser();
  const [contracts, setContracts] = useState<BuyerContract[]>([]);
  const [count, setCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reasonDialog, setReasonDialog] = useState<{ contract: BuyerContract; action: ReasonAction } | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.get<ListResponse>(cooperativeEndpoints.contracts, {
      params: {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      },
    }).then(({ data }) => {
      if (active) {
        setContracts(data.results);
        setCount(data.count);
      }
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load contracts.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [page, refresh, rowsPerPage, statusFilter]);

  const runAction = async (contract: BuyerContract, action: string, payload?: Record<string, string>) => {
    setActingOn(contract.id);
    setError(null);
    try {
      await api.post(`${cooperativeEndpoints.contracts}${contract.id}/${action}/`, payload ?? {});
      toast.success(`Contract ${action.replaceAll('_', ' ')} successfully.`);
      setRefresh((value) => value + 1);
      setReasonDialog(null);
      setReason('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `Could not ${action} contract.`);
    } finally {
      setActingOn(null);
    }
  };

  const startReasonAction = (contract: BuyerContract, action: ReasonAction) => {
    setReason('');
    setReasonDialog({ contract, action });
  };

  const downloadDocument = async (contract: BuyerContract, documentId: string) => {
    setActingOn(contract.id);
    setError(null);
    try {
      const { data } = await api.get<{ url: string }>(
        `${cooperativeEndpoints.contracts}${contract.id}/documents/${documentId}/download/`
      );
      const link = window.document.createElement('a');
      link.href = data.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not download contract document.');
    } finally {
      setActingOn(null);
    }
  };

  const submitReasonAction = () => {
    if (!reasonDialog) return;
    void runAction(reasonDialog.contract, reasonDialog.action, { reason });
  };

  const renderActions = (contract: BuyerContract) => {
    const actions: React.ReactNode[] = [];
    if (contract.status === 'draft' && hasPermission('contract.manage')) {
      actions.push(<Button key="submit" size="small" onClick={() => runAction(contract, 'submit')} disabled={actingOn !== null}>Submit</Button>);
    }
    if (contract.status === 'pending_approval' && hasPermission('contract.approve')) {
      actions.push(<Button key="approve" size="small" color="success" onClick={() => runAction(contract, 'approve')} disabled={actingOn !== null}>Approve</Button>);
      actions.push(<Button key="reject" size="small" color="error" onClick={() => startReasonAction(contract, 'reject')} disabled={actingOn !== null}>Reject</Button>);
    }
    if (contract.status === 'active' && hasPermission('contract.approve')) {
      actions.push(<Button key="suspend" size="small" onClick={() => startReasonAction(contract, 'suspend')} disabled={actingOn !== null}>Suspend</Button>);
      actions.push(<Button key="terminate" size="small" color="error" onClick={() => startReasonAction(contract, 'terminate')} disabled={actingOn !== null}>Terminate</Button>);
    }
    if (contract.status === 'suspended' && hasPermission('contract.approve')) {
      actions.push(<Button key="reinstate" size="small" onClick={() => runAction(contract, 'reinstate')} disabled={actingOn !== null}>Reinstate</Button>);
    }
    if (contract.status === 'active' && hasPermission('contract.manage')) {
      actions.push(<Button key="amend" size="small" onClick={() => runAction(contract, 'amend')} disabled={actingOn !== null}>Amend</Button>);
    }
    return <StackRow>{actions}</StackRow>;
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Buyer contracts"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Commercial' },
          { name: 'Contracts' },
        ]}
        action={hasPermission('contract.manage') ? (
          <Button variant="contained" onClick={() => router.push(paths.dashboard.contracts.new)}>New contract</Button>
        ) : undefined}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TextField select size="small" label="Status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as ContractStatus | 'all'); setPage(0); }} sx={{ minWidth: 180 }}>
            {STATUSES.map((item) => <MenuItem key={item} value={item}>{item === 'all' ? 'All statuses' : item.replaceAll('_', ' ')}</MenuItem>)}
          </TextField>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : contracts.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No contracts match this status.</Alert>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 980 }}>
                <TableHead><TableRow>{['Reference', 'Buyer / title', 'Term', 'Covered produce', 'Status', 'Documents', 'Actions'].map((title) => <TableCell key={title}>{title}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id} hover>
                      <TableCell><Typography variant="body2" fontWeight={700}>{contract.reference}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{contract.buyer_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{contract.title}</Typography>
                      </TableCell>
                      <TableCell>{contract.start_date} – {contract.end_date}</TableCell>
                      <TableCell>{contract.lines.map((line) => (
                        `${line.sector_name}${line.grade ? ` · ${line.grade}` : ''} — ${
                          line.price_basis === 'fixed' ? `${line.unit_price} KES/${line.unit}` : 'floating'
                        }`
                      )).join('; ')}</TableCell>
                      <TableCell><Chip size="small" color={STATUS_COLORS[contract.status]} label={contract.status.replaceAll('_', ' ')} sx={{ textTransform: 'capitalize' }} /></TableCell>
                      <TableCell>
                        {contract.documents.length ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {contract.documents.map((document) => (
                              <Button key={document.id} size="small" disabled={actingOn !== null} onClick={() => downloadDocument(contract, document.id)}>
                                {document.original_name}
                              </Button>
                            ))}
                          </Box>
                        ) : '—'}
                      </TableCell>
                      <TableCell>{renderActions(contract)}</TableCell>
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
      <Dialog open={reasonDialog !== null} onClose={() => !actingOn && setReasonDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>{reasonDialog?.action === 'reject' ? 'Reject contract' : reasonDialog?.action === 'suspend' ? 'Suspend contract' : 'Terminate contract'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Reason" value={reason} onChange={(event) => setReason(event.target.value)} fullWidth multiline minRows={3} required sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setReasonDialog(null)} disabled={actingOn !== null}>Cancel</Button>
          <LoadingButton variant="contained" color={reasonDialog?.action === 'reject' || reasonDialog?.action === 'terminate' ? 'error' : 'primary'} loading={actingOn !== null} disabled={!reason.trim()} onClick={submitReasonAction}>Confirm</LoadingButton>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

function StackRow({ children }: { children: React.ReactNode[] }) {
  return <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>{children}</Box>;
}
