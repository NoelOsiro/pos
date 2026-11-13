import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from '@/global-config';

import { Iconify } from '@/components/iconify';
import { varFade, varScale, MotionViewport } from '@/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatXIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomePricing({ sx, ...other }: BoxProps) {
  const tabs = useTabs('Standard');

  const renderDescription = () => (
    <SectionTitle
      caption="Store Tiers"
      title="Simple pricing for"
      txtGradient="every retailer"
      description="Choose the plan that matches your store's scale. All prices are custom — contact sales for a tailored quote."
      sx={{ mb: 8, textAlign: 'center' }}
    />
  );

  const renderContentDesktop = () => (
    <Box gridTemplateColumns="repeat(3, 1fr)" sx={{ display: { xs: 'none', md: 'grid' } }}>
      {PLANS.map((plan) => (
        <PlanCard
          key={plan.license}
          plan={plan}
          sx={(theme) => ({
            ...(plan.license === 'Standard' && {
              [theme.breakpoints.down(1440)]: {
                borderLeft: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
                borderRight: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
              },
            }),
          })}
        />
      ))}
    </Box>
  );

  const renderContentMobile = () => (
    <Stack spacing={5} alignItems="center" sx={{ display: { md: 'none' } }}>
      <Tabs
        value={tabs.value}
        onChange={tabs.onChange}
        sx={[
          (theme) => ({
            boxShadow: `0px -2px 0px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)} inset`,
          }),
        ]}
      >
        {PLANS.map((tab) => (
          <Tab key={tab.license} value={tab.license} label={tab.license} />
        ))}
      </Tabs>

      <Box
        sx={[
          (theme) => ({
            width: 1,
            borderRadius: 2,
            border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          }),
        ]}
      >
        {PLANS.map(
          (tab) => tab.license === tabs.value && <PlanCard key={tab.license} plan={tab} />
        )}
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 10, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        <FloatLine vertical sx={{ top: 0, left: 80 }} />

        <Container>{renderDescription()}</Container>

        <Box
          sx={(theme) => ({
            position: 'relative',
            '&::before, &::after': {
              width: 64,
              height: 64,
              content: "''",
              [theme.breakpoints.up(1440)]: { display: 'block' },
            },
          })}
        >
          <Container>{renderContentDesktop()}</Container>

          <FloatLine sx={{ top: 64, left: 0 }} />
          <FloatLine sx={{ bottom: 64, left: 0 }} />
        </Box>

        <Container>{renderContentMobile()}</Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

type PlanCardProps = BoxProps & {
  plan: {
    license: string;
    commons: string[];
    options: string[];
    icons: string[];
  };
};

const renderLines = () => (
  <>
    <FloatLine vertical sx={{ top: -64, left: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatLine vertical sx={{ top: -64, right: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatXIcon sx={{ top: -8, left: -8 }} />
    <FloatXIcon sx={{ top: -8, right: -8 }} />
    <FloatXIcon sx={{ bottom: -8, left: -8 }} />
    <FloatXIcon sx={{ bottom: -8, right: -8 }} />
  </>
);

function PlanCard({ plan, sx, ...other }: PlanCardProps) {
  const isHighlighted = plan.license === 'Standard';

  return (
    <MotionViewport>
      <Box
        sx={[
          () => ({
            px: 6,
            py: 8,
            gap: 5,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            ...(isHighlighted && { border: 'solid 1px', borderColor: 'primary.main' }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {isHighlighted && renderLines()}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack flexGrow={1}>
            <m.div variants={varFade('inLeft', { distance: 24 })}>
              <Typography variant="h4" component="h6">
                {plan.license}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Tailored for your store size
              </Typography>
            </m.div>

            <m.div variants={varScale('inX')}>
              <Box
                sx={{
                  width: 32,
                  height: 6,
                  opacity: 0.24,
                  borderRadius: 1,
                  bgcolor: isHighlighted ? 'primary.main' : 'grey.500',
                }}
              />
            </m.div>
          </Stack>

          <m.div variants={varFade('inLeft', { distance: 24 })}>
            <Box component="span" sx={{ typography: 'h3' }}>
              Contact sales
              <Box component="span" sx={{ typography: 'body1', color: 'text.secondary' }}>
                {' '}for custom pricing
              </Box>
            </Box>
          </m.div>
        </Box>

        <Stack spacing={2.5}>
          {plan.commons.map((option) => (
            <Box
              key={option}
              component={m.div}
              variants={varFade('in')}
              sx={{
                gap: 1.5,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
              }}
            >
              <Iconify width={16} icon="eva:checkmark-fill" />
              {option}
            </Box>
          ))}

          <m.div variants={varFade('inLeft', { distance: 24 })}>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </m.div>

          {plan.options.map((option) => (
            <Box
              key={option}
              component={m.div}
              variants={varFade('in')}
              sx={{
                gap: 1.5,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Iconify width={18} icon="mingcute:add-line" />
              {option}
            </Box>
          ))}
        </Stack>

        <m.div variants={varFade('inUp', { distance: 24 })}>
          <Button
            fullWidth
            variant={isHighlighted ? 'contained' : 'outlined'}
            color="primary"
            size="large"
            onClick={() => {}}
          >
            Request Quote
          </Button>
        </m.div>
      </Box>
    </MotionViewport>
  );
}

// ----------------------------------------------------------------------

const PLANS = [
  {
    license: 'Single Store',
    price: 0,
    commons: [
      'POS register & checkout',
      'Inventory tracking & alerts',
      'Receipt printing',
      'Barcode scanner support',
      'Card terminal integration',
      'Role-based access (admin, cashier)',
      'Daily sales reports',
    ],
    options: [
      'Multi-store tenancy',
      'Custom price rules per product',
      'Advanced analytics & dashboards',
      'Loyalty program',
      'Dedicated integration support',
    ],
    icons: [
      `${CONFIG.assetsDir}/icons/platforms/ic-wifi.svg`,
      `${CONFIG.assetsDir}/icons/platforms/ic-speed.svg`,
      `${CONFIG.assetsDir}/icons/platforms/ic-support.svg`,
    ],
  },
  {
    license: 'Standard',
    price: 0,
    commons: [
      'Everything in Single Store',
      'Multi-location & multi-register support',
      'Regional manager portal (read-only)',
      'Sales performance dashboard',
      'Automated tax & compliance reports',
      'MFA enforcement for admin roles',
      'Bulk product import tools',
    ],
    options: [
      'Custom settlement rules per payment method',
      'API access for accounting integration',
      'White-label receipts',
      'SLA-backed support',
      'On-premise deployment option',
    ],
    icons: [
      `${CONFIG.assetsDir}/icons/platforms/ic-wifi.svg`,
      `${CONFIG.assetsDir}/icons/platforms/ic-speed.svg`,
      `${CONFIG.assetsDir}/icons/platforms/ic-support.svg`,
    ],
  },
  {
    license: 'Enterprise / Franchise',
    price: 0,
    commons: [
      'Everything in Standard',
      'Multi-tenant management console',
      'Portfolio-wide sales & inventory analytics',
      'Custom credit policy engine',
      'Direct processor integrations',
      'Business intelligence data feed',
      'Audit-ready data export (CSV, API)',
    ],
    options: [
      'Dedicated infrastructure & SSO',
      'Custom SLA & penetration testing',
      'Co-branded customer app',
      'Regulatory sandbox support',
      'Strategic partnership pricing',
    ],
    icons: [
      `${CONFIG.assetsDir}/icons/platforms/ic-wifi.svg`,
      `${CONFIG.assetsDir}/icons/platforms/ic-speed.svg`,
      `${CONFIG.assetsDir}/icons/platforms/ic-support.svg`,
    ],
  },
];
