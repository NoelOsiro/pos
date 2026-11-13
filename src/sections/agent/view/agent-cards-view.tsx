'use client';

import type { IAgentItem } from '@/types/agent';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { useAgentStore } from '@/store/agentStore';
import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';

export function AgentCardsView() {
  const { agents, fetchAgents, loading } = useAgentStore(
    useShallow((state) => ({
      agents: state.agents,
      fetchAgents: state.fetchAgents,
      loading: state.loading,
    }))
  );

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Agents"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Agents', href: paths.dashboard.agents.list },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.agents.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Invite Agent
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
        {agents.map((agent) => (
          <Card key={agent.id} sx={{ p: 3 }}>
            <Typography variant="h6">{agent.full_name}</Typography>
            <Typography variant="body2" color="text.secondary">{agent.email}</Typography>
            <Typography variant="body2">{agent.employee_number}</Typography>
            <Typography variant="body2">{agent.branch_name}</Typography>
            <Typography variant="body2">{agent.phone}</Typography>
            <Label variant="soft" color={agent.status === 'active' ? 'success' : 'warning'}>
              {agent.status}
            </Label>
          </Card>
        ))}
      </Box>
    </DashboardContent>
  );
}
