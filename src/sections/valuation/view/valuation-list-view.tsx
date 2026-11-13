'use client';

import { paths } from '@/routes/paths';
import { useState, useEffect } from 'react';
import { DashboardContent } from '@/layouts/dashboard';
import { fPercent, fCurrency } from '@/utils/format-number';
import api, { cooperativeEndpoints } from '@/auth/services/api';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

type Valuation = {
  id: string;
  collection_id: string;
  status: 'unpriced' | 'calculated' | 'approved' | 'voided';
  unpriced_reason: string;
  price_list_name: string | null;
  unit_price: string | null;
  gross_amount: string | null;
  collateral_value: string | null;
  ltv_percent: string;
  created_at: string;
};

type ValuationsResponse = {
  count: number;
  results: Valuation[];
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All valuations' },
  { value: 'unpriced', label: 'Unpriced' },
  { value: 'calculated', label: 'Calculated' },
  { value: 'approved', label: 'Approved' },
  { value: 'voided', label: 'Voided' },
];

const STATUS_COLORS: Record<Valuation['status'], 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  unpriced: 'warning',
  calculated: 'info',
  approved: 'success',
  voided: 'error',
};

const TABLE_HEAD = ['Collection', 'Status', 'Price list', 'Gross amount', 'Collateral', 'LTV', 'Created'];

export function ValuationListView() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api
      .get<ValuationsResponse>(cooperativeEndpoints.valuations, {
        params: {
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          ...(status !== 'all' ? { status } : {}),
        },
      })
      .then(({ data }) => {
        if (active) {
          setValuations(data.results);
          setCount(data.count);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load valuations.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, rowsPerPage, status]);

  const handleStatusChange = (_event: React.SyntheticEvent, value: string) => {
    setStatus(value);
    setPage(0);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Valuations"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Valuations', href: paths.dashboard.valuations.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={status}
          onChange={handleStatusChange}
          variant="scrollable"
          sx={{ px: 2.5, boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.grey['500Channel']}` }}
        >
          {STATUS_OPTIONS.map((option) => (
            <Tab key={option.value} value={option.value} label={option.label} />
          ))}
        </Tabs>

        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? null : valuations.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No valuations found for this selection.</Alert>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((heading) => <TableCell key={heading}>{heading}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuations.map((valuation) => (
                    <TableRow key={valuation.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {valuation.collection_id.slice(0, 8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={valuation.status}
                          color={STATUS_COLORS[valuation.status]}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                        {valuation.unpriced_reason && (
                          <Typography display="block" variant="caption" color="text.secondary">
                            {valuation.unpriced_reason.replaceAll('_', ' ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{valuation.price_list_name || '—'}</TableCell>
                      <TableCell>{valuation.gross_amount ? fCurrency(valuation.gross_amount, { currency: 'KES' }) : '—'}</TableCell>
                      <TableCell>{valuation.collateral_value ? fCurrency(valuation.collateral_value, { currency: 'KES' }) : '—'}</TableCell>
                      <TableCell>{fPercent(valuation.ltv_percent)}</TableCell>
                      <TableCell>{new Date(valuation.created_at).toLocaleDateString()}</TableCell>
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
