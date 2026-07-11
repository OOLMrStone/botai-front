'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OAuthButtons } from '@/components/onboarding/OAuthButtons';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ScreenTransition } from '@/components/onboarding/ScreenTransition';
import { COPY, onboardingPath, ROUTES } from '@/config/onboarding-steps';
import { loginUser } from '@/lib/api/auth';
import { isValidEmail, isValidPassword } from '@/lib/validation';

// Вход существующего пользователя. Заглушка: реальный вход - через lib/api/auth.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const valid = isValidEmail(email) && isValidPassword(password);

  const handleLogin = async () => {
    setPending(true);

    await loginUser({ email, password });

    router.push(ROUTES.lesson);
  };

  return (
    <ScreenTransition>
      <ScreenShell
        footer={
          <div className="space-y-4">
            <Button
              className="h-12 w-full text-base"
              size="lg"
              disabled={!valid || pending}
              onClick={handleLogin}
            >
              {COPY.login.action}
            </Button>

            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <span className="bg-border h-px flex-1" />
              или
              <span className="bg-border h-px flex-1" />
            </div>

            <OAuthButtons redirectTo={ROUTES.lesson} />

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push(onboardingPath('welcome'))}
            >
              {COPY.login.noAccount}
            </Button>
          </div>
        }
      >
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">{COPY.login.title}</h1>
          <p className="text-muted-foreground">{COPY.login.subtitle}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Почта</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
            />
          </div>
        </div>
      </ScreenShell>
    </ScreenTransition>
  );
}
