"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronsUpDown, Loader2, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

type Coordinator = {
  id: string
  name: string
  email?: string
}

type CoordinatorAutocompleteProps = {
  value?: Coordinator | null
  onChange: (c: Coordinator | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

// Debounce helper to avoid flicker when typing
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function CoordinatorAutocomplete({
  value,
  onChange,
  placeholder = "Selecione o coordenador",
  disabled,
  className,
}: CoordinatorAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounced(query, 300)
  const [items, setItems] = useState<Coordinator[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return
      if (e.target instanceof Node && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const run = async () => {
      try {
        const url = 
          "/api/coordinators" + (debouncedQuery ? `?query=${encodeURIComponent(debouncedQuery)}` : "")
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          // API ainda não implementada: fornecemos uma lista local mínima como fallback
          const fallback: Coordinator[] = [
            { id: "1", name: "Coordenador(a) Fulano", email: "fulano@ifma.edu.br" },
            { id: "2", name: "Coordenador(a) Sicrana", email: "siclana@ifma.edu.br" },
            { id: "3", name: "Prof. João Silva", email: "joao.silva@ifma.edu.br" },
          ].filter((c) =>
            debouncedQuery
              ? c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                (c.email ?? "").toLowerCase().includes(debouncedQuery.toLowerCase())
              : true
          )
          setItems(fallback)
        } else {
          const data = (await res.json()) as Coordinator[]
          setItems(Array.isArray(data) ? data : [])
        }
      } catch (e: unknown) {
        const err = e as { name?: string } | undefined
        if (err?.name === "AbortError") return
        setError("Não foi possível carregar os coordenadores.")
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    run()
    // cancel on unmount or query change
    return () => controller.abort()
  }, [open, debouncedQuery])

  return (
    <div ref={rootRef} className={`w-full ${className ?? ""}`}>
      <div className="relative w-full rounded-md border shadow-xs">
        {/* Search row */}
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Search className="size-4 text-muted-foreground" />
          <div className="relative flex-1">
            {/* When user types, we keep showing their text in the same input; selection is only cleared by the X button or by picking a new result. */}
            <Input
              disabled={disabled}
              value={query || value?.name || ""}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              placeholder={!value && !query ? placeholder : ""}
              className="h-8 w-full border-0 p-0 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
            />
          </div>
          {(query || value) && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                onChange(null)
                setOpen(false)
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

        {/* Results inside same container */}
        {open && (
          <div className="border-t">
            {loading ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Carregando...
              </div>
            ) : error ? (
              <div className="px-2 py-1.5 text-sm text-destructive">{error}</div>
            ) : items.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">Nenhum coordenador encontrado</div>
            ) : (
              <ul className="max-h-64 overflow-y-auto py-1">
                {items.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(c)
                        setQuery("")
                        setOpen(false)
                      }}
                      className="w-full px-2 py-1.5 text-left hover:bg-accent"
                    >
                      <span className="text-sm font-medium">{c.name}</span>
                      {c.email ? (
                        <span className="ml-2 text-xs text-muted-foreground">{c.email}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export type { Coordinator, CoordinatorAutocompleteProps }
