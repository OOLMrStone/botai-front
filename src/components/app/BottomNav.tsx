'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { APP_TABS } from '@/config/navigation';
import { cn } from '@/lib/utils';

// Нижний таб-бар. Активную вкладку определяем по pathname - как OnboardingHeader.
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-background flex shrink-0 items-stretch border-t">
      {APP_TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors',
              active ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-6" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
