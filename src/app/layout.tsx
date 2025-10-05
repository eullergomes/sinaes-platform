import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import PendingAlerts from '@/components/PendingAlerts';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.className} flex min-h-screen bg-gray-50 text-gray-800`}
      >
        <SidebarProvider>
          <AppSidebar collapsible="icon" />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4">
              <PendingAlerts />

              {/* <SidebarTrigger className="-ml-1" /> */}
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
