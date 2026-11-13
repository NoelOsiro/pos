import { paths } from '@/routes/paths';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect(paths.dashboard.pricelists.list);
}
