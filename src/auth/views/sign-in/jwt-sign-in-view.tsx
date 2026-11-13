'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { paths } from '@/routes/paths';
import { useForm } from 'react-hook-form';
import { Iconify } from '@/components/iconify';
import { useSearchParams } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';
import { useBoolean } from 'minimal-shared/hooks';
import { Form, Field } from '@/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useAuthContext } from '../../hooks/use-auth-context';

// ----------------------------------------------------------------------

type FormValues = {
  email: string;
  password: string;
};

const schema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod.string().min(1, { message: 'Password is required!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const searchParams = useSearchParams();

  const showPassword = useBoolean();

  const { signIn } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const returnTo = searchParams.get('returnTo');

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      await signIn({
        email: values.email,
        password: values.password,
        returnTo: returnTo || null,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign in failed');
    }
  });

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Sign in to your account
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
          {`Don’t have an account? `}
          <Link component={RouterLink} href={paths.auth.signUp} variant="subtitle2">
            Get started
          </Link>
        </Typography>
      </Box>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="email"
            label="Email address"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Field.Text
            name="password"
            label="Password"
            placeholder="8+ characters"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={showPassword.onToggle}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword.value
                            ? 'solar:eye-bold'
                            : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Please wait..."
          >
            Sign in
          </Button>
        </Box>
      </Form>
    </>
  );
}
