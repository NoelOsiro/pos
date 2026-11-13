import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { AppAuthorizationsView } from '@/sections/cooperative/view';

export const metadata: Metadata = {
  title: `App authorizations | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AppAuthorizationsView />;
}
