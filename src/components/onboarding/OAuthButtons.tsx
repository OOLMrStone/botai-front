'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import { GoogleIcon, VkIcon, YandexIcon } from '@/components/onboarding/brand-icons';
import { ROUTES } from '@/config/onboarding-steps';
import { oauthSignIn, type OAuthProvider } from '@/lib/api/auth';

const PROVIDERS: {
  id: OAuthProvider;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { id: 'yandex', label: 'Продолжить с Яндекс', Icon: YandexIcon },
  { id: 'google', label: 'Продолжить с Google', Icon: GoogleIcon },
  { id: 'vk', label: 'Продолжить с ВК', Icon: VkIcon },
];

interface OAuthButtonsProps {
  redirectTo?: string;
}

// Кнопки OAuth — заглушки в lib/api/auth. Успех → redirectTo.
export function OAuthButtons({ redirectTo = ROUTES.done }: OAuthButtonsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  const handleSignIn = async (provider: OAuthProvider) => {
    setPending(provider);

    await oauthSignIn(provider);

    router.push(redirectTo);
  };

  return (
    <div className="space-y-2">
      {PROVIDERS.map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant="outline"
          className="h-11 w-full justify-center gap-3 text-base"
          size="lg"
          disabled={pending !== null}
          onClick={() => handleSignIn(id)}
        >
          <Icon className="size-5 shrink-0" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
