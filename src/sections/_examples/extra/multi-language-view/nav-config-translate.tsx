import type { TFunction } from 'i18next';

import { paths } from '@/routes/paths';

import { CONFIG } from '@/global-config';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { SvgColor } from '@/components/svg-color';

// ----------------------------------------------------------------------

export function navData(t: TFunction<any, any>) {
  return [
    {
      subheader: t('subheader'),
      items: [
        {
          title: t('app'),
          path: paths.dashboard.permission,
          icon: <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/ic-invoice.svg`} />,
        },
        {
          title: t('travel'),
          path: '#disabled',
          icon: <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/ic-tour.svg`} />,
        },
        {
          title: t('job'),
          path: '#label',
          icon: <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/ic-job.svg`} />,
          info: (
            <Label
              color="info"
              variant="inverted"
              startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
            >
              NEW
            </Label>
          ),
        },
        {
          title: t('blog.title'),
          path: '#caption',
          icon: <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/ic-blog.svg`} />,
          caption: t('blog.caption'),
        },
        {
          title: t('user'),
          path: 'https://www.google.com/',
          icon: <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/ic-user.svg`} />,
        },
        {
          title: t('invoice'),
          path: paths.dashboard.blank,
          icon: <SvgColor src={`${CONFIG.assetsDir}/icons/navbar/ic-invoice.svg`} />,
        },
      ],
    },
  ];
}
