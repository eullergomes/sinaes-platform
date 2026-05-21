"use client"

import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';
import {
	ArrowLeft,
	ArrowRight,
	BadgeCheck,
	BarChart3,
	BookOpen,
	CalendarClock,
	CheckCircle2,
	ClipboardCheck,
	Database,
	FileCheck2,
	FileText,
	Gauge,
	Layers3,
	LockKeyhole,
	Network,
	ShieldCheck,
	Target,
	UsersRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import NavUser from '@/components/nav-user';

type IconComponent = ComponentType<{ className?: string }>;

type ContentItem = {
	icon: IconComponent;
	title: string;
	description: string;
};

// type ScreenshotItem = {
// 	src: string;
// 	title: string;
// 	description: string;
// };

type SectionHeadingProps = {
	eyebrow: string;
	title: string;
	description?: string;
	align?: 'left' | 'center';
};

type InfoCardProps = {
	icon: ReactNode;
	title: string;
	description: string;
	variant?: 'green' | 'blue' | 'yellow';
};

type AboutPageContentProps = {
	isHome?: boolean;
	showBackButton?: boolean;
};

const highlights: ContentItem[] = [
	{
		icon: FileText,
		title: 'Menos planilhas soltas',
		description: 'As informações avaliativas ficam reunidas por curso, dimensão, indicador e ciclo.'
	},
	{
		icon: Database,
		title: 'Documentos reutilizáveis',
		description: 'Evidências comuns podem atender a mais de um indicador, reduzindo duplicidade.'
	},
	{
		icon: BarChart3,
		title: 'Visão de gestão',
		description: 'Médias, status e alertas ajudam a identificar gargalos antes da avaliação externa.'
	},
	{
		icon: BookOpen,
		title: 'Base acadêmica',
		description: 'A solução foi projetada a partir de um TCC e validada com foco em usabilidade.'
	}
];

const workflow: ContentItem[] = [
	{
		icon: Layers3,
		title: 'Cursos',
		description: 'Cada curso possui dados cadastrais, coordenação responsável e histórico de acompanhamento.'
	},
	{
		icon: CalendarClock,
		title: 'Ciclos',
		description: 'As avaliações são organizadas por ano para preservar evolução, contexto e rastreabilidade.'
	},
	{
		icon: Network,
		title: 'Dimensões',
		description: 'Os indicadores são agrupados conforme as dimensões oficiais do instrumento avaliativo.'
	},
	{
		icon: ClipboardCheck,
		title: 'Indicadores',
		description: 'Cada indicador recebe nota, status, justificativa, observações e plano de ação.'
	},
	{
		icon: FileCheck2,
		title: 'Evidências',
		description: 'PDFs e links comprovam as informações registradas e fortalecem a governança documental.'
	},
	{
		icon: BarChart3,
		title: 'Gestão',
		description: 'Painéis e relatórios convertem dados em leitura prática para tomada de decisão.'
	}
];

const rules: ContentItem[] = [
	{
		icon: UsersRound,
		title: 'Perfis de acesso',
		description: 'Administradores gerenciam estrutura e usuários, coordenadores cuidam dos próprios cursos e visitantes acessam informações públicas.'
	},
	{
		icon: CalendarClock,
		title: 'Ciclos avaliativos',
		description: 'Cada ano representa um ciclo independente, permitindo comparar evolução e consultar históricos anteriores.'
	},
	{
		icon: Gauge,
		title: 'Notas e planos de ação',
		description: 'Indicadores usam conceitos de 1 a 5. Notas abaixo de 5 exigem justificativa, ação corretiva e responsável.'
	},
	{
		icon: Database,
		title: 'Reuso de evidências',
		description: 'Documentos institucionais, como PPC ou PDI, podem ser vinculados a diferentes indicadores.'
	},
	{
		icon: ShieldCheck,
		title: 'Controle de NSA',
		description: 'O recurso "Não se Aplica" permite sinalizar indicadores sem pertinência ao curso avaliado.'
	},
	{
		icon: LockKeyhole,
		title: 'Governança documental',
		description: 'As evidências ficam associadas aos requisitos avaliativos, favorecendo preparo contínuo e auditável.'
	}
];

// const screenshots: ScreenshotItem[] = [
// 	{
// 		src: '/assets/screenshots/course-page.webp',
// 		title: 'Página dos cursos',
// 		description: 'Visão inicial dos cursos monitorados, seus ciclos e atalhos de acompanhamento.'
// 	},
// 	{
// 		src: '/assets/screenshots/dimentions-page.webp',
// 		title: 'Dimensões do curso',
// 		description: 'Leitura organizada por dimensão avaliativa, ciclo e situação dos indicadores.'
// 	},
// 	{
// 		src: '/assets/screenshots/indicator-page.webp',
// 		title: 'Indicador e evidências',
// 		description: 'Critérios, documentos comprobatórios, justificativas e plano de ação no mesmo fluxo.'
// 	}
// ];

const variantStyles: Record<NonNullable<InfoCardProps['variant']>, string> = {
	green: 'bg-green-50 text-green-700 ring-green-100',
	blue: 'bg-blue-50 text-blue-700 ring-blue-100',
	yellow: 'bg-yellow-50 text-yellow-700 ring-yellow-100'
};

export function AboutPageContent({
	isHome = false,
	showBackButton = false
}: AboutPageContentProps) {
		const router = useRouter();

	const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/courses');
  };

	return (
		<main className="min-h-screen bg-gray-50 text-gray-900">
			{isHome ? <HomeHeader /> : null}

			<section className="relative overflow-hidden border-b border-gray-200 bg-white">
				<div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					{showBackButton ?
						<Button
							type="button"
							variant="ghost"
							className="-ml-3 inline-flex cursor-pointer items-center gap-2 text-sm text-black transition-colors hover:text-blue-600 hover:bg-transparent"
							onClick={handleBack}
						>
							<ArrowLeft className="h-4 w-4" />
							Voltar
          </Button> : null}

					<div className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
						<div className="space-y-8">
							<div className="space-y-5">
								<div className="flex items-center gap-4">
									<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-green-100 bg-white p-2 shadow-sm">
										<Image
											src="/assets/imgs/ifma-avalia-logo.webp"
											alt="Logo IFMA Avalia"
											width={52}
											height={52}
											className="h-auto w-auto"
											priority
										/>
									</div>
									<div>
										<h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
											IFMA Avalia
										</h1>
									</div>
								</div>

								<p className="max-w-3xl text-xl font-semibold leading-8 text-gray-800 sm:text-2xl sm:leading-9">
									Monitoramento dos indicadores do SINAES com evidências, histórico e planos de ação em um só lugar.
								</p>
								<p className="max-w-3xl text-base leading-8 text-gray-600">
									A plataforma centraliza dados avaliativos dos cursos, organiza documentos comprobatórios e transforma registros dispersos em informações úteis para planejamento acadêmico, gestão institucional e preparação para avaliações externas.
								</p>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button asChild size="lg" className="bg-green-600 text-white shadow-lg shadow-green-700/20 hover:bg-green-700">
									<Link href="/courses">
										Acessar cursos
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>

						<div className="relative">
									<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
										<Image
											src="/assets/imgs/spreadsheets-bro.svg"
											alt="Ilustração de análise de planilhas e indicadores"
											fill
											className="object-contain p-8"
											sizes="(min-width: 1024px) 42vw, 100vw"
											priority
										/>
									</div>
							</div>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<section className="grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
					<div className="space-y-6">
						<SectionHeading
							eyebrow="Por que existe"
							title="Da obrigação regulatória à inteligência de gestão"
							description="O IFMA Avalia foi pensado para reduzir fragmentação de dados, centralizar evidências e apoiar uma cultura de acompanhamento contínuo dos indicadores do SINAES."
						/>

						<div className="rounded-lg border border-green-100 bg-green-600 p-6 text-white shadow-xl shadow-green-900/10">
							<div className="flex items-start gap-4">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
									<Target className="h-6 w-6" />
								</div>
								<div>
									<h3 className="text-lg font-bold">Objetivo principal</h3>
									<p className="mt-2 text-sm leading-7 text-green-50">
										Oferecer uma visão clara da situação avaliativa dos cursos, conectando nota, justificativa, evidência e ação corretiva para que a gestão consiga agir antes dos problemas se acumularem.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						{highlights.map((item: ContentItem, index: number) => {
							const Icon: IconComponent = item.icon;
							const variant: InfoCardProps['variant'] = index === 3 ? 'yellow' : index % 2 === 0 ? 'green' : 'blue';

							return (
								<InfoCard
									key={item.title}
									icon={<Icon className="h-5 w-5" />}
									title={item.title}
									description={item.description}
									variant={variant}
								/>
							);
						})}
					</div>
				</section>

				<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
					<SectionHeading
						eyebrow="Como funciona"
						title="Um fluxo simples para acompanhamento contínuo"
						description="A estrutura reflete o instrumento de avaliação: cursos possuem ciclos, ciclos organizam dimensões e indicadores, e indicadores recebem evidências e decisões de gestão."
					/>

					<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{workflow.map((item: ContentItem, index: number) => {
							const Icon: IconComponent = item.icon;

							return (
								<div key={item.title} className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-gray-900/5">
									<p className="absolute right-5 top-4 text-5xl font-black text-gray-200">{String(index + 1).padStart(2, '0')}</p>
									<div className="relative">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-700 ring-1 ring-green-200">
											<Icon className="h-6 w-6" />
										</div>
										<h3 className="mt-5 text-lg font-bold text-gray-900">{item.title}</h3>
										<p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				<section className="py-16">
					<SectionHeading
						eyebrow="Regras de negócio"
						title="O que o usuário precisa entender para usar bem"
						description="A página também funciona como apresentação do sistema: mostra permissões, lógica dos ciclos, controle de evidências e critérios de acompanhamento."
						align="center"
					/>

					<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{rules.map((rule: ContentItem) => {
							const Icon: IconComponent = rule.icon;

							return (
								<div key={rule.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
									<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
										<Icon className="h-6 w-6" />
									</div>
									<h3 className="text-lg font-bold text-gray-900">{rule.title}</h3>
									<p className="mt-2 text-sm leading-6 text-gray-600">{rule.description}</p>
								</div>
							);
						})}
					</div>
				</section>

				<section className="rounded-lg border border-gray-200 bg-gray-900 p-6 text-white shadow-xl shadow-gray-900/10 sm:p-8">
					<div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
						<div className="space-y-5">
							<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-green-100 ring-1 ring-white/10">
								<BadgeCheck className="h-4 w-4" />
								Preparação contínua
							</div>
							<h2 className="text-3xl font-black tracking-tight sm:text-4xl">
								Evidências, indicadores e ações conectados no mesmo processo.
							</h2>
							<p className="text-sm leading-7 text-gray-300 sm:text-base">
								Em vez de tratar a avaliação como uma tarefa pontual, o sistema ajuda a manter registros atualizados, reduzir retrabalho e acompanhar a evolução dos cursos ao longo dos ciclos avaliativos.
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							{[
								'Histórico por ano e curso',
								'Justificativa para notas abaixo do ideal',
								'Vínculo direto entre indicador e evidência',
								'Plano de ação com responsável',
								'Marcação de indicadores NSA',
								'Base para relatórios e tomada de decisão'
							].map((item: string) => (
								<div key={item} className="flex items-start gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
									<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-300" />
									<span className="text-sm leading-6 text-gray-100">{item}</span>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* <section className="py-16">
					<SectionHeading
						eyebrow="Interface"
						title="Principais telas do sistema"
						description="Uma visão rápida das áreas que sustentam a navegação do usuário dentro do IFMA Avalia."
					/>

					<div className="mt-8 grid gap-5 lg:grid-cols-3">
						{screenshots.map((screen: ScreenshotItem) => (
							<article key={screen.src} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/5">
								<div className="relative aspect-[16/10] bg-gray-100">
									<Image
										src={screen.src}
										alt={screen.title}
										fill
										className="object-cover object-left-top"
										sizes="(min-width: 1024px) 33vw, 100vw"
									/>
								</div>
								<div className="p-6">
									<h3 className="text-lg font-bold text-gray-900">{screen.title}</h3>
									<p className="mt-2 text-sm leading-6 text-gray-600">{screen.description}</p>
								</div>
							</article>
						))}
					</div>
				</section> */}

				{/* <section className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
					<div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
						<div className="space-y-5 p-6 sm:p-8 lg:p-10">
							<p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">Comece agora</p>
							<h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
								Acompanhe cursos, indicadores e evidências com mais clareza.
							</h2>
							<p className="max-w-2xl text-base leading-8 text-gray-600">
								Use o IFMA Avalia como ponto central de consulta, atualização e planejamento para fortalecer a cultura de avaliação institucional.
							</p>
							<div className="flex flex-col gap-3 sm:flex-row">
								<Button asChild className="bg-green-600 hover:bg-green-700">
									<Link href="/courses">
										Ver cursos cadastrados
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="/assets/pdf/manual-instrucoes.pdf" target="_blank">
										Consultar manual
									</Link>
								</Button>
							</div>
						</div>

						<div className="relative min-h-[280px] bg-green-700 p-8 text-white">
							<div className="flex h-full flex-col justify-between gap-8">
								<div className="flex items-center gap-4">
									<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-2">
										<Image
											src="/assets/imgs/ifma-avalia-logo.webp"
											alt="Logo IFMA Avalia"
											width={42}
											height={42}
											className="h-auto w-auto"
										/>
									</div>
									<div>
										<p className="text-sm text-green-100">Sistema de apoio à gestão</p>
										<p className="text-xl font-black">IFMA Avalia</p>
									</div>
								</div>
								<p className="text-2xl font-black leading-tight">
									Avaliação mais organizada, evidências mais acessíveis e decisões mais consistentes.
								</p>
							</div>
						</div>
					</div>
				</section> */}
			</div>
		</main>
	);
}

function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
	const alignmentClass = align === 'center' ? 'mx-auto text-center' : '';
	const descriptionClass = align === 'center' ? 'mx-auto' : '';

	return (
		<div className={`max-w-3xl ${alignmentClass}`}>
			<p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">{eyebrow}</p>
			<h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
			{description ? (
				<p className={`mt-4 max-w-2xl text-base leading-8 text-gray-600 ${descriptionClass}`}>
					{description}
				</p>
			) : null}
		</div>
	);
}

function HomeHeader() {
	const { data, isPending } = useSession();
	const user = data?.user ?? null;

	return (
		<header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-green-600 px-4 text-white md:px-8">
			<Link href="/" className="flex min-w-0 items-center gap-3">
				<Image
					src="/assets/imgs/ifma-avalia-logo.webp"
					alt="IFMA Avalia Logo"
					width={24}
					height={24}
					className="shrink-0 brightness-0 invert"
					priority
				/>
				<span className="truncate text-lg font-semibold">IFMA Avalia</span>
			</Link>

			<div className="flex min-w-0 items-center gap-3">
				<div className="flex items-center gap-2">
					<Button asChild variant="outline" size="sm">
						<Link href="/courses" className="text-black">
							Acessar cursos
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
					{isPending ? (
						<Skeleton className="h-8 w-8 rounded-full" />
					) : user ? (
						<NavUser user={user} hideInfo={true} />
					) : (
						<Button asChild variant="outline" size="sm">
							<Link href="/sign-in" className="text-black">
								Login
							</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}

function InfoCard({ icon, title, description, variant = 'green' }: InfoCardProps) {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/5">
			<div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ring-1 ${variantStyles[variant]}`}>
				{icon}
			</div>
			<h3 className="text-lg font-bold text-gray-900">{title}</h3>
			<p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
		</div>
	);
}
