import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { PostListView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Post list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PostListView />;
}
