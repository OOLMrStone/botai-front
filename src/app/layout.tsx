import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-muted/30">
        <div className="bg-background mx-auto flex min-h-svh w-full max-w-md flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
