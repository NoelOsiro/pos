import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { FormWizardView } from '@/sections/_examples/extra/form-wizard-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Form wizard | Components - ${CONFIG.appName}` };

export default function Page() {
  return <FormWizardView />;
}
