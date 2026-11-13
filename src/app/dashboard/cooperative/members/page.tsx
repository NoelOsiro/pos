import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { MemberCardsView } from '@/sections/cooperative/view';

export const metadata: Metadata = { title: `Cooperative members | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <MemberCardsView />;
}
