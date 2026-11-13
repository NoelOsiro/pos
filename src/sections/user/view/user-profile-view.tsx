'use client';

import { _userAbout } from '@/_mock';
import { paths } from '@/routes/paths';
import { useAuthUser } from '@/auth/hooks';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { DashboardContent } from '@/layouts/dashboard';
import { usePathname, useSearchParams } from '@/routes/hooks';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { ProfileCooperatives } from '../profile-cooperatives';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { value: '', label: 'Profile', icon: <Iconify width={24} icon="solar:user-id-bold" /> },
  {
    value: 'cooperatives',
    label: 'Cooperatives',
    icon: <Iconify width={24} icon="solar:users-group-rounded-bold" />,
  },
];

const TAB_PARAM = 'tab';

export function UserProfileView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedTab = searchParams.get(TAB_PARAM) ?? '';
  const selectedTab = NAV_ITEMS.some((item) => item.value === requestedTab) ? requestedTab : '';

  const { user, cooperative, role } = useAuthUser();

  if (!user) return null;

  const createRedirectPath = (currentPath: string, query: string) =>
    query ? `${currentPath}?${new URLSearchParams({ [TAB_PARAM]: query }).toString()}` : currentPath;

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
          role={cooperative?.role_display ?? role ?? ''}
          name={user.displayName}
          avatarUrl={user.photoURL}
          coverUrl={_userAbout.coverUrl}
        />

        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs value={selectedTab}>
            {NAV_ITEMS.map((tab) => (
              <Tab
                component={RouterLink}
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
                href={createRedirectPath(pathname, tab.value)}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {selectedTab === '' && <ProfileHome user={user} cooperative={cooperative} />}

      {selectedTab === 'cooperatives' && (
        <ProfileCooperatives
          memberships={user.memberships}
          activeCooperativeId={cooperative?.id ?? null}
        />
      )}
    </DashboardContent>
  );
}