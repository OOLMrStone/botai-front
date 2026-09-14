'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { layout } from '@/config/layout';
import { APP_TABS } from '@/config/navigation';
import { cn } from '@/lib/utils';

// Нижний таб-бар. Активную вкладку определяем по pathname - как OnboardingHeader.
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={layout.bottomNav.root}>
      {APP_TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              layout.bottomNav.item,
              active ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}
          >
            <Icon className={layout.bottomNav.icon} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
