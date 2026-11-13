import { AccountLayout } from '@/sections/customer/account-layout';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const AccountLayoutWrapper = async ({ children, params }: LayoutProps) => {
  const { id } = await params;
  return <AccountLayout customerId={id}>{children}</AccountLayout>;
};

export default AccountLayoutWrapper;
