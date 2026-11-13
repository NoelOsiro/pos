import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AccountGeneralView } from '@/sections/customer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account general settings | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: { id: string };
};

import { _customerList } from '@/_mock/_customerList';

export default function Page({ params }: Props) {
  const { id } = params;
  return <AccountGeneralView id={id} />;
}
