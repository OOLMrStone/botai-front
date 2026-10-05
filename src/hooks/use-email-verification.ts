'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { verifyEmail } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { LEARNING_COPY as C } from '@/config/integration';
export function useEmailVerification() {
  const token = useSearchParams().get('token');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (!token || pending) return;
    setPending(true);
    setError(null);
    try {
      await verifyEmail(token);
      await useAuthStore.getState().refresh();
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : C.verifyInvalid);
    } finally {
      setPending(false);
    }
  };
  return { token, pending, done, error, confirm };
}
