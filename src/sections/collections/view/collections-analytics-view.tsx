'use client';

import { paths } from '@/routes/paths';
import { CONFIG } from '@/global-config';
import { useState, useEffect } from 'react';
import { DashboardContent } from '@/layouts/dashboard';
import api, { cooperativeEndpoints } from '@/auth/services/api';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { AnalyticsCurrentVisits } from '@/sections/overview/analytics/analytics-current-visits';
import { AnalyticsWebsiteVisits } from '@/sections/overview/analytics/analytics-website-visits';
import { AnalyticsWidgetSummary } from '@/sections/overview/analytics/analytics-widget-summary';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

type GroupTotal = {
  count: number;
  total_qty?: string | number;
  unit?: string;
  sector__name?: string;
  sector__code?: string;
  collection_point__name?: string;
  collection_point__code?: string;
  day?: string;
};
type SummaryResponse = {
  totals: { count: number };
  by_sector: GroupTotal[];
  by_point: GroupTotal[];
  by_day: GroupTotal[];
  by_day_unit: GroupTotal[];
  by_unit: GroupTotal[];
};

const toNumber = (value: string | number | null | undefined) => Number(value || 0);
const daysAgo = (days: number) => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toISOString().slice(0, 10);
};

export function CollectionsAnalyticsView() {
  const [from, setFrom] = useState(daysAgo(29));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [appliedFrom, setAppliedFrom] = useState(daysAgo(29));
  const [appliedTo, setAppliedTo] = useState(new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.get<SummaryResponse>(cooperativeEndpoints.collectionsSummary, {
      params: { from: appliedFrom, to: appliedTo },
    })
      .then(({ data }) => {
        if (active) setSummary(data);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load collection analytics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [appliedFrom, appliedTo]);

  const chartDays = summary?.by_day ?? [];
  const days = [...new Set((summary?.by_day_unit ?? []).map((item) => item.day ?? ''))];
  const units = [...new Set((summary?.by_day_unit ?? []).map((item) => item.unit ?? 'unit'))];
  const volumeChart = {
    categories: days,
    series: units.map((unit) => ({
      name: unit,
      data: days.map((day) => toNumber(summary?.by_day_unit.find((item) => item.day === day && item.unit === unit)?.total_qty)),
    })),
  };
  const sectorChart = {
    series: (summary?.by_sector ?? []).map((item) => ({
      label: item.sector__name || 'Unassigned',
      value: item.count,
    })),
  };
  const pointChart = {
    series: (summary?.by_point ?? []).slice(0, 8).map((item) => ({
      label: item.collection_point__name || 'Unnamed point',
      value: item.count,
    })),
  };

  const applyDates = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (from > to) {
      setError('Start date must be on or before end date.');
      return;
    }
    setError(null);
    setAppliedFrom(from);
    setAppliedTo(to);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Collections analytics"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Collections', href: paths.dashboard.collections.list },
          { name: 'Analytics' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card component="form" onSubmit={applyDates} sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>Choose a reporting period</Typography>
          <TextField size="small" label="From" type="date" value={from} onChange={(event) => setFrom(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField size="small" label="To" type="date" value={to} onChange={(event) => setTo(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <Button type="submit" variant="contained">Apply</Button>
        </Stack>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading && <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress /></Stack>}
      {!loading && summary && (
        <Grid container spacing={3}>
          {summary.by_unit.map((item) => (
            <Grid key={item.unit} size={{ xs: 12, sm: 6, md: 4 }}>
              <AnalyticsWidgetSummary
                title={`Collected quantity (${item.unit})`}
                total={toNumber(item.total_qty)}
                icon={<img alt={`Collected quantity (${item.unit})`} src={`${CONFIG.assetsDir}/icons/glass/ic-glass-bag.svg`} />}
                chart={{
                  categories: chartDays.map((day) => day.day ?? ''),
                  series: chartDays.map((day) => toNumber(summary.by_day_unit.find((quantity) => quantity.day === day.day && quantity.unit === item.unit)?.total_qty)),
                }}
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <AnalyticsWidgetSummary
              title="Recorded collections"
              total={summary.totals.count}
              color="secondary"
              icon={<img alt="Recorded collections" src={`${CONFIG.assetsDir}/icons/glass/ic-glass-users.svg`} />}
              chart={{ categories: chartDays.map((item) => item.day ?? ''), series: chartDays.map((item) => item.count) }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <AnalyticsWidgetSummary
              title="Collection points used"
              total={summary.by_point.length}
              color="warning"
              icon={<img alt="Collection points" src={`${CONFIG.assetsDir}/icons/glass/ic-glass-buy.svg`} />}
              chart={{ categories: summary.by_point.map((item) => item.collection_point__name || ''), series: summary.by_point.map((item) => item.count) }}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <AnalyticsWebsiteVisits
              title="Daily collection activity"
              subheader={`${from} to ${to}`}
              valueLabel="quantity"
              chart={volumeChart}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsCurrentVisits title="Collections by sector" chart={sectorChart} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AnalyticsCurrentVisits title="Collections by point" chart={pointChart} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3, height: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Top collection points</Typography>
              <Stack spacing={1.5}>
                {(summary.by_point ?? []).slice(0, 6).map((item) => (
                  <Stack key={item.collection_point__code || item.collection_point__name} direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="body2">{item.collection_point__name || 'Unnamed point'}</Typography>
                    <Typography variant="body2" fontWeight={600}>{item.count} collections</Typography>
                  </Stack>
                ))}
                {summary.by_point.length === 0 && <Typography variant="body2" color="text.secondary">No collections in this period.</Typography>}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}
      {!loading && !error && summary?.totals.count === 0 && <Alert severity="info" sx={{ mt: 3 }}>No recorded collections in this date range.</Alert>}
    </DashboardContent>
  );
}
