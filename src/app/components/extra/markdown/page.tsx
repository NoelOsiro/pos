import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { MarkdownView } from '@/sections/_examples/extra/markdown-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Markdown | Components - ${CONFIG.appName}` };

export default function Page() {
  return <MarkdownView />;
}
