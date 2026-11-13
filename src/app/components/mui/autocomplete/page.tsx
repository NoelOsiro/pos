import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { AutocompleteView } from '@/sections/_examples/mui/autocomplete-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Autocomplete | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <AutocompleteView />;
}
