import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { fCurrency, fNumber } from '@/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  earning?: number;
  refunded?: number;
  orderTotal?: number;
  currentBalance?: number;
  valueFormat?: 'number' | 'currency';
  rows?: {
    label: string;
    value: number;
    format?: 'number' | 'currency';
  }[];
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

export function EcommerceCurrentBalance({
  sx,
  title,
  earning,
  refunded,
  orderTotal,
  currentBalance,
  valueFormat = 'currency',
  rows,
  primaryAction,
  secondaryAction,
  ...other
}: Props) {
  const formatValue = (value: number, format: 'number' | 'currency') =>
    format === 'number' ? fNumber(value) : fCurrency(value);
  const row = (label: string, value: number, format = valueFormat) => (
    <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
      <Box component="span" sx={{ color: 'text.secondary' }}>
        {label}
      </Box>

      <Box component="span">{formatValue(value, format)}</Box>
    </Box>
  );
  const summaryRows = rows ?? [
    { label: 'Order total', value: orderTotal ?? 0 },
    { label: 'Earning', value: earning ?? 0 },
    { label: 'Refunded', value: refunded ?? 0 },
  ];

  return (
    <Card sx={[{ p: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>

      <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ typography: 'h3' }}>
          {formatValue(currentBalance ?? 0, valueFormat)}
        </Box>

        {summaryRows.map((item) => row(item.label, item.value, item.format ?? valueFormat))}

        <Box sx={{ gap: 2, display: 'flex' }}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            href={primaryAction?.href}
          >
            {primaryAction?.label ?? 'Request'}
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            href={secondaryAction?.href}
          >
            {secondaryAction?.label ?? 'Transfer'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
