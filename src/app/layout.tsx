import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import AppShell from './sell';
import { Toaster } from '@/components/ui/sonner';
import ReactQueryProvider from '@/components/ReactQueryProvider';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: 'normal',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'SINAES IFMA Plataforma',
  description: 'Sistema de monitoramento dos indicadores SINAES'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${openSans.className} flex min-h-screen flex-col bg-gray-50 text-gray-800`}
      >
        <AppShell>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
