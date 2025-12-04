'use client';

import { ChevronsUpDown, Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { useVisitorsSearch } from '@/hooks/useVisitorsSearch';

type Coordinator = {
  id: string;
  name: string;
  email?: string;
};

type CoordinatorAutocompleteProps = {
  value?: Coordinator | null;
  onChange: (c: Coordinator | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const CoordinatorAutocomplete = ({
  value,
  onChange,
  placeholder = 'Selecionar coordenador(a)',
  disabled,
  className
}: CoordinatorAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounced(query, 300);
  const [items, setItems] = useState<Coordinator[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        rootRef.current &&
        e.target instanceof Node &&
        !rootRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const {
    items: fetchedItems,
    loading,
    error
  } = useVisitorsSearch(open, debouncedQuery);
  useEffect(() => {
    setItems(fetchedItems);
  }, [fetchedItems]);

  return (
    <div ref={rootRef} className={`w-full ${className ?? ''}`}>
      <div className="relative w-full rounded-md border shadow-xs">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Search className="text-muted-foreground size-4" />
          <div className="relative flex-1">
            <Input
              disabled={disabled}
              value={query || value?.name || ''}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              placeholder={!value && !query ? placeholder : ''}
              className="h-8 w-full border-0 p-0 shadow-none focus-visible:border-transparent focus-visible:ring-0"
            />
          </div>
          {(query || value) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onChange(null);
                setOpen(false);
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Limpar seleção"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Alternar lista"
          >
            <ChevronsUpDown className="size-4" />
          </button>
        </div>
        {open && (
          <div className="border-t">
            {loading ? (
              <div className="text-muted-foreground flex items-center gap-2 px-2 py-1.5 text-sm">
                <Loader2 className="size-4 animate-spin" /> Carregando...
              </div>
            ) : error ? (
              <div className="text-destructive px-2 py-1.5 text-sm">
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground px-2 py-1.5 text-sm">
                Nenhum usuário encontrado
              </div>
            ) : (
              <ul className="max-h-64 overflow-y-auto py-1">
                {items.map((c) => (
                  <li
                    key={c.id}
                    className="border-b last:border-b-0 sm:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onChange(c);
                        setQuery('');
                        setOpen(false);
                      }}
                      className="hover:bg-accent w-full px-2 py-1.5 text-left"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">
                          {c.name}
                        </span>
                        {c.email ? (
                          <span className="text-muted-foreground truncate text-xs">
                            {c.email}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CoordinatorAutocomplete;
