import type { Metadata } from 'next';

import { HomeView } from '@/sections/home/view';

// ----------------------------------------------------------------------

const SITE_URL = 'https://mavunoflow.com'; // TODO: confirm production domain
const TITLE = 'MavunoFlow: Closed-Loop Settlement & Asset-Backed Lending for SACCOs';
const DESCRIPTION =
  'MavunoFlow automates loan recovery at the point of produce sale. Buyer payments are settled through the platform, outstanding loans are deducted first, and lending is capped at a configurable share (default 60%) of delivered, verified produce. Offline-first delivery capture and scale-integrated records remove manual write-ins.';
const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'MavunoFlow: Closed-Loop Settlement for SACCOs and Cooperatives',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'MavunoFlow',
    'SACCO software Kenya',
    'cooperative management system',
    'agricultural lending platform',
    'closed-loop settlement',
    'automated loan recovery',
    'loan-to-value lending',
    'dairy cooperative software',
    'coffee cooperative software',
    'tea cooperative software',
    'offline-first delivery capture',
    'farmer mobile money payouts',
    'multi-tenant cooperative platform',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: 'MavunoFlow',
    locale: 'en_KE',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return <HomeView />;
}