import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';

import { RouterLink } from '@/routes/components';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  return (
    <Button
      component={RouterLink}
      href="/auth/sign-in"
      variant="outlined"
      sx={sx}
      {...other}
    >
      Sign in
    </Button>
  );
}
