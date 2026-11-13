import { DashboardContent } from '@/layouts/dashboard';

import { PostDetailsSkeleton } from '@/sections/blog/post-skeleton';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <DashboardContent maxWidth={false} disablePadding>
      <PostDetailsSkeleton />
    </DashboardContent>
  );
}
