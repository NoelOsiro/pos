import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { getPosts } from '@/actions/blog-ssr';

import { PostListHomeView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Post list - ${CONFIG.appName}` };

export default async function Page() {
  const { posts } = await getPosts();

  return <PostListHomeView posts={posts} />;
}
