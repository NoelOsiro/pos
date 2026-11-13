'use client';

import { useSearchParams } from 'next/navigation';

import { CONFIG } from '@/global-config';

import { ViewCooperativeBound } from '@/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') ?? 'No cooperative bound to this grant.';

  return (
    <ViewCooperativeBound errorMessage={errorMessage} />
  );
}