import React from 'react';
import { FileText, BarChart3, ShieldCheck, Database } from 'lucide-react';
import BackButton from '@/components/back-button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="">
        <BackButton url="/courses" label="Voltar para Início" />
        {/* Cabeçalho Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-green-700 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Sobre a Plataforma
            </h1>
            <p className="text-lg max-w-2xl">
              IFMA Avalia - Sistema de Monitoramento e Gestão Estratégica dos Indicadores do SINAES.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none text-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contextualização</h3>
              <p className="mb-4 leading-relaxed">
                Esta plataforma foi desenvolvida como produto do Trabalho de Conclusão de Curso (TCC) do curso Bacharelado em Ciência da Computação. 
                O objetivo central é solucionar a dificuldade de sistematização e uso estratégico dos dados gerados pelos processos de avaliação 
                institucional (SINAES).
              </p>
              <p className="mb-6 leading-relaxed">
                A ferramenta centraliza o acompanhamento dos indicadores de qualidade dos cursos de graduação, permitindo que Coordenadores, 
                Membros do NDE e a Comissão Própria de Avaliação (CPA) transformem dados avaliativos em ações concretas de melhoria.
              </p>
            </div>
          </div>
        </div>

        {/* Funcionalidades Chave */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
            title="Monitoramento Contínuo"
            description="Acompanhamento visual das notas (1 a 5) de cada indicador, organizados pelas dimensões oficiais do SINAES."
          />
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-green-600" />}
            title="Gestão de Evidências"
            description="Envio seguro de documentos comprobatórios (PDFs) e links, vinculando a avaliação qualitativa à prova documental."
          />
          <FeatureCard 
            icon={<Database className="w-6 h-6 text-purple-600" />}
            title="Reuso Inteligente"
            description="Documentos comuns são compartilhados automaticamente entre indicadores, eliminando retrabalho."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-red-600" />}
            title="Planos de Ação"
            description="Registro opcional de justificativas e ações corretivas para indicadores com desempenho insuficiente."
          />
        </div>

        {/* Informações Técnicas e Créditos */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Créditos e Ficha Técnica
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Desenvolvimento</h4>
              <p className="text-gray-600 mb-1">Euller Gomes Teixeira</p>
              <p className="text-gray-500">Graduando em Ciência da Computação</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Orientação</h4>
              <p className="text-gray-600 mb-1">Prof. Dr. Luis Fernando M.S Silva</p>
              <p className="text-gray-500">IFMA Campus Caxias</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tecnologias</h4>
              <p className="text-gray-600">
                Next.js 14, TypeScript, MongoDB, Prisma, MinIO (Docker), Tailwind CSS.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Versão</h4>
              <p className="text-gray-600">
                1.0.0 (Beta de Validação)
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Instituto Federal do Maranhão - Campus Caxias. Todos os direitos reservados.
          </div>
        </div> */}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}