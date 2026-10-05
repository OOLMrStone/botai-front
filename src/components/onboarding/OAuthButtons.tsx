'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ComponentType } from 'react';

import { IS_MOCK_API } from '@/config/env';
import { layout } from '@/config/layout';
import { Button } from '@/components/ui/button';
import { GoogleIcon, VkIcon, YandexIcon } from '@/components/onboarding/brand-icons';
import { ROUTES } from '@/config/onboarding-steps';
import { oauthSignIn, type OAuthProvider } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';

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

// Кнопки OAuth — заглушки в lib/api/auth. Успех → setUser (сессия в сторе) + redirectTo.
export function OAuthButtons({ redirectTo = ROUTES.done }: OAuthButtonsProps) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  const handleSignIn = async (provider: OAuthProvider) => {
    setPending(provider);

    const user = await oauthSignIn(provider);
    setUser(user);

    router.push(redirectTo);
  };

  return (
    <div className={layout.oauth.group}>
      {PROVIDERS.map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant="outline"
          className={layout.oauth.button}
          size="default"
          disabled={!IS_MOCK_API || pending !== null}
          onClick={() => handleSignIn(id)}
        >
          <Icon className={layout.oauth.icon} />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
