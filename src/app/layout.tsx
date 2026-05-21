import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import AppShell from './shell';
import { Toaster } from '@/components/ui/sonner';
import ReactQueryProvider from '@/components/ReactQueryProvider';

const openSans = Open_Sans({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800'],
	style: 'normal',
	display: 'swap'
});

export const metadata: Metadata = {
	metadataBase: new URL('https://sinaes-platform.vercel.app'),
	title: {
		default: 'IFMA Avalia',
		template: '%s | IFMA Avalia'
	},
	description:
		'Plataforma web para monitoramento, gestão e acompanhamento dos indicadores de avaliação do SINAES no IFMA Campus Caxias.',
	applicationName: 'IFMA Avalia',
	generator: 'Next.js',
	keywords: [
		'IFMA Avalia',
		'SINAES',
		'IFMA',
		'Campus Caxias',
		'avaliação institucional',
		'avaliação de cursos',
		'indicadores educacionais',
		'gestão acadêmica',
		'MEC',
		'INEP'
	],
	authors: [
		{
			name: 'Euller Gomes Teixeira',
			url: 'https://github.com/eullergomes'
		}
	],
	creator: 'Euller Gomes Teixeira',
	publisher: 'Instituto Federal do Maranhão - Campus Caxias',
	category: 'education',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		}
	},
	openGraph: {
		type: 'website',
		locale: 'pt_BR',
		url: 'https://sinaes-platform.vercel.app',
		siteName: 'IFMA Avalia',
		title: 'IFMA Avalia',
		description:
			'Plataforma web para monitoramento dos indicadores de avaliação do SINAES no IFMA Campus Caxias.',
		images: [
			{
				url: '/assets/imgs/ifma-avalia-logo.webp',
				width: 1200,
				height: 630,
				alt: 'IFMA Avalia - Plataforma de Monitoramento SINAES'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'IFMA Avalia',
		description:
			'Plataforma web para monitoramento dos indicadores de avaliação do SINAES no IFMA Campus Caxias.',
		images: ['/assets/imgs/ifma-avalia-logo.webp']
	},
	icons: {
		icon: [
			{
				url: '/favicon.ico'
			}
		],
		apple: [
			{
				url: '/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png'
			}
		]
	},
	manifest: '/site.webmanifest',
	alternates: {
		canonical: '/'
	}
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