import { cn } from '@/lib/utils';
import {
  FileIcon,
  LinkIcon,
  PlusCircle,
  UploadCloud,
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useId,
  useState
} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { validateLink } from '@/utils/validateLink';

type ExistingFile = {
  fileName: string;
  sizeBytes?: number | null;
  url?: string | null;
  publicId?: string;
};

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
}

const FileUpload = ({
  evidenceSlug,
  initialLinks = [''],
  initialLinkItems,
  initialFiles = [],
  onStateChange,
  courseId,
  requirementId,
  courseSlug,
  indicatorCode,
  evaluationYear,
  onLinkSaved,
  isLoading
}: FileUploadProps) => {
  const reactId = useId();
  const idBase = `file-upload-${reactId}-${evidenceSlug}`;
  const [linkItems, setLinkItems] = useState<LinkItem[]>([]);
  const [linkErrors, setLinkErrors] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [currentFiles, setCurrentFiles] =
    useState<ExistingFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    let base: LinkItem[] = [];
    if (initialLinkItems && initialLinkItems.length > 0) {
      base = initialLinkItems.map((li) => ({
        id: li.id,
        text: li.text ?? '',
        url: li.url ?? ''
      }));
    } else if (initialLinks && initialLinks.length > 0) {
      base = initialLinks.map((u) => ({ text: '', url: u }));
    } else {
      base = [];
    }

    setLinkItems(base);
    setLinkErrors(Array(base.length).fill(''));
    setCurrentFiles(initialFiles);
    setFilesToUpload([]);
  }, [evidenceSlug, initialLinks, initialLinkItems, initialFiles]);

  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

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
      setDeletingId(publicId);
      setCurrentFiles((prev) => prev.filter((f) => f.publicId !== publicId));
      return { previous };
    },
    onError: (err: unknown, _vars, ctx?: DeleteFileContext) => {
      if (ctx?.previous) setCurrentFiles(ctx.previous);
      console.error('Falha ao deletar arquivo:', err);
    },
    onSettled: async () => {
      setDeletingId(null);
      if (onLinkSaved) {
        onLinkSaved();
        return;
      }
      if (courseSlug && indicatorCode && evaluationYear != null) {
        try {
          await queryClient.invalidateQueries({
            queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
          });
        } catch {
          /* ignore */
        }
        return;
      }
      try {
        await queryClient.invalidateQueries({ queryKey: ['indicator'] });
      } catch {
        /* ignore */
      }
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
      setIsSavingLink(true);

      const previous = linkItems;

      setLinkItems((prev) => [
        ...prev,
        { text: newLink.text, url: newLink.url }
      ]);
      setEditingLink(null);
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
    onError: (err: unknown, newLink, context?: { previous: LinkItem[] }) => {
      if (context?.previous) setLinkItems(context.previous);
      setSaveError(err instanceof Error ? err.message : String(err));
    },
    onSettled: async () => {
      setIsSavingLink(false);
      if (onLinkSaved) {
        onLinkSaved();
        return;
      }
      if (courseSlug && indicatorCode && evaluationYear != null) {
        try {
          await queryClient.invalidateQueries({
            queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
          });
        } catch {
          /* ignore */
        }
        return;
      }
      // fallback: try to invalidate generic indicator queries
      try {
        await queryClient.invalidateQueries({ queryKey: ['indicator'] });
      } catch {
        /* ignore */
      }
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
    onError: (err: unknown, _vars, ctx?: DeleteLinkContext) => {
      if (ctx?.previous) setLinkItems(ctx.previous);
      console.error('Falha ao deletar link:', err);
    },
    onSettled: async () => {
      setDeletingLinkId(null);
      if (onLinkSaved) {
        onLinkSaved();
        return;
      }
      if (courseSlug && indicatorCode && evaluationYear != null) {
        try {
          await queryClient.invalidateQueries({
            queryKey: ['indicator', courseSlug, indicatorCode, evaluationYear]
          });
        } catch {
          /* ignore */
        }
        return;
      }
      try {
        await queryClient.invalidateQueries({ queryKey: ['indicator'] });
      } catch {
        /* ignore */
      }
    }
  });

  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    onStateChange(evidenceSlug, {
      links: linkItems.map((li) => li.url).filter((l) => l.trim()),
      filesToUpload,
      linkItems
    });
  }, [linkItems, filesToUpload, onStateChange, evidenceSlug]);

  const handleFilesSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;
      const newFilesArray = Array.from(selectedFiles);
      let validationError = '';
      const allowedType = 'application/pdf';
      const maxSize = 10 * 1024 * 1024; // 10MB

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
    setFilesToUpload((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
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
      {initialLinkItems?.length ||
      (initialLinks && initialLinks.filter(Boolean).length) ? (
        <div className="space-y-2">
          <Label className="text-muted-foreground font-medium italic">
            Links
          </Label>
          <p className="text-muted-foreground text-xs font-medium">
            Links salvos:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {(linkItems.length > 0 ? linkItems : []).map((l, idx) => (
              <li
                key={`saved-link-${l.id || idx}`}
                className="border-b-muted flex items-center gap-2 border-b-2 pb-1"
              >
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-700 hover:underline"
                  onClick={() => {}}
                >
                  {l.text || l.url}
                </a>
                {l.id && courseId && requirementId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-6 w-6"
                    disabled={deleteLinkMutation.isPending}
                    onClick={() => {
                      deleteLinkMutation.mutate({
                        courseId,
                        requirementId,
                        linkId: l.id!
                      });
                    }}
                    aria-label="Remover link"
                  >
                    {deleteLinkMutation.isPending && deletingLinkId === l.id ? (
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

      <div className="space-y-3">
        {editingLink && (
          <div className="space-y-1 pt-2">
            <p className="text-muted-foreground text-sm">
              Preencha os campos e clique em Salvar.
            </p>
            <div className="grid grid-cols-1 items-start gap-2 sm:[grid-template-columns:1fr_2fr_auto]">
              <div className="relative">
                <Input
                  id={`${idBase}-edit-link-text`}
                  placeholder={`Texto do link`}
                  value={editingLink.text}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, text: e.target.value })
                  }
                  disabled={isSavingLink}
                />
              </div>
              <div className="relative">
                <LinkIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id={`${idBase}-edit-link-url`}
                  placeholder={`URL`}
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                  onBlur={() => validateLink(editingLink.url, setLinkErrors, 0)}
                  className={`pl-10 ${linkErrors[0] ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  disabled={isSavingLink}
                />
              </div>
              <div className="flex justify-end gap-2 sm:self-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingLink(null)}
                  disabled={isSavingLink}
                  aria-label="Cancelar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          </div>
        )}
        <div className="flex items-center gap-2">
          {!editingLink ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingLink({ text: '', url: '' })}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar link
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSaveError('');
                if (!editingLink) return;
                if (!editingLink.text.trim()) {
                  setSaveError('Informe o texto do link');
                  return;
                }
                validateLink(editingLink.url, setLinkErrors, 0);
                try {
                  new URL(editingLink.url);
                } catch {
                  setLinkErrors((prev) => {
                    const next = [...prev];
                    next[0] = 'URL inválida';
                    return next;
                  });
                  return;
                }

                if (!courseId || !requirementId) {
                  setSaveError('Dados insuficientes para salvar.');
                  return;
                }

                saveLinkMutation.mutate({
                  courseId,
                  requirementId,
                  text: editingLink.text.trim(),
                  url: editingLink.url.trim()
                });
              }}
              disabled={isSavingLink || saveLinkMutation.isPending}
              className="bg-green-600 text-white hover:cursor-pointer hover:bg-green-700"
            >
              {isSavingLink || saveLinkMutation.isPending
                ? 'Salvando...'
                : 'Salvar link'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${idBase}-file-upload`}
          className="text-muted-foreground font-medium italic"
        >
          Arquivos PDF
        </Label>

        {currentFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">
              Arquivos salvos:
            </p>
            {currentFiles.map((f, index) => (
              <div
                key={`existing-${f.publicId || index}`}
                className="bg-muted/30 flex h-12 items-center justify-between rounded-md border p-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0">
                    {f.url ? (
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate font-medium text-blue-600 hover:underline"
                        title={f.fileName}
                      >
                        {f.fileName}
                      </a>
                    ) : (
                      <span className="truncate font-medium" title={f.fileName}>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
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
                  {deleteFileMutation.isPending && deletingId === f.publicId ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

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
        {fileError && <p className="pt-1 text-sm text-red-600">{fileError}</p>}

        {filesToUpload.length > 0 && (
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
