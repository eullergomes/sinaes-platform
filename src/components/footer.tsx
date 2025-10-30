import React from 'react';
import { Separator } from '@/components/ui/separator';
import { BookMarked, Building } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-green-600 text-sm text-muted-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="flex-1 space-y-2">
            <a 
              href="https://caxias.ifma.edu.br/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block"
              aria-label="Página inicial do IFMA Campus Caxias"
            >
              <Image
                src="/assets/imgs/logo-ifma-horizontal-fundo-branco.png"
                alt="Logo do IFMA Campus Caxias"
                width={200}
                height={57}
                className="h-auto"
              />
            </a>
            <h3 className="font-semibold text-white">Plataforma de Monitoramento SINAES</h3>
            <p className='text-white'>
              © {currentYear} Instituto Federal do Maranhão (IFMA)
              <br />
              Campus Caxias - Todos os direitos reservados.
            </p>
          </div>

          <div className="flex-1 space-y-2 text-left">
            <h4 className="font-semibold text-white">Links Úteis</h4>
            <nav>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/avaliacao-in-loco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary hover:underline text-white"
                  >
                    <BookMarked className="h-4 w-4" />
                    Sobre o SINAES (INEP)
                  </a>
                </li>
                <li>
                  <a
                    href="https://caxias.ifma.edu.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary hover:underline text-white"
                  >
                    <Building className="h-4 w-4" />
                    Site do IFMA - Campus Caxias
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex-1 space-y-2 md:text-left lg:text-right">
             <h4 className="font-semibold text-white">Sobre esta Plataforma</h4>
             <p className='text-white'>
                Esta ferramenta é um projeto de TCC do curso de
                Bacharelado em Ciência da Computação.
             </p>
          </div>
        </div>
        
        <Separator className="my-6" />

        <div className="text-center text-xs">
          <p className='text-white'>
            Desenvolvido por <span className="font-semibold text-white">
              <Link href="https://github.com/eullergomes" target="_blank" rel="noopener noreferrer" className='underline'>
                Euller Gomes Teixeira
              </Link>
            </span>
          </p>
          <p className='text-white'>
            Orientador: Prof. Luis Fernando M.S. Silva
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
