import type { Metadata } from 'next';

import { _jobs } from '@/_mock/_job';
import { CONFIG } from '@/global-config';

import { JobEditView } from '@/sections/job/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Job edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentJob = _jobs.find((job) => job.id === id);

  return <JobEditView job={currentJob} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
export const dynamic = 'force-dynamic';

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _jobs.map((job) => ({ id: job.id }));
  }
  return [];
}
