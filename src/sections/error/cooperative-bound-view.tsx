'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { RouterLink } from '@/routes/components';

import { SimpleLayout } from '@/layouts/simple';
import { ForbiddenIllustration } from '@/assets/illustrations';

import { varBounce, MotionContainer } from '@/components/animate';

// ----------------------------------------------------------------------

export function ViewCooperativeBound({ errorMessage }: { errorMessage: string }) {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <Container component={MotionContainer}>
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            No Cooperative Access
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            Your account is not associated with any cooperative. Please contact your system administrator to request access.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}