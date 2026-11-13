import type { IAgentFormData } from '@/types/agent';

import { z as zod } from 'zod';
import { paths } from '@/routes/paths';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/routes/hooks';
import { Label } from '@/components/label';
import { toast } from '@/components/snackbar';
import { useAgentStore } from '@/store/agentStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Field, schemaHelper } from '@/components/hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

export type NewAgentSchemaType = zod.infer<typeof NewAgentSchema>;

export const NewAgentSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }).email({ message: 'Invalid email!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  branch: zod.string().min(1, { message: 'Branch is required!' }),
  employee_number: zod.string().optional(),
  assigned_wards: zod.array(zod.string()).default([]),
});

type Props = {
  currentAgent?: IAgentFormData & { id: string; created_at?: string; status: string };
  onUpdated?: () => void;
};

export function AgentNewEditForm({ currentAgent, onUpdated }: Props) {
  const router = useRouter();

  const defaultValues: NewAgentSchemaType = {
    email: '',
    phone: '',
    branch: '',
    employee_number: '',
    assigned_wards: [],
  };

  const methods = useForm<NewAgentSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewAgentSchema),
    defaultValues,
    values: currentAgent,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAgent?.id) {
        await useAgentStore.getState().updateAgent(currentAgent.id, data);
        toast.success('Update success!');
      } else {
        await useAgentStore.getState().inviteAgent(data);
        toast.success('Agent invited successfully!');
        reset();
      }
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error(error);
      toast.error(currentAgent?.id ? 'Update failed!' : 'Invitation failed!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentAgent && (
              <Label
                color={
                  (currentAgent.status === 'active' && 'success') ||
                  (currentAgent.status === 'suspended' && 'warning') ||
                  'default'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {currentAgent.status || 'active'}
              </Label>
            )}

            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {currentAgent ? 'Edit Agent' : 'Invite Agent'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentAgent
                  ? `Agent since ${currentAgent.created_at ? new Date(currentAgent.created_at).toLocaleDateString() : 'N/A'}`
                  : 'New agents receive an invitation email'}
              </Typography>
            </Box>

            {currentAgent && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error" onClick={() => router.push(paths.dashboard.agents.list)}>
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
              <Field.Text
                name="email"
                label="Email"
                fullWidth
                disabled={!!currentAgent}
                helperText={currentAgent ? 'Email cannot be changed' : 'Agent will receive invitation at this email'}
              />
              <Field.Phone
                name="phone"
                label="Phone Number"
                fullWidth
                helperText="Kenyan mobile number"
              />

              <Field.Select name="branch" label="Branch" fullWidth>
                <MenuItem value="">Select branch</MenuItem>
                <MenuItem value="nairobi">Nairobi</MenuItem>
                <MenuItem value="mombasa">Mombasa</MenuItem>
                <MenuItem value="kisumu">Kisumu</MenuItem>
              </Field.Select>

              <Field.Text
                name="employee_number"
                label="Employee Number"
                fullWidth
                disabled
                helperText="Auto-generated"
              />

              <Field.Text
                name="assigned_wards"
                label="Assigned Wards"
                fullWidth
                helperText="Comma-separated ward names"
              />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {currentAgent ? 'Save Changes' : 'Invite Agent'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
