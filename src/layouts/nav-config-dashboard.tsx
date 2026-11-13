'use client';

import type { UserRole } from '@/auth/types';
import type { NavSectionProps } from '@/components/nav-section';

import { useMemo } from 'react';
import { paths } from '@/routes/paths';
import { CONFIG } from '@/global-config';
import { useAuthUser } from '@/auth/hooks';
import { SvgColor } from '@/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic-dashboard'),
  analytics: icon('ic-analytics'),
  inventory: icon('ic-folder'),
  order: icon('ic-order'),
  customer: icon('ic-user'),
  invoice: icon('ic-invoice'),
  settings: icon('ic-parameter'),
  product: icon('ic-label'),
  category: icon('ic-file'),
  lock: icon('ic-lock'),
  user: icon('ic-user'),
};

// ----------------------------------------------------------------------

type Item = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  roles?: UserRole[];
  children?: Item[];
};

type Section = { subheader: string; roles?: UserRole[]; items: Item[] };

const NAV: Section[] = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.overview.root, icon: ICONS.dashboard },
    ],
  },
  {
    subheader: 'Analytics',
    roles: ['admin', 'manager', 'viewer'],
    items: [
      { title: 'Analytics', path: paths.dashboard.analytics.root, icon: ICONS.analytics },
    ],
  },
  {
    subheader: 'Inventory',
    items: [
      {
        title: 'Products',
        path: paths.dashboard.inventory.root,
        icon: ICONS.inventory,
        children: [
          { title: 'List', path: paths.dashboard.inventory.list, roles: ['admin', 'manager', 'cashier', 'viewer'] },
          { title: 'Categories', path: paths.dashboard.inventory.categories, roles: ['admin', 'manager'] },
          { title: 'New Product', path: paths.dashboard.inventory.create, roles: ['admin', 'manager', 'cashier'] },
        ],
      },
    ],
  },
  {
    subheader: 'Orders',
    items: [
      {
        title: 'Orders',
        path: paths.dashboard.orders.root,
        icon: ICONS.order,
        children: [
          { title: 'List', path: paths.dashboard.orders.list, roles: ['admin', 'manager', 'cashier', 'viewer'] },
          { title: 'New Order', path: paths.dashboard.orders.create, roles: ['admin', 'manager', 'cashier'] },
        ],
      },
    ],
  },
  {
    subheader: 'Customers',
    items: [
      {
        title: 'Customers',
        path: paths.dashboard.customers.root,
        icon: ICONS.customer,
        children: [
          { title: 'List', path: paths.dashboard.customers.list, roles: ['admin', 'manager', 'cashier', 'viewer'] },
          { title: 'New Customer', path: paths.dashboard.customers.create, roles: ['admin', 'manager', 'cashier'] },
        ],
      },
    ],
  },
  {
    subheader: 'Invoices',
    items: [
      {
        title: 'Invoices',
        path: paths.dashboard.invoices.root,
        icon: ICONS.invoice,
        children: [
          { title: 'List', path: paths.dashboard.invoices.list, roles: ['admin', 'manager', 'cashier', 'viewer'] },
          { title: 'New Invoice', path: paths.dashboard.invoices.create, roles: ['admin', 'manager', 'cashier'] },
        ],
      },
    ],
  },
  {
    subheader: 'Settings',
    items: [
      { title: 'Profile', path: paths.dashboard.settings.root, icon: ICONS.settings },
    ],
  },
];

// ----------------------------------------------------------------------

const canSee = (roles: UserRole[] | undefined, role: UserRole | null) =>
  !roles || (role !== null && roles.includes(role));

function filterItems(items: Item[], role: UserRole | null): Item[] {
  return items.flatMap((item) => {
    if (!canSee(item.roles, role)) return [];

    if (!item.children) return [item];

    const children = filterItems(item.children, role);
    return children.length ? [{ ...item, children }] : [];
  });
}

export function getNavData(role: UserRole | null): NavSectionProps['data'] {
  if (!role) return [];

  return NAV.flatMap((section) => {
    if (!canSee(section.roles, role)) return [];

    const items = filterItems(section.items, role);
    return items.length ? [{ subheader: section.subheader, items }] : [];
  }) as NavSectionProps['data'];
}

export function useNavData() {
  const { role } = useAuthUser();

  return useMemo(() => getNavData(role), [role]);
}
