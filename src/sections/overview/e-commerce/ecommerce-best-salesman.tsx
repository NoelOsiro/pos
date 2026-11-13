import type { CardProps } from '@mui/material/Card';
import type { TableHeadCellProps } from '@/components/table';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency } from '@/utils/format-number';
import { fNumber } from '@/utils/format-number';

import { Label } from '@/components/label';
import { FlagIcon } from '@/components/flag-icon';
import { Scrollbar } from '@/components/scrollbar';
import { TableHeadCustom } from '@/components/table';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  showCountry?: boolean;
  headCells: TableHeadCellProps[];
  tableData: {
    id: string;
    name: string;
    rank: string;
    email: string;
    category: string;
    avatarUrl: string;
    countryCode: string;
    totalAmount: number;
    orders?: number;
  }[];
};

export function EcommerceBestSalesman({
  title,
  subheader,
  showCountry = true,
  tableData,
  headCells,
  sx,
  ...other
}: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 422 }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHeadCustom headCells={headCells} />

          <TableBody>
            {tableData.map((row) => (
              <RowItem key={row.id} row={row} showCountry={showCountry} />
            ))}
            {!tableData.length && (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary">
                    No completed sales yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: Props['tableData'][number];
  showCountry: boolean;
};

function RowItem({ row, showCountry }: RowItemProps) {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} src={row.avatarUrl} />
          {row.name}
        </Box>
      </TableCell>

      <TableCell>{row.category}</TableCell>

      {showCountry ? (
        <TableCell align="center">
          <FlagIcon code={row.countryCode} />
        </TableCell>
      ) : (
        <TableCell align="center">{fNumber(row.orders ?? 0)}</TableCell>
      )}

      <TableCell align="right">{fCurrency(row.totalAmount)}</TableCell>

      <TableCell align="right">
        <Label
          variant="soft"
          color={
            (row.rank === 'Top 1' && 'primary') ||
            (row.rank === 'Top 2' && 'secondary') ||
            (row.rank === 'Top 3' && 'info') ||
            (row.rank === 'Top 4' && 'warning') ||
            'error'
          }
        >
          {row.rank}
        </Label>
      </TableCell>
    </TableRow>
  );
}
