import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { LeaveBalanceListView } from '@/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Leave list | Dashboard - ${CONFIG.appName}` };


export default function Page() {
    return <LeaveBalanceListView />;
}
