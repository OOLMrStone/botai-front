import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { DevToolsSlot } from '@/components/dev/DevToolsSlot';
import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

import './globals.css';
import 'katex/dist/katex.min.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'botai - подготовка к ЕГЭ по профмату',
  description: 'Готовимся к ЕГЭ по профильной математике по чуть-чуть каждый день.',
};

// Мобайл-фёрст: подгоняем под device-width, viewport-fit=cover открывает
// safe-area-insets (чёлка, домашняя полоса) - экран не лезет под аппаратные зоны.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-muted/30">
        <div className={cn(layout.viewport.width, layout.viewport.frame)}>{children}</div>
        <DevToolsSlot />
      </body>
    </html>
  );
}
