import { AuthSplitLayout } from '@/layouts/auth-split';

import { GuestGuard } from '@/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: { title: 'Hi, Welcome back' },
        }}
      >
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
