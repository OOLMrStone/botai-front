'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthSession } from '@/hooks/use-auth-session';

export function useAuthRedirect(routes: { anonymous: string }) {
  const router = useRouter();
  const session = useAuthSession();
  const destination = session.status === 'anonymous' ? routes.anonymous : undefined;

  useEffect(() => {
    if (destination) router.replace(destination);
  }, [destination, router]);

  return session;
}
