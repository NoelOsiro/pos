import type { IAgentItem } from '@/types/agent';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';

type Props = {
  agent: IAgentItem;
};

export function AgentCard({ agent }: Props) {
  return (
    <Card sx={{ p: 3, height: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{agent.full_name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {agent.email}
          </Typography>
        </Box>
        <Label
          variant="soft"
          color={
            (agent.status === 'active' && 'success') ||
            (agent.status === 'suspended' && 'warning') ||
            'default'
          }
        >
          {agent.status}
        </Label>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Employee:</strong> {agent.employee_number}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Branch:</strong> {agent.branch_name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Phone:</strong> {agent.phone}
        </Typography>
        {agent.assigned_wards.length > 0 && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Wards:</strong> {agent.assigned_wards.join(', ')}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.agents.edit(agent.id)}
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:pen-bold" />}
        >
          Edit
        </Button>
      </Box>
    </Card>
  );
}
