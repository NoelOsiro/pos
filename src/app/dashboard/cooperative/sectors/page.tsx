import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { SectorCardsView } from '@/sections/cooperative/view';

export const metadata: Metadata = { title: `Sectors | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SectorCardsView />;
}
