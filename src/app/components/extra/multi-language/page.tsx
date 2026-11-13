import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { getServerTranslations } from '@/locales/server';

import { MultiLanguageView } from '@/sections/_examples/extra/multi-language-view';
import { navData } from '@/sections/_examples/extra/multi-language-view/nav-config-translate';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Multi language | Components - ${CONFIG.appName}` };

export default async function Page() {
  let ssrNavData;

  if (!CONFIG.isStaticExport) {
    const { t } = await getServerTranslations('navbar');
    const data = navData(t);

    ssrNavData = data;
  }

  return <MultiLanguageView ssrNavData={ssrNavData} />;
}
