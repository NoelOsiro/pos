import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { _packages } from '@/_mock/_package';

import { PackageEditView } from '@/sections/package/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Package edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentPackage = _packages.find((pkg) => pkg.id === id);

  return <PackageEditView package={currentPackage} />;
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
    return _packages.map((pkg) => ({ id: pkg.id }));
  }
  return [];
}
