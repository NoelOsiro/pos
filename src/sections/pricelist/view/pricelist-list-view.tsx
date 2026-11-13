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
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

type PriceEntry = {
  id: string;
  grade: string;
  unit: string;
  unit_price: string;
};

type PriceList = {
  id: string;
  name: string;
  sector_name: string;
  effective_from: string;
  effective_to: string | null;
  status: 'draft' | 'approved' | 'superseded';
  currency: string;
  entries: PriceEntry[];
};

type PageResponse = { count: number; results: PriceList[] };

const COLOR = { draft: 'warning', approved: 'success', superseded: 'default' } as const;

export function PriceListListView() {
  const router = useRouter();
  const [items, setItems] = useState<PriceList[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.get<PageResponse>(cooperativeEndpoints.priceLists, {
      params: { limit: rowsPerPage, offset: page * rowsPerPage, ordering: '-effective_from' },
    }).then(({ data }) => {
      if (active) {
        setItems(data.results);
        setCount(data.count);
      }
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load price lists.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [page, rowsPerPage]);

  const approve = async (priceList: PriceList) => {
    setActingOn(priceList.id);
    try {
      await api.post(`${cooperativeEndpoints.priceLists}${priceList.id}/approve/`);
      toast.success('Price list approved.');
      setItems((current) => current.map((item) => (
        item.id === priceList.id ? { ...item, status: 'approved' } : item
      )));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not approve price list.');
    } finally {
      setActingOn(null);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Price lists"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Price lists' },
        ]}
        action={<Button variant="contained" onClick={() => router.push(paths.dashboard.pricelists.new)}>New price list</Button>}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : items.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No price lists have been created yet.</Alert>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow>
                    {['Name', 'Sector', 'Effective', 'Grades', 'Status', ''].map((label) => <TableCell key={label}>{label}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.currency}</Typography>
                      </TableCell>
                      <TableCell>{item.sector_name}</TableCell>
                      <TableCell>
                        {new Date(item.effective_from).toLocaleDateString()}
                        {item.effective_to ? ` – ${new Date(item.effective_to).toLocaleDateString()}` : ' – Open'}
                      </TableCell>
                      <TableCell>{item.entries.map((entry) => `${entry.grade}: ${entry.unit_price}/${entry.unit}`).join(', ')}</TableCell>
                      <TableCell><Chip size="small" variant="outlined" label={item.status} color={COLOR[item.status]} sx={{ textTransform: 'capitalize' }} /></TableCell>
                      <TableCell align="right">
                        {item.status === 'draft' && (
                          <Button size="small" onClick={() => approve(item)} disabled={actingOn !== null}>
                            {actingOn === item.id ? 'Approving…' : 'Approve'}
                          </Button>
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
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}
