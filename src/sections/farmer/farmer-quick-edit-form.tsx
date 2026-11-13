import type { IFarmerItem, IFarmerFormData } from '@/types/farmer';
import type { IFarmerStatusOption } from '@/types/farmer';

import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { FARMER_STATUS_OPTIONS, FARMER_GENDER_OPTIONS } from '@/types/farmer';

import { toast } from '@/components/snackbar';
import { Form, Field, schemaHelper } from '@/components/hook-form';

import { useFarmerStore } from '@/store/farmerStore';
import { Iconify } from '@/components/iconify';

export type FarmerQuickEditSchemaType = zod.infer<typeof FarmerQuickEditSchema>;

export const FarmerQuickEditSchema = zod.object({
  first_name: zod.string().min(1, { message: 'First name is required!' }),
  last_name: zod.string().min(1, { message: 'Last name is required!' }),
  national_id: zod.string().min(7, { message: 'National ID must be at least 7 digits!' }).max(8, { message: 'National ID must be at most 8 digits!' }),
  phone: zod.string().min(1, { message: 'Phone is required!' }),
  payout_phone: zod.string().optional(),
  gender: zod.enum(['female', 'male', 'other', '']),
  date_of_birth: zod.string().nullable().optional(),
  county: schemaHelper.nullableInput(zod.number(), { message: 'County is required!' }),
  sub_county: zod.string().min(1, { message: 'Sub-county is required!' }),
  ward: zod.string().optional(),
  village: zod.string().optional(),
  status: zod.string(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentFarmer?: IFarmerItem;
  onApprove: (status: string, reason?: string) => void;
};

export function FarmerQuickEditForm({ currentFarmer, open, onClose, onApprove }: Props) {
  const defaultValues: FarmerQuickEditSchemaType = {
    first_name: '',
    last_name: '',
    national_id: '',
    phone: '',
    payout_phone: '',
    gender: '',
    date_of_birth: null,
    county: null,
    sub_county: '',
    ward: '',
    village: '',
    status: '',
  };

  const methods = useForm<FarmerQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(FarmerQuickEditSchema),
    defaultValues,
    values: currentFarmer
      ? {
          ...defaultValues,
          first_name: currentFarmer.first_name ?? '',
          last_name: currentFarmer.last_name ?? '',
          national_id: currentFarmer.national_id ?? '',
          phone: currentFarmer.phone ?? '',
          payout_phone: currentFarmer.payout_phone ?? '',
          gender: currentFarmer.gender ?? '',
          date_of_birth: currentFarmer.date_of_birth ?? null,
          county: currentFarmer.county ?? null,
          sub_county: currentFarmer.sub_county ?? '',
          ward: currentFarmer.ward ?? '',
          village: currentFarmer.village ?? '',
          status: currentFarmer.status ?? 'pending',
        }
      : defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleApprove = (status: string, reason?: string) => {
    if (!currentFarmer) return;
    onApprove(status, reason);
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!currentFarmer) return;

    try {
      await useFarmerStore.getState().editFarmer({ ...data, id: currentFarmer.id });
      reset();
      onClose();
      toast.success('Update success!');
    } catch (error) {
      console.error(error);
      toast.error('Update failed!');
    }
  });

  const counties = useFarmerStore((state) => state.counties);
  const fetchCounties = useFarmerStore((state) => state.fetchCounties);

  useEffect(() => {
    fetchCounties();
  }, [fetchCounties]);

  const validTransitions: Record<string, string[]> = {
    pending: ['active', 'exited'],
    active: ['suspended', 'exited'],
    suspended: ['active', 'exited'],
    exited: [],
  };

  const currentStatus = currentFarmer?.status || 'pending';
  const allowedStatuses = validTransitions[currentStatus] || [];

  if (!open) return null;

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Quick Edit Farmer</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Editing farmer: {currentFarmer?.member_number} - {currentFarmer?.first_name} {currentFarmer?.last_name}
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status" fullWidth>
              {FARMER_STATUS_OPTIONS.filter((s) => allowedStatuses.includes(s.value) || s.value === currentStatus).map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="first_name" label="First Name" />
            <Field.Text name="last_name" label="Last Name" />
            <Field.Text name="national_id" label="National ID" inputProps={{ maxLength: 8 }} />
            <Field.Phone name="phone" label="Phone" />
            <Field.Text name="payout_phone" label="Payout Phone (M-Pesa)" />

            <Field.Select name="gender" label="Gender" fullWidth>
              {FARMER_GENDER_OPTIONS.map((gender) => (
                <MenuItem key={gender.value} value={gender.value}>
                  {gender.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.DatePicker
              name="date_of_birth"
              label="Date of Birth"
              slotProps={{
                textField: { type: 'date' },
              }}
            />

            <Field.Select name="county" label="County" fullWidth>
              {counties.map((county) => (
                <MenuItem key={county.id} value={county.id}>
                  {county.name}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="sub_county" label="Sub-county" />
            <Field.Text name="ward" label="Ward" />
            <Field.Text name="village" label="Village" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          {currentFarmer && currentStatus === 'pending' && (
            <LoadingButton
              variant="contained"
              color="success"
              startIcon={<Iconify icon="solar:check-bold" />}
              onClick={() => handleApprove('active')}
              loading={isSubmitting}
            >
              Approve
            </LoadingButton>
          )}

          {currentFarmer && currentStatus === 'active' && (
            <LoadingButton
              variant="contained"
              color="warning"
              startIcon={<Iconify icon="solar:pause-bold" />}
              onClick={() => {
                const reason = window.prompt('Reason for suspension:');
                if (reason) handleApprove('suspended', reason);
              }}
              loading={isSubmitting}
            >
              Suspend
            </LoadingButton>
          )}

          {currentFarmer && currentStatus === 'suspended' && (
            <LoadingButton
              variant="contained"
              color="success"
              startIcon={<Iconify icon="solar:play-bold" />}
              onClick={() => handleApprove('active')}
              loading={isSubmitting}
            >
              Reactivate
            </LoadingButton>
          )}

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}