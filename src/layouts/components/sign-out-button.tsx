import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';


import Button from '@mui/material/Button';

import { useRouter } from '@/routes/hooks';

import { toast } from '@/components/snackbar';

import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();

  const { signOut } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [onClose, router, signOut]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
