'use client';

import { useId, useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileText, X, Link as LinkIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ExistingFile = {
  fileName: string;
  sizeBytes?: number | null;
  url?: string | null;
};

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onLinkChange: (link: string) => void;
  initialLink?: string;
  initialFiles?: ExistingFile[];
}

export const FileUpload = ({ onFilesChange, onLinkChange, initialLink = '', initialFiles = [] }: FileUploadProps) => {
  const reactId = useId();
  const idBase = `file-upload-${reactId}`;
  const [link, setLink] = useState(initialLink);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

  const validateLink = (url: string) => {
    if (url && !urlRegex.test(url)) {
      setError('Por favor, insira um link válido.');
      return false;
    }
    setError((prevError) => (prevError.includes('link válido') ? '' : prevError));
    return true;
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);
    onLinkChange(newLink);
    validateLink(newLink);
  };

  useEffect(() => {
    setLink(initialLink ?? '');
  }, [initialLink]);

  const handleFilesSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles);
    let validationError = '';

    for (const file of newFiles) {
      if (file.type !== 'application/pdf') {
        validationError = 'Apenas arquivos PDF são permitidos.';
        break;
      }
      if (file.size > 10 * 1024 * 1024) {
        validationError = 'O tamanho máximo por arquivo é 10MB.';
        break;
      }
    }
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

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

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFilesSelect(e.dataTransfer.files);
  }, [handleFilesSelect]);

  const handleFileChangeFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFilesSelect(e.target.files);
     e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setError('');
  };

  const clearAllSelected = () => {
    setFiles([]);
    onFilesChange([]);
  };

  return (
    <div className="w-full space-y-4">
      {/* Campo para o Link */}
      <div className="space-y-2">
        <Label htmlFor="drive-link" className='italic font-medium text-muted-foreground'>Links</Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id={`${idBase}-drive-link`}
            placeholder="Cole o link do Google Drive, OneDrive, etc."
            value={link}
            onChange={handleLinkChange}
            className="pl-10 pr-10"
          />
          {link && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Limpar link"
              title="Limpar link"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => { setLink(''); onLinkChange(''); }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {initialLink && (
          <a
            href={initialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 hover:underline"
          >
            Abrir link atual
          </a>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="file-upload" className='italic font-medium text-muted-foreground'>Arquivos PDF</Label>
          {files.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllSelected}>
              <Trash2 className="mr-2 h-4 w-4" /> Limpar seleção
            </Button>
          )}
        </div>
        
        {initialFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Arquivos salvos:</p>
            {initialFiles.map((f, index) => (
              <div key={`existing-${index}`} className="flex h-12 items-center justify-between rounded-md border bg-muted/30 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    {f.url ? (
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-blue-700 hover:underline" title={f.fileName}>
                        {f.fileName}
                      </a>
                    ) : (
                      <span className="truncate text-sm font-medium" title={f.fileName}>{f.fileName}</span>
                    )}
                    <div className="text-[10px] text-muted-foreground">{f.sizeBytes ? (f.sizeBytes / 1024 / 1024).toFixed(2) + ' MB' : ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Arquivos a enviar:</p>
            {files.map((file, index) => (
              <div key={index} className="flex h-12 items-center justify-between rounded-md border bg-muted/50 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div className="min-w-0">
                    <span className="truncate text-sm font-medium" title={file.name}>{file.name}</span>
                    <div className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} aria-label="Remover arquivo">
                  <X className="h-4 w-4" />
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
            'relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-transparent text-center transition-colors',
            { 'border-primary bg-muted/50': isDragging }
          )}
        >
          <input
            id={`${idBase}-file-upload`}
            type="file"
            className="hidden"
            accept="application/pdf,.pdf"
            onChange={handleFileChangeFromInput}
            multiple
          />
          <label
            htmlFor={`${idBase}-file-upload`}
            className='flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2 hover:border-primary/80 hover:bg-muted/50'
          >
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-xs text-muted-foreground">PDFs (máx 10MB cada)</p>
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground">{files.length} arquivo(s) selecionado(s).</p>
        )}
      </div>
    </div>
  );
};

