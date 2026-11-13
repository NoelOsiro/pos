import type { IFarmItem } from '@/types/farmer';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/snackbar';
import { useFarmStore } from '@/store/farmStore';
import { useFarmerStore } from '@/store/farmerStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Form, Field, schemaHelper } from '@/components/hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export type FarmQuickEditSchemaType = zod.infer<typeof FarmQuickEditSchema>;

export const FarmQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Farm name is required!' }),
  sector: zod.string().min(1, { message: 'Sector is required!' }),
  size_acres: zod.string().min(1, { message: 'Size is required!' }),
  county: schemaHelper.nullableInput(zod.number(), { message: 'County is required!' }),
  sub_county: zod.string().min(1, { message: 'Sub-county is required!' }),
  ward: zod.string().optional(),
  latitude: zod.string().nullable().optional(),
  longitude: zod.string().nullable().optional(),
  is_active: zod.boolean(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentFarm?: IFarmItem;
};

export function FarmQuickEditForm({ currentFarm, open, onClose }: Props) {
  const defaultValues: FarmQuickEditSchemaType = {
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

  const methods = useForm<FarmQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(FarmQuickEditSchema),
    defaultValues,
    values: currentFarm
      ? {
          name: currentFarm.name,
          sector: currentFarm.sector,
          size_acres: currentFarm.size_acres,
          county: currentFarm.county,
          sub_county: currentFarm.sub_county,
          ward: currentFarm.ward ?? '',
          latitude: currentFarm.latitude ?? '',
          longitude: currentFarm.longitude ?? '',
          is_active: currentFarm.is_active,
        }
      : undefined,
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
    if (!currentFarm) return;

    try {
      await useFarmStore.getState().editFarm({
        id: currentFarm.id,
        name: data.name,
        sector: data.sector,
        size_acres: data.size_acres,
        county: data.county,
        sub_county: data.sub_county,
        ward: data.ward,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
        is_active: data.is_active,
      });
      reset();
      onClose();
      toast.success('Update success!');
    } catch (error) {
      console.error(error);
      toast.error('Update failed!');
    }
  });

  if (!open) return null;

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Quick Edit Farm</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Editing farm: {currentFarm?.name} for {currentFarm?.farmer_name}
          </Alert>

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
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}