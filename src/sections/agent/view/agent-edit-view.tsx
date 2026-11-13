'use client';

import { useEffect } from 'react';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { Iconify } from '@/components/iconify';
import { AgentNewEditForm } from '../agent-new-edit-form';

export function AgentEditView({ agent }: { agent: any }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit agent"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Agents', href: paths.dashboard.agents.list },
          { name: 'Edit agent' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AgentNewEditForm currentAgent={agent} />
    </DashboardContent>
  );
}
