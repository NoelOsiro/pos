'use client';

import type { IInvoice } from '@/types/invoice';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import type { FieldError, Resolver } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { toNestErrors } from '@hookform/resolvers';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import { today } from '@/utils/format-time';

import { Form, schemaHelper } from '@/components/hook-form';

import { InvoiceNewEditAddress } from './invoice-new-edit-address';
import { InvoiceNewEditStatusDate } from './invoice-new-edit-status-date';
import { defaultItem, InvoiceNewEditDetails } from './invoice-new-edit-details';

export const NewInvoiceSchema = zod.object({
  customerId: zod.string().min(1, { message: 'Customer ID is required!' }),
  customerName: zod.string().min(1, { message: 'Customer name is required!' }),
  createdAt: schemaHelper.date({ message: { required: 'Create date is required!' } }),
  dueDate: schemaHelper.date({ message: { required: 'Due date is required!' } }),
  items: zod.array(
    zod.object({
      productId: zod.string(),
      sku: zod.string(),
      name: zod.string().min(1, { message: 'Product name is required!' }),
      quantity: zod.number().int().positive(),
      unitPrice: zod.number().nonnegative(),
      lineTotal: zod.number().nonnegative(),
    }),
  ),
  tax: zod.number().nonnegative(),
  status: zod.string(),
  discount: zod.number().nonnegative(),
  subtotal: zod.number().nonnegative(),
  totalAmount: zod.number().nonnegative(),
  invoiceNumber: zod.string(),
  orderId: zod.string().optional(),
});

export type NewInvoiceSchemaType = zod.infer<typeof NewInvoiceSchema>;

const invoiceResolver: Resolver<NewInvoiceSchemaType> = async (values, _context, options) => {
  const result = await NewInvoiceSchema.safeParseAsync(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const fieldErrors = result.error.issues.reduce<Record<string, FieldError>>((errors, issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = { type: issue.code, message: issue.message };
    }
    return errors;
  }, {});

  return { values: {}, errors: toNestErrors(fieldErrors, options) };
};

type Props = {
  currentInvoice?: IInvoice;
};

export function InvoiceNewEditForm({ currentInvoice }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const defaultValues: NewInvoiceSchemaType = {
    invoiceNumber: 'INV-1990',
    customerId: '',
    customerName: '',
    createdAt: today(),
    dueDate: null,
    tax: 0,
    status: 'draft',
    discount: 0,
    orderId: '',
    subtotal: 0,
    totalAmount: 0,
    items: [{ ...defaultItem }],
  };

  const methods = useForm<NewInvoiceSchemaType>({
    mode: 'all',
    resolver: invoiceResolver,
    defaultValues,
    values: currentInvoice,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
    } finally {
      loadingSend.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Card>
        <InvoiceNewEditAddress />
        <InvoiceNewEditStatusDate />
        <InvoiceNewEditDetails />
      </Card>

      <Box sx={{ mt: 3, gap: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as draft
        </LoadingButton>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice ? 'Update' : 'Create'} & send
        </LoadingButton>
      </Box>
    </Form>
  );
}
