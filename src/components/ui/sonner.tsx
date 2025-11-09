'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';
import { XCircle } from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light'}
      className="toaster group"
      richColors
      icons={{
        error: <XCircle aria-hidden className="h-5 w-5" />
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
