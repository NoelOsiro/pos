import type { BoxProps } from '@mui/material/Box';

import { useState } from 'react';
import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';

import { Iconify } from '@/components/iconify';
import { varFade, MotionViewport } from '@/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon, FloatTriangleDownIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

const FAQs = [
  {
    question: 'How does inventory tracking work?',
    answer: (
      <Typography>
        Every sale automatically decrements stock. Set low-stock thresholds per SKU and get alerts when it's time to reorder. Multi-location support keeps inventory synced across stores.
      </Typography>
    ),
  },
  {
    question: 'Can I process returns and refunds?',
    answer: (
      <Typography>
        Yes. Create return orders against original invoices, restock sellable items, and issue refunds to the original payment method. All adjustments are audit-logged.
      </Typography>
    ),
  },
  {
    question: 'Does it work without internet?',
    answer: (
      <Typography>
        Yes. The POS app is offline-first: cashiers continue ringing sales locally. Data syncs automatically when connectivity returns. Cash drawer and receipt printer pair directly with the app.
      </Typography>
    ),
  },
  {
    question: 'Which hardware is supported?',
    answer: (
      <Typography>
        POS integrates with any USB/Bluetooth cash drawer, barcode scanner, receipt printer, and card terminal that exposes a standard HID or ESC/POS profile. Verified models include: Star Micronics TSP100, Epson TM-T20II, Zebra DS2208, and Ingenico lane/3000. Custom driver support is available for other devices.
      </Typography>
    ),
  },
  {
    question: 'How is data isolated between stores?',
    answer: (
      <Typography>
        Each store or franchise runs in its own logical tenant with separate databases, encryption keys, and role-based access policies. Managers and cashiers only see data within their tenant. Regional managers get a read-only view across authorized stores.
      </Typography>
    ),
  },
  {
    question: 'What security controls protect admin accounts?',
    answer: (
      <Typography>
        Admin roles enforce MFA (TOTP or WebAuthn), session timeouts, and IP allowlisting. All privileged actions — price changes, user provisioning, refund approvals — are recorded in an immutable audit trail. Role-based access control (RBAC) separates admin, manager, cashier, and viewer permissions.
      </Typography>
    ),
  },
  {
    question: 'How do customers pay?',
    answer: (
      <Typography>
        Accept cash, card (chip, contactless, mobile wallet), and split payments. Receipts print automatically or email/SMS to the customer. All transactions are tied to the order and invoice for reconciliation.
      </Typography>
    ),
  },
  {
    question: 'How long does onboarding take?',
    answer: (
      <Typography>
        A single store can go live in 2–3 days. Multi-store rollouts with hardware setup and integrations typically take 1–2 weeks. Contact sales for a scoped timeline.
      </Typography>
    ),
  },
];

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }: BoxProps) {
  const [expanded, setExpanded] = useState<string | false>(FAQs[0].question);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = () => (
    <SectionTitle
      caption="FAQs"
      title="Answers for"
      txtGradient="store owners"
      sx={{ textAlign: 'center' }}
    />
  );

  const renderContent = () => (
    <Stack
      spacing={1}
      sx={[
        () => ({
          mt: 8,
          mx: 'auto',
          maxWidth: 720,
          mb: { xs: 5, md: 8 },
        }),
      ]}
    >
      {FAQs.map((item, index) => (
        <Accordion
          key={item.question}
          component={m.div}
          variants={varFade('inUp', { distance: 24 })}
          expanded={expanded === item.question}
          onChange={handleChange(item.question)}
          sx={(theme) => ({
            borderRadius: 2,
            transition: theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.short,
            }),
            '&::before': { display: 'none' },
            '&:hover': { bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16) },
            '&:first-of-type, &:last-of-type': { borderRadius: 2 },
            [`&.${accordionClasses.expanded}`]: {
              m: 0,
              borderRadius: 2,
              boxShadow: 'none',
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            },
            [`& .${accordionSummaryClasses.root}`]: {
              py: 3,
              px: 2.5,
              minHeight: 'auto',
              [`& .${accordionSummaryClasses.content}`]: {
                m: 0,
                [`&.${accordionSummaryClasses.expanded}`]: { m: 0 },
              },
            },
            [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
          })}
        >
          <AccordionSummary
            expandIcon={
              <Iconify
                width={20}
                icon={expanded === item.question ? 'mingcute:minimize-line' : 'mingcute:add-line'}
              />
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Typography variant="h6"> {item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );

  const renderContact = () => (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          py: 8,
          textAlign: 'center',
          background: `linear-gradient(to left, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}, transparent)`,
        }),
      ]}
    >
      <m.div variants={varFade('in')}>
        <Typography variant="h4">Still have questions?</Typography>
      </m.div>

      <m.div variants={varFade('in')}>
        <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
          Describe your store setup — we'll scope the pilot and timeline
        </Typography>
      </m.div>

      <m.div variants={varFade('in')}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {}}
          startIcon={<Iconify icon="fluent:mail-24-filled" />}
        >
          Request a demo
        </Button>
      </m.div>
    </Box>
  );

  return (
    <Box component="section" sx={sx} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        {topLines()}

        <Container>
          {renderDescription()}
          {renderContent()}
        </Container>

        <Stack sx={{ position: 'relative' }}>
          {bottomLines()}
          {renderContact()}
        </Stack>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const topLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        position: 'absolute',
        transform: 'translateX(-50%)',
      }}
    >
      <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
      <FloatTriangleDownIcon
        sx={{
          width: 30,
          height: 15,
          opacity: 0.24,
          position: 'static',
        }}
      />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

const bottomLines = () => (
  <>
    <FloatLine sx={{ top: 0, left: 0 }} />
    <FloatLine sx={{ bottom: 0, left: 0 }} />
    <FloatPlusIcon sx={{ top: -8, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: -8, left: 72 }} />
  </>
);
