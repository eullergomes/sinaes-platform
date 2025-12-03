import React, {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useId,
  useState
} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { validateLink } from '@/utils/validateLink';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import { toast } from 'sonner';
import {
  FileIcon,
  LinkIcon,
  PlusCircle,
  UploadCloud,
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import { ExistingFile } from '@/types/indicator-types';

interface LinkItem {
  id?: string;
  text: string;
  url: string;
}

interface FileUploadProps {
  evidenceSlug: string;
  initialLinks?: string[];
  initialLinkItems?: LinkItem[];
  initialFiles?: ExistingFile[];
  onStateChange: (
    slug: string,
    state: { links: string[]; filesToUpload: File[]; linkItems?: LinkItem[] }
  ) => void;
  courseId?: string;
  requirementId?: string;
  courseSlug?: string;
  indicatorCode?: string;
  evaluationYear?: number | null;
  onLinkSaved?: () => void;
  isLoading: boolean;
  newlySavedFiles?: ExistingFile[];
  readOnly?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  evidenceSlug,
  initialLinks = [],
  initialLinkItems,
  initialFiles = [],
  onStateChange,
  courseId,
  requirementId,
  courseSlug,
  indicatorCode,
  evaluationYear,
  onLinkSaved,
  isLoading,
  newlySavedFiles,
  readOnly = false
}) => {
  const reactId = useId();
  const idBase = `file-upload-${reactId}-${evidenceSlug}`;
  const [linkItems, setLinkItems] = useState<LinkItem[]>([]);
  const [linkErrors, setLinkErrors] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [currentFiles, setCurrentFiles] =
    useState<ExistingFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const [saveError, setSaveError] = useState('');
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  useEffect(() => {
    let base: LinkItem[] = [];
    if (initialLinkItems && initialLinkItems.length > 0) {
      base = initialLinkItems
        .filter((li) => li.url && li.url.trim() !== '')
        .map((li) => ({
          id: li.id,
          text: li.text ?? '',
          url: li.url ?? ''
        }));
    } else if (initialLinks && initialLinks.length > 0) {
      base = initialLinks
        .filter((u) => !!u && u.trim() !== '')
        .map((u) => ({ text: '', url: u }));
    }

    // Atualiza linkItems com base nas props sem apagar adições otimistas
    setLinkItems((prev) => {
      const keepPrev = base.length === 0 && prev.length > 0; // evita apagar otimista
      const sameLength = prev.length === base.length;
      const sameValues =
        sameLength &&
        prev.every(
          (p, i) =>
            p.id === base[i]?.id &&
            p.url === base[i]?.url &&
            p.text === base[i]?.text
        );
      return keepPrev || sameValues ? prev : base;
    });
    if (base.length > 0) setLinkErrors(Array(base.length).fill(''));

    setCurrentFiles(initialFiles);
  }, [evidenceSlug, initialLinks, initialLinkItems, initialFiles]);

  // Limpa arquivos selecionados apenas quando muda o evidenceSlug (troca de documento)
  useEffect(() => {
    setFilesToUpload([]);
  }, [evidenceSlug]);

  // Quando recebem arquivos recém-salvos do pai (após submit bem-sucedido),
  // move da lista de novos para a lista de existentes imediatamente.
  useEffect(() => {
    if (newlySavedFiles && newlySavedFiles.length > 0) {
      setCurrentFiles((prev) => {
        const existingIds = new Set(
          prev.map((f) =>
            f.publicId ? f.publicId : `${f.fileName}-${f.sizeBytes || ''}`
          )
        );
        const toAdd = newlySavedFiles.filter(
          (f) =>
            !existingIds.has(
              f.publicId ? f.publicId : `${f.fileName}-${f.sizeBytes || ''}`
            )
        );
        return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
      });
      // Limpa localmente os arquivos que estavam aguardando upload
      setFilesToUpload([]);
    }
  }, [newlySavedFiles]);

  const queryClient = useQueryClient();

  interface DeleteFileContext {
    previous: ExistingFile[];
  }
  const deleteFileMutation = useMutation({
    mutationFn: async (payload: {
      courseId: string;
      requirementId: string;
      publicId: string;
    }) => {
      const res = await fetch('/api/evidences/delete-file', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok)
        throw new Error((await res.json()).error || 'Erro ao deletar arquivo');
      return res.json();
    },
    onMutate: async ({ publicId }) => {
      const previous = currentFiles;
      setDeletingFileId(publicId);
      setCurrentFiles((prev) => prev.filter((f) => f.publicId !== publicId));
      return { previous };
    },
    onError: (_err, _vars, ctx?: DeleteFileContext) => {
      if (ctx?.previous) setCurrentFiles(ctx.previous);
    },
    onSettled: async () => {
      setDeletingFileId(null);
      if (courseSlug && indicatorCode && evaluationYear != null) {
        await queryClient.invalidateQueries({
          queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['indicator'] });
      }
      onLinkSaved?.();
    }
  });

  const saveLinkMutation = useMutation({
    mutationFn: async (payload: {
      courseId: string;
      requirementId: string;
      text: string;
      url: string;
    }) => {
      const res = await fetch('/api/evidences/save-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok)
        throw new Error((await res.json()).error || 'Erro ao salvar link');
      return res.json();
    },
    onMutate: async (newLink) => {
      setSaveError('');
      const previous = linkItems;
      setLinkItems((prev) => [
        ...prev,
        { text: newLink.text, url: newLink.url }
      ]);
      return { previous };
    },
    onSuccess: (data) => {
      if (data?.linkId) {
        setLinkItems((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (!next[i].id) {
              next[i] = { ...next[i], id: data.linkId };
              break;
            }
          }
          return next;
        });
      }
    },
    onError: (err: unknown, _vars, ctx?: { previous: LinkItem[] }) => {
      if (ctx?.previous) setLinkItems(ctx.previous);
      const message =
        err instanceof Error ? err.message : 'Erro ao salvar link';
      toast.error(message);
    },
    onSettled: async () => {
      if (courseSlug && indicatorCode && evaluationYear != null) {
        await queryClient.invalidateQueries({
          queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['indicator'] });
      }
      onLinkSaved?.();
    }
  });

  interface DeleteLinkContext {
    previous: LinkItem[];
  }
  const deleteLinkMutation = useMutation({
    mutationFn: async (payload: {
      courseId: string;
      requirementId: string;
      linkId: string;
    }) => {
      const res = await fetch('/api/evidences/delete-link', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok)
        throw new Error((await res.json()).error || 'Erro ao deletar link');
      return res.json();
    },
    onMutate: async ({ linkId }) => {
      const previous = linkItems;
      setDeletingLinkId(linkId);
      setLinkItems((prev) => prev.filter((l) => l.id !== linkId));
      return { previous };
    },
    onError: (_err, _vars, ctx?: DeleteLinkContext) => {
      if (ctx?.previous) setLinkItems(ctx.previous);
    },
    onSettled: async () => {
      setDeletingLinkId(null);
      if (courseSlug && indicatorCode && evaluationYear != null) {
        await queryClient.invalidateQueries({
          queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['indicator'] });
      }
      onLinkSaved?.();
    }
  });

  // propagate state upward
  useEffect(() => {
    onStateChange(evidenceSlug, {
      links: linkItems.map((li) => li.url),
      filesToUpload,
      linkItems
    });
  }, [evidenceSlug, linkItems, filesToUpload, onStateChange]);

  const handleFilesSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;
      const newFilesArray = Array.from(selectedFiles);
      let validationError = '';
      const allowedType = 'application/pdf';
      const maxSize = 10 * 1024 * 1024;
      for (const file of newFilesArray) {
        if (file.type !== allowedType) {
          validationError = 'Apenas arquivos PDF são permitidos.';
          break;
        }
        if (file.size > maxSize) {
          validationError = `Tamanho máximo por arquivo: ${maxSize / 1024 / 1024}MB.`;
          break;
        }
      }
      if (validationError) {
        setFileError(validationError);
        return;
      }
      setFileError('');
      const filesToAdd = newFilesArray.filter(
        (nf) =>
          !filesToUpload.some(
            (ef) => ef.name === nf.name && ef.size === nf.size
          )
      );
      setFilesToUpload((prev) => [...prev, ...filesToAdd]);
    },
    [filesToUpload]
  );

  const removeFileToUpload = (indexToRemove: number) => {
    setFilesToUpload((prev) => prev.filter((_, i) => i !== indexToRemove));
    setFileError('');
  };
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFilesSelect(e.dataTransfer.files);
    },
    [handleFilesSelect]
  );
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleFileChangeFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFilesSelect(e.target.files);
    e.target.value = '';
  };

  return (
    <div
      className={cn(
        'w-full space-y-4',
        isLoading && 'pointer-events-none opacity-50'
      )}
    >
      {linkItems.some((li) => li.url && li.url.trim() !== '') ? (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">
            Links salvos:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {linkItems
              .filter((l) => l.url && l.url.trim() !== '')
              .map((l, idx) => (
                <li
                  key={`saved-link-${l.id || idx}`}
                  className="border-b-muted flex items-center gap-2 border-b-2 pb-1"
                >
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-blue-700 hover:underline"
                  >
                    {l.text || l.url}
                  </a>
                  {!readOnly && l.id && courseId && requirementId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-6 w-6"
                      disabled={
                        deleteLinkMutation.isPending && deletingLinkId === l.id
                      }
                      onClick={() =>
                        deleteLinkMutation.mutate({
                          courseId,
                          requirementId,
                          linkId: l.id!
                        })
                      }
                      aria-label="Remover link"
                    >
                      {deleteLinkMutation.isPending &&
                      deletingLinkId === l.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {!readOnly && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSaveError('');
              setLinkErrors([]);
              setEditingLink({ text: '', url: '' });
              setIsAddDialogOpen(true);
            }}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar link
          </Button>
        </div>
      )}

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (saveLinkMutation.isPending) return;
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingLink(null);
            setSaveError('');
            setLinkErrors([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bold">Adicionar link</DialogTitle>
            <DialogDescription>
              Informe o texto e a URL do link da evidência.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${idBase}-dialog-link-text`}>
                Texto do link
              </Label>
              <Input
                id={`${idBase}-dialog-link-text`}
                placeholder="Texto"
                value={editingLink?.text || ''}
                onChange={(e) =>
                  setEditingLink((prev) => ({
                    ...(prev || { text: '', url: '' }),
                    text: e.target.value
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${idBase}-dialog-link-url`}>URL</Label>
              <div className="relative">
                <LinkIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id={`${idBase}-dialog-link-url`}
                  placeholder="Digite ou cole um link"
                  className={`pl-10 ${linkErrors[0] ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  value={editingLink?.url || ''}
                  onChange={(e) =>
                    setEditingLink((prev) => ({
                      ...(prev || { text: '', url: '' }),
                      url: e.target.value
                    }))
                  }
                  onBlur={() =>
                    editingLink &&
                    validateLink(editingLink.url, setLinkErrors, 0)
                  }
                />
              </div>
              {linkErrors[0] && (
                <p className="mt-1 text-sm text-red-600">{linkErrors[0]}</p>
              )}
            </div>
            {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                setSaveError('');
                const payload = editingLink;
                if (!payload) return;
                if (!payload.text.trim()) {
                  setSaveError('Informe o texto do link');
                  return;
                }
                validateLink(payload.url, setLinkErrors, 0);
                try {
                  new URL(payload.url);
                } catch {
                  setLinkErrors((prev) => {
                    const next = [...prev];
                    next[0] = 'Link inválido';
                    return next;
                  });
                  return;
                }
                if (!courseId || !requirementId) {
                  setSaveError('Dados insuficientes para salvar.');
                  return;
                }
                setIsAddDialogOpen(false);
                setEditingLink(null);
                saveLinkMutation.mutate({
                  courseId,
                  requirementId,
                  text: payload.text.trim(),
                  url: payload.url.trim()
                });
              }}
            >
              Salvar link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {currentFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">
              Arquivos salvos:
            </p>
            {currentFiles.map((f, index) => (
              <div
                key={`existing-${f.publicId || index}`}
                className="bg-muted/30 flex h-12 items-center justify-between rounded-md border p-3 text-sm"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <FileIcon className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                  <div className="w-full min-w-0">
                    {f.url ? (
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full truncate font-medium text-blue-600 hover:underline"
                        title={f.fileName}
                      >
                        {f.fileName}
                      </a>
                    ) : (
                      <span
                        className="block w-full truncate font-medium"
                        title={f.fileName}
                      >
                        {f.fileName}
                      </span>
                    )}
                    {f.sizeBytes && (
                      <div className="text-muted-foreground text-[10px]">
                        {(f.sizeBytes / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-7 w-7 flex-shrink-0"
                    disabled={isLoading || deleteFileMutation.isPending}
                    onClick={() => {
                      if (!courseId || !requirementId || !f.publicId) return;
                      deleteFileMutation.mutate({
                        courseId,
                        requirementId,
                        publicId: f.publicId
                      });
                    }}
                    aria-label="Remover arquivo"
                  >
                    {deleteFileMutation.isPending &&
                    deletingFileId === f.publicId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              'border-input relative flex h-24 items-center justify-center rounded-lg border-2 border-dashed p-4 text-center',
              isDragging && 'border-primary bg-muted/30'
            )}
          >
            <input
              id={`${idBase}-file-upload`}
              type="file"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              accept="application/pdf,.pdf"
              onChange={handleFileChangeFromInput}
              multiple
              disabled={isLoading}
            />
            <label
              htmlFor={`${idBase}-file-upload`}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center space-y-1',
                isLoading && 'cursor-not-allowed'
              )}
            >
              <UploadCloud className="text-muted-foreground mx-auto h-6 w-6" />
              <span className="text-muted-foreground text-xs">
                Arraste ou{' '}
                <span className="text-primary font-medium">
                  clique para enviar
                </span>{' '}
                PDFs
              </span>
              <span className="text-muted-foreground text-[10px]">
                (Máx 10MB cada)
              </span>
            </label>
          </div>
        )}
        {!readOnly && fileError && (
          <p className="pt-1 text-sm text-red-600">{fileError}</p>
        )}

        {!readOnly && filesToUpload.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Novos arquivos:</p>
            {filesToUpload.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between border p-2 text-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileIcon className="text-primary h-4 w-4 shrink-0" />
                  <span className="truncate" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFileToUpload(index)}
                  disabled={isLoading}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
