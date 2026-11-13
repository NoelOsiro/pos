import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';

import { SliderView } from '@/sections/_examples/mui/slider-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Slider | MUI - ${CONFIG.appName}` };

export default function Page() {
  return <SliderView />;
}
