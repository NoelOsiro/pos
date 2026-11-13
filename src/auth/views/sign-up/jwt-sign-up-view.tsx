'use client';

import { z as zod } from 'zod/v4';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@/utils/zod-resolver';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';

import { Iconify } from '@/components/iconify';
import { Form, Field } from '@/components/hook-form';
import { toast } from '@/components/snackbar';

import { signUpWithEmail } from '@/app/auth/sign-up/actions';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod
  .object({
    firstName: zod.string().min(1, { message: 'First name is required!' }),
    lastName: zod.string().min(1, { message: 'Last name is required!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    password: zod
      .string()
      .min(8, { message: 'Password must be at least 8 characters!' })
      .regex(/[A-Za-z]/, { message: 'Password must contain a letter!' })
      .regex(/\d/, { message: 'Password must contain a number!' }),
    passwordConfirm: zod.string().min(1, { message: 'Confirm your password!' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match!',
  });

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('name', `${data.firstName} ${data.lastName}`);
      formData.set('password', data.password);
      formData.set('passwordConfirm', data.passwordConfirm);

      const result = await signUpWithEmail(null, formData);

      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }

      toast.success('Account created successfully');
      router.replace(paths.dashboard.root);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign up failed');
    }
  });

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Get started absolutely free
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
          {`Already have an account? `}
          <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
            Sign in
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
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Field.Text
              name="firstName"
              label="First name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Field.Text
              name="lastName"
              label="Last name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

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
                    <IconButton onClick={showPassword.onToggle} edge="end">
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

          <Field.Text
            name="passwordConfirm"
            label="Confirm password"
            placeholder="8+ characters"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Create account..."
          >
            Create account
          </Button>
        </Box>
      </Form>
    </>
  );
}
