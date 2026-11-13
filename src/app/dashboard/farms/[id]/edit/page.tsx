import type { Metadata } from 'next';
import type { IFarmFormData } from '@/types/farmer';

import { CONFIG } from '@/global-config';
import { FarmEditView } from '@/sections/farms/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit farm | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const farm: IFarmFormData & { id: string } = {
    id,
    name: '',
    sector: 'tea',
    size_acres: '',
    county: null,
    sub_county: '',
    ward: '',
    latitude: '',
    longitude: '',
    is_active: true,
  };

  return <FarmEditView currentFarm={farm} />;
}

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';