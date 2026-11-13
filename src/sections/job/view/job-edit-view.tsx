'use client';

import type { IJobItem } from '@/types/job';

import { paths } from '@/routes/paths';

import { DashboardContent } from '@/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { JobNewEditForm } from '../job-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

export function JobEditView({ job }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.job.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Job', href: paths.dashboard.job.root },
          { name: job?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobNewEditForm currentJob={job} />
    </DashboardContent>
  );
}
