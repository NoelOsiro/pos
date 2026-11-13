import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { _userList } from '@/_mock/_user';

import { UserEditView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const currentUser = _userList.find((user) => user.id === id);

  return <UserEditView user={currentUser} />;
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
    return _userList.map((user) => ({ id: user.id }));
  }
  return [];
}
