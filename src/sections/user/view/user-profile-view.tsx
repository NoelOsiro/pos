'use client';

import { _userAbout } from '@/_mock';
import { paths } from '@/routes/paths';
import { useAuthUser } from '@/auth/hooks';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Card from '@mui/material/Card';

import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';

export function UserProfileView() {
  const { user, role } = useAuthUser();

  if (!user) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: user.displayName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={role ?? ''}
          name={user.displayName}
          avatarUrl={user.photoURL}
          coverUrl={_userAbout.coverUrl}
        />
      </Card>

      <ProfileHome user={user} />
    </DashboardContent>
  );
}
