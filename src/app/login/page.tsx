'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ErrorNote } from '@/components/common/ErrorNote';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OAuthButtons } from '@/components/onboarding/OAuthButtons';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ScreenTransition } from '@/components/onboarding/ScreenTransition';
import { layout } from '@/config/layout';
import { COPY, onboardingPath, ROUTES } from '@/config/onboarding-steps';
import { loginUser } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/stores/auth-store';

// Вход существующего пользователя: POST /api/auth/login, сессия - в куке.
export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // На логине поля не валидируем - у зарегистрированного они уже корректны.
  // Достаточно, чтобы в каждом было хоть что-то.
  const valid = email.length > 0 && password.length > 0;

  const handleForgot = () => {
    // TODO: восстановление пароля - экран и роут появятся позже.
  };

  const handleLogin = async () => {
    setPending(true);
    setError(null);

    try {
      const user = await loginUser({ email, password });
      setUser(user);
      router.push(ROUTES.home);
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 401 ? COPY.login.badCredentials : COPY.login.error,
      );
      setPending(false);
    }
  };

  return (
    <ScreenTransition>
      <ScreenShell
        className="pt-16"
        footer={
          <div className="space-y-4">
            <Button
              className={layout.cta}
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

            <OAuthButtons redirectTo={ROUTES.home} />

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
        <ScreenHeading title={COPY.login.title} subtitle={COPY.login.subtitle} />

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
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground h-auto p-0 text-sm font-normal"
                onClick={handleForgot}
              >
                {COPY.login.forgot}
              </Button>
            </div>
          </div>

          {error ? <ErrorNote message={error} /> : null}
        </div>
      </ScreenShell>
    </ScreenTransition>
  );
}
