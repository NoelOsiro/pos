import type { IFarmFormData } from '@/types/farmer';

import { z as zod } from 'zod';
import { paths } from '@/routes/paths';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/routes/hooks';
import { Label } from '@/components/label';
import { toast } from '@/components/snackbar';
import { useFarmStore } from '@/store/farmStore';
import { useFarmerStore } from '@/store/farmerStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Form, Field, schemaHelper } from '@/components/hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

export type NewFarmSchemaType = zod.infer<typeof NewFarmSchema>;

export const NewFarmSchema = zod.object({
  name: zod.string().min(1, { message: 'Farm name is required!' }),
  sector: zod.string().min(1, { message: 'Sector is required!' }),
  size_acres: zod.string().min(1, { message: 'Size is required!' }),
  county: schemaHelper.nullableInput(zod.number(), { message: 'County is required!' }),
  sub_county: zod.string().min(1, { message: 'Sub-county is required!' }),
  ward: zod.string().optional(),
  latitude: zod.string().optional(),
  longitude: zod.string().optional(),
  is_active: zod.boolean(),
});

type Props = {
  currentFarm?: IFarmFormData & { id: string; farmer_name?: string; sector_name?: string; is_active?: boolean };
  onUpdated?: () => void;
};

export function FarmNewEditForm({ currentFarm, onUpdated }: Props) {
  const router = useRouter();

  const defaultValues: NewFarmSchemaType = {
    name: '',
    sector: '',
    size_acres: '',
    county: null,
    sub_county: '',
    ward: '',
    latitude: '',
    longitude: '',
    is_active: true,
  };

  const methods = useForm<NewFarmSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewFarmSchema),
    defaultValues,
    values: currentFarm,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const counties = useFarmerStore((state) => state.counties);
  const fetchCounties = useFarmerStore((state) => state.fetchCounties);

  useEffect(() => {
    fetchCounties();
  }, [fetchCounties]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentFarm?.id) {
        await useFarmStore.getState().editFarm({ ...data, id: currentFarm.id });
        toast.success('Update success!');
      } else {
        const newFarm = await useFarmStore.getState().addFarm(data);
        toast.success('Farm created successfully!');
        router.push(paths.dashboard.farms.edit(newFarm.id));
      }
      reset();
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error(error);
      toast.error(currentFarm?.id ? 'Update failed!' : 'Creation failed!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {currentFarm ? 'Edit Farm' : 'Create Farm'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentFarm
                  ? `Farmer: ${currentFarm.farmer_name || 'Unknown'}`
                  : 'Farms are linked to a farmer'}
              </Typography>
            </Box>

            {currentFarm && (
              <Label
                color={currentFarm.is_active ? 'success' : 'default'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {currentFarm.is_active ? 'Active' : 'Inactive'}
              </Label>
            )}

            {currentFarm && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error" onClick={() => router.push(paths.dashboard.farms.list)}>
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
              <Field.Text name="name" label="Farm Name" fullWidth />
              <Field.Select name="sector" label="Sector" fullWidth>
                <MenuItem value="coffee">Coffee</MenuItem>
                <MenuItem value="tea">Tea</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                <MenuItem value="horticulture">Horticulture</MenuItem>
                <MenuItem value="livestock">Livestock</MenuItem>
                <MenuItem value="pisciculture">Fisheries</MenuItem>
                <MenuItem value="cereals">Cereals</MenuItem>
              </Field.Select>

              <Field.Text name="size_acres" label="Size (acres)" fullWidth />

              <Field.Select name="county" label="County" fullWidth>
                {counties.map((county) => (
                  <MenuItem key={county.id} value={county.id}>
                    {county.name}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="sub_county" label="Sub-county" fullWidth />
              <Field.Text name="ward" label="Ward" />

              <Field.Switch
                name="is_active"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Active
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Inactive farms are hidden from collections
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
                {currentFarm ? 'Save Changes' : 'Create Farm'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}