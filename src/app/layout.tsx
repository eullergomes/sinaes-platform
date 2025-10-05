import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import AppShell from './sell';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
      <body className={`${poppins.className} flex min-h-screen bg-gray-50 text-gray-800`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}