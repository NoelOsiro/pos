import type { Metadata } from 'next';
import { CONFIG } from '@/global-config';

import { FarmerEditView } from '@/sections/farmer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit farmer | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <FarmerEditView id={id} />;
}

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';