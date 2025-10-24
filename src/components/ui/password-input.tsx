'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, containerClassName, ...props }, ref) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className={cn('relative', containerClassName)}>
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'pr-10',
          className
        )}
        {...props}
      />
      <button
        type="button"
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        onClick={() => setShow((s) => !s)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
        tabIndex={-1}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
