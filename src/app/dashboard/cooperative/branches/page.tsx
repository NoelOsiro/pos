import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { BranchCardsView } from '@/sections/cooperative/view';

export const metadata: Metadata = { title: `Branches | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <BranchCardsView />;
}
