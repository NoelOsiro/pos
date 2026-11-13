import type { ISocialLink } from '@/types/common';

import { useForm } from 'react-hook-form';

import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from '@/assets/icons';

import { toast } from '@/components/snackbar';
import { Form, Field } from '@/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  socialLinks: ISocialLink;
};

export function AccountSocials({ socialLinks }: Props) {
  const defaultValues: ISocialLink = {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  };

  const methods = useForm<ISocialLink>({
    defaultValues,
    values: socialLinks,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {Object.keys(socialLinks).map((social) => (
          <Field.Text
            key={social}
            name={social}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {social === 'facebook' && <FacebookIcon sx={{ width: 24 }} />}
                    {social === 'instagram' && <InstagramIcon sx={{ width: 24 }} />}
                    {social === 'linkedin' && <LinkedinIcon sx={{ width: 24 }} />}
                    {social === 'twitter' && <TwitterIcon sx={{ width: 24 }} />}
                  </InputAdornment>
                ),
              },
            }}
          />
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save changes
        </LoadingButton>
      </Card>
    </Form>
  );
}
