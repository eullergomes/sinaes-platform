import { useCallback, useEffect, useRef, useState } from 'react';

export type Visitor = {
  id: string;
  name: string;
  email?: string;
};

export function useVisitorsSearch(open: boolean, query: string) {
  const [items, setItems] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (signal: AbortSignal, q: string) => {
    const url = '/api/visitors' + (q ? `?query=${encodeURIComponent(q)}` : '');
    const res = await fetch(url, { signal });
    const data = (await res.json()) as Visitor[];
    return Array.isArray(data) ? data : [];
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const data = await run(controller.signal, query);
        setItems(data);
      } catch (e: unknown) {
        const err = e as { name?: string } | undefined;
        if (err?.name === 'AbortError') return;
        setError('Não foi possível carregar os usuários.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [open, query, run]);

  return { items, loading, error };
}
