'use client';

import React from 'react';

type PrintButtonProps = {
  label?: string;
  className?: string;
};

const PrintButton: React.FC<PrintButtonProps> = ({
  label = 'Exportar PDF',
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={async () => {
        // Esperar fontes e imagens carregarem para cálculo correto de altura
        try {
          if (document.fonts?.ready) {
            await document.fonts.ready;
          }
          const imgs = Array.from(document.images).filter(
            (img) => !img.complete
          );
          if (imgs.length > 0) {
            await Promise.all(
              imgs.map(
                (img) =>
                  new Promise<void>((resolve) => {
                    img.addEventListener('load', () => resolve(), {
                      once: true
                    });
                    img.addEventListener('error', () => resolve(), {
                      once: true
                    });
                  })
              )
            );
          }
          // Pequeno delay + frame para estabilizar layout pós-carregamento
          await new Promise((r) =>
            requestAnimationFrame(() => setTimeout(r, 60))
          );

          const docHeight = document.documentElement.scrollHeight;
          const winHeight = window.innerHeight;
          if (docHeight <= winHeight * 1.05) {
            document.body.classList.add('single-print-page');
          } else {
            document.body.classList.remove('single-print-page');
          }
        } catch {
          // Em caso de erro, procede normalmente
          document.body.classList.remove('single-print-page');
        }
        window.print();
        setTimeout(
          () => document.body.classList.remove('single-print-page'),
          3000
        );
      }}
      className={`inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none print:hidden ${className} cursor-pointer`}
    >
      {label}
    </button>
  );
};

export default PrintButton;
