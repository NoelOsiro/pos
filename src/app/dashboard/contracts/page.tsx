import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { ContractListView } from '@/sections/contracts/view';

export const metadata: Metadata = { title: `Contracts | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ContractListView />;
}
