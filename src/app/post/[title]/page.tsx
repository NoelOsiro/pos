import type { Metadata } from 'next';

import { kebabCase } from 'es-toolkit';

import { CONFIG } from '@/global-config';
import axios, { endpoints } from '@/lib/axios';
import { getPost, getLatestPosts } from '@/actions/blog-ssr';

import { PostDetailsHomeView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Post details - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ title: string }>;
};

export default async function Page({ params }: Props) {
  const { title } = await params;

  const { post } = await getPost(title);

  const { latestPosts } = await getLatestPosts(title);

  return <PostDetailsHomeView post={post} latestPosts={latestPosts} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
export const dynamic = 'force-dynamic';

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.post.list);
    return res.data.posts.map((post: { title: string }) => ({ title: kebabCase(post.title) }));
  }
  return [];
}
