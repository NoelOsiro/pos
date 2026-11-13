import { AuthSplitLayout } from '@/layouts/auth-split';

import { GuestGuard } from '@/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthSplitLayout>{children}</AuthSplitLayout>
    </GuestGuard>
  );
}
