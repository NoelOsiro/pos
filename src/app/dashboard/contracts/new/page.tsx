import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { ContractNewView } from '@/sections/contracts/view';

export const metadata: Metadata = { title: `New contract | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ContractNewView />;
}
