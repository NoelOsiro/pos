import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from '@/global-config';

import { Image } from '@/components/image';
import { Iconify } from '@/components/iconify';
import { varFade, MotionViewport } from '@/components/animate';

// ----------------------------------------------------------------------

export function AboutVision({ sx, ...other }: BoxProps) {
  const renderImage = () => (
    <Image
      src={`${CONFIG.assetsDir}/images/about/vision.webp`}
      alt="About vision"
      ratio={{ xs: '4/3', sm: '16/9' }}
      slotProps={{
        overlay: {
          sx: (theme) => ({
            bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
          }),
        },
      }}
    />
  );

  const renderLogos = () => (
    <Box
      sx={[
        () => ({
          width: 1,
          zIndex: 9,
          bottom: 0,
          opacity: 0.48,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          position: 'absolute',
          justifyContent: 'center',
          py: { xs: 1.5, md: 2.5 },
        }),
      ]}
    >
      {['ibm', 'lya', 'spotify', 'netflix', 'hbo', 'amazon'].map((logo) => (
        <Box
          component={m.img}
          key={logo}
          variants={varFade('in')}
          alt={logo}
          src={`${CONFIG.assetsDir}/icons/brands/ic-brand-${logo}.svg`}
          sx={{ m: { xs: 1.5, md: 2.5 }, height: { xs: 20, md: 32 } }}
        />
      ))}
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        () => ({
          pb: 10,
          position: 'relative',
          bgcolor: 'background.neutral',
          '&::before': {
            top: 0,
            left: 0,
            width: 1,
            content: "''",
            position: 'absolute',
            height: { xs: 80, md: 120 },
            bgcolor: 'background.default',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionViewport}>
        <Box
          sx={{
            mb: 10,
            borderRadius: 2,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderImage()}
          {renderLogos()}

          <Fab sx={{ position: 'absolute', zIndex: 9 }}>
            <Iconify icon="solar:play-broken" width={24} />
          </Fab>
        </Box>

        <Typography
          component={m.h6}
          variants={varFade('inUp')}
          variant="h3"
          sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}
        >
          Our vision offering the best product nulla vehicula tortor scelerisque ultrices malesuada.
        </Typography>
      </Container>
    </Box>
  );
}
