import type { Metadata } from 'next';

import { kebabCase } from 'es-toolkit';

import { CONFIG } from '@/global-config';
import axios, { endpoints } from '@/lib/axios';

import { PostEditView } from '@/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Post edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ title: string }>;
};

export default async function Page({ params }: Props) {
  const { title } = await params;

  const { post } = await getPost(title);

  return <PostEditView post={post} />;
}

// ----------------------------------------------------------------------

async function getPost(title: string) {
  const URL = title ? `${endpoints.post.details}?title=${title}` : '';

  const res = await axios.get(URL);

  return res.data;
}

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
