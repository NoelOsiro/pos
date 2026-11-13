import type { IFarmerFormData } from '@/types/farmer';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import { Label } from '@/components/label';
import { toast } from '@/components/snackbar';
import { Form, Field, schemaHelper } from '@/components/hook-form';

import { FARMER_GENDER_OPTIONS } from '@/types/farmer';

import { useFarmerStore } from '@/store/farmerStore';

export type NewFarmerSchemaType = zod.infer<typeof NewFarmerSchema>;

export const NewFarmerSchema = zod.object({
  first_name: zod.string().min(1, { message: 'First name is required!' }),
  last_name: zod.string().min(1, { message: 'Last name is required!' }),
  national_id: zod.string().max(8, { message: 'National ID must be at most 8 digits!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  payout_phone: zod.string().optional(),
  gender: zod.enum(['female', 'male', 'other', '']),
  date_of_birth: zod.string().nullable().optional(),
  county: schemaHelper.nullableInput(zod.number(), { message: 'County is required!' }),
  sub_county: zod.string().min(1, { message: 'Sub-county is required!' }),
  ward: zod.string().optional(),
  village: zod.string().optional(),
});

type Props = {
  currentFarmer?: IFarmerFormData & { id: string; member_number?: string; national_id_masked?: string; status?: string; farm_count?: number; created_at?: string };
  onUpdated?: () => void;
};

export function FarmerNewEditForm({ currentFarmer, onUpdated }: Props) {
  const router = useRouter();

  const defaultValues: NewFarmerSchemaType = {
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
  };

  const methods = useForm<NewFarmerSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewFarmerSchema),
    defaultValues,
    values: currentFarmer
      ? { ...currentFarmer, national_id: '', county: currentFarmer.county ?? null }
      : undefined,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const counties = useFarmerStore((state) => state.counties);
  const fetchCounties = useFarmerStore((state) => state.fetchCounties);

  useEffect(() => {
    fetchCounties();
  }, [fetchCounties]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentFarmer?.id) {
        if (!/^\d{7,8}$/.test(data.national_id)) {
          toast.error('National ID must contain 7 or 8 digits');
          return;
        }
      } else if (data.national_id && !/^\d{7,8}$/.test(data.national_id)) {
        toast.error('National ID must contain 7 or 8 digits');
        return;
      }
      if (currentFarmer?.id) {
        await useFarmerStore.getState().editFarmer({ ...data, id: currentFarmer.id });
        toast.success('Update success!');
      } else {
        const newFarmer = await useFarmerStore.getState().addFarmer(data);
        toast.success('Farmer registered successfully!');
        router.push(paths.dashboard.farmers.edit(newFarmer.id));
      }
      reset();
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error(error);
      toast.error(currentFarmer?.id ? 'Update failed!' : 'Registration failed!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentFarmer && (
              <Label
                color={
                  (currentFarmer.status === 'active' && 'success') ||
                  (currentFarmer.status === 'pending' && 'warning') ||
                  (currentFarmer.status === 'suspended' && 'warning') ||
                  (currentFarmer.status === 'exited' && 'default') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {currentFarmer.status || 'pending'}
              </Label>
            )}

            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {currentFarmer ? 'Edit Farmer' : 'Register Farmer'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentFarmer
                  ? `Member: ${currentFarmer.member_number} | ${currentFarmer.farm_count || 0} farms`
                  : 'New farmers start with "Pending" status'}
              </Typography>
            </Box>

            {currentFarmer && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error" onClick={() => router.push(paths.dashboard.farmers.list)}>
                  Back to List
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="first_name" label="First Name" fullWidth />
              <Field.Text name="last_name" label="Last Name" fullWidth />

              <Field.Text
                name="national_id"
                label="National ID"
                fullWidth
                            inputProps={{ maxLength: 8, placeholder: currentFarmer ? (currentFarmer.national_id_masked || 'Enter a replacement ID') : '7-8 digits' }}
                helperText={currentFarmer ? `Current ID: ${currentFarmer.national_id_masked || 'masked'} — leave blank to keep it unchanged` : '7-8 digit Kenyan National ID'}
              />

              <Field.Phone
                name="phone"
                label="Phone Number"
                fullWidth
                helperText="Kenyan mobile number (e.g., 0712345678 or +254712345678)"
              />

              <Field.Text
                name="payout_phone"
                label="Payout Phone (M-Pesa)"
                fullWidth
                helperText="Defaults to phone number if not provided"
              />

              <Field.Select
                name="gender"
                label="Gender"
                fullWidth
              >
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
                  textField: { type: 'date', InputLabelProps: { shrink: true } },
                }}
              />

              <Field.Select
                name="county"
                label="County"
                fullWidth
                helperText="Select the county where the farmer is located"
              >
                {counties.map((county) => (
                  <MenuItem key={county.id} value={county.id}>
                    {county.name}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="sub_county" label="Sub-county" fullWidth />
              <Field.Text name="ward" label="Ward" />
              <Field.Text name="village" label="Village" />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {currentFarmer ? 'Save Changes' : 'Register Farmer'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}