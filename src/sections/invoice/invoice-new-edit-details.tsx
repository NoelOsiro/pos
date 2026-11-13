import type { IInvoiceItem } from '@/types/invoice';
import type { NewInvoiceSchemaType } from './invoice-new-edit-form';
import type { Control } from 'react-hook-form';

import { sumBy } from 'es-toolkit';
import { useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { Field } from '@/components/hook-form';
import { Iconify } from '@/components/iconify';

import { InvoiceTotalSummary } from './invoice-total-summary';

export const defaultItem: Omit<IInvoiceItem, 'id'> = {
  productId: '',
  sku: '',
  name: '',
  quantity: 1,
  unitPrice: 0,
  lineTotal: 0,
};

const getFieldNames = (index: number) => ({
  productId: `items.${index}.productId` as const,
  sku: `items.${index}.sku` as const,
  name: `items.${index}.name` as const,
  quantity: `items.${index}.quantity` as const,
  unitPrice: `items.${index}.unitPrice` as const,
  lineTotal: `items.${index}.lineTotal` as const,
});

export function InvoiceNewEditDetails() {
  const { control, setValue } = useFormContext<NewInvoiceSchemaType>();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = useWatch({ control, name: 'items' }) ?? [];
  const tax = useWatch({ control, name: 'tax' }) ?? 0;
  const discount = useWatch({ control, name: 'discount' }) ?? 0;
  const subtotal = sumBy(items, (item) => item.quantity * item.unitPrice);
  const totalAmount = subtotal + tax - discount;

  useEffect(() => {
    setValue('subtotal', subtotal);
    setValue('totalAmount', totalAmount);
  }, [setValue, subtotal, totalAmount]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <InvoiceItem
            key={item.id}
            control={control}
            fieldNames={getFieldNames(index)}
            onRemoveItem={() => remove(index)}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Box
        sx={{
          gap: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => append({ ...defaultItem })}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>

        <Box
          sx={{
            gap: 2,
            width: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Field.Text
            size="small"
            label="Tax amount"
            name="tax"
            type="number"
            sx={{ maxWidth: { md: 140 } }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Field.Text
            size="small"
            label="Discount"
            name="discount"
            type="number"
            sx={{ maxWidth: { md: 140 } }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </Box>

      <InvoiceTotalSummary
        taxAmount={tax}
        subtotal={subtotal}
        discount={discount}
        totalAmount={totalAmount}
      />
    </Box>
  );
}

type InvoiceItemProps = {
  control: Control<NewInvoiceSchemaType>;
  onRemoveItem: () => void;
  fieldNames: ReturnType<typeof getFieldNames>;
};

function InvoiceItem({ control, onRemoveItem, fieldNames }: InvoiceItemProps) {
  const { setValue } = useFormContext<NewInvoiceSchemaType>();
  const unitPrice = useWatch({ control, name: fieldNames.unitPrice }) ?? 0;
  const quantity = useWatch({ control, name: fieldNames.quantity }) ?? 0;

  useEffect(() => {
    setValue(fieldNames.lineTotal, Number((unitPrice * quantity).toFixed(2)));
  }, [fieldNames.lineTotal, quantity, setValue, unitPrice]);

  return (
    <Box
      sx={{
        gap: 1.5,
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          gap: 2,
          width: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Field.Text size="small" name={fieldNames.productId} label="Product ID" />
        <Field.Text size="small" name={fieldNames.sku} label="SKU" />
        <Field.Text size="small" name={fieldNames.name} label="Product name" />
        <Field.Text
          size="small"
          type="number"
          name={fieldNames.quantity}
          label="Quantity"
          sx={{ maxWidth: { md: 96 } }}
        />
        <Field.Text
          size="small"
          type="number"
          name={fieldNames.unitPrice}
          label="Unit price"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                </InputAdornment>
              ),
            },
          }}
          sx={{ maxWidth: { md: 120 } }}
        />
        <Field.Text
          disabled
          size="small"
          name={fieldNames.lineTotal}
          type="number"
          label="Total"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            maxWidth: { md: 128 },
            [`& .${inputBaseClasses.input}`]: { textAlign: { md: 'right' } },
          }}
        />
      </Box>

      <Button
        size="small"
        color="error"
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        onClick={onRemoveItem}
      >
        Remove
      </Button>
    </Box>
  );
}
