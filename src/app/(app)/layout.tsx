import { BottomNav } from '@/components/app/BottomNav';

import { AppGuard } from './AppGuard';

// Оболочка раздела после логина: контент под гардом сессии + нижний таб-бар.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh flex-col">
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppGuard>{children}</AppGuard>
      </main>
      <BottomNav />
    </div>
  );
}
