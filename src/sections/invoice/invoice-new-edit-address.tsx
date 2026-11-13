import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import type { NewInvoiceSchemaType } from './invoice-new-edit-form';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

export function InvoiceNewEditAddress() {
  const { register } = useFormContext<NewInvoiceSchemaType>();

  return (
    <Box
      sx={{
        p: 3,
        gap: 2,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      <TextField
        label="Customer name"
        required
        {...register('customerName')}
      />
      <TextField
        label="Customer ID"
        required
        {...register('customerId')}
      />
    </Box>
  );
}
