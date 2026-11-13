import type { IAgentItem } from '@/types/agent';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/snackbar';
import { Form, Field } from '@/components/hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

type Props = {
  agent: IAgentItem;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function AgentQuickEditForm({ agent, open, onClose, onUpdated }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const methods = useForm();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Quick edit is not fully implemented - use full edit form
      toast.info('Please use the full edit form');
      onClose();
      if (onUpdated) onUpdated();
    } catch {
      toast.error('Update failed!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quick Edit Agent</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Quick edit is limited. Use the full edit form for complete editing.
          </Typography>
          <Form methods={methods} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="phone" label="Phone" fullWidth />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Select name="branch" label="Branch" fullWidth>
                  <MenuItem value="">Select branch</MenuItem>
                  <MenuItem value="nairobi">Nairobi</MenuItem>
                  <MenuItem value="mombasa">Mombasa</MenuItem>
                </Field.Select>
              </Grid>
            </Grid>
          </Form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton variant="contained" loading={submitting} onClick={handleSubmit}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
