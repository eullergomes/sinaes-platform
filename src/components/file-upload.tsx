'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onLinkChange: (link: string) => void;
}

export const FileUpload = ({ onFilesChange, onLinkChange }: FileUploadProps) => {
  const [link, setLink] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  // Regex para validar URLs de forma simples
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

  /**
   * Valida o link inserido pelo usuário.
   */
  const validateLink = (url: string) => {
    if (url && !urlRegex.test(url)) {
      setError('Por favor, insira um link válido.');
      return false;
    }
    // Limpa o erro de link se for válido, mas mantém erros de arquivo
    setError((prevError) => (prevError.includes('link válido') ? '' : prevError));
    return true;
  };

  /**
   * Lida com a mudança de valor no campo de link.
   */
  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);
    onLinkChange(newLink);
    validateLink(newLink);
  };

  /**
   * Processa e valida os arquivos selecionados.
   */
  const handleFilesSelect = (selectedFiles: FileList | null) => {
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
  };

  // Funções para lidar com os eventos de arrastar e soltar (drag-and-drop)
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
  }, [files]); // Depende dos arquivos existentes para concatenar

  const handleFileChangeFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFilesSelect(e.target.files);
     // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente
     e.target.value = '';
  };

  /**
   * Remove um arquivo da lista.
   */
  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setError('');
  };

  return (
    <div className="w-full space-y-4">
      {/* Campo para o Link */}
      <div className="space-y-2">
        <Label htmlFor="drive-link">Link do Drive (Opcional)</Label>
        <Input
          id="drive-link"
          placeholder="Cole o link do Google Drive, OneDrive, etc."
          value={link}
          onChange={handleLinkChange}
        />
      </div>

      {/* Campo para Upload de Arquivos */}
      <div className="space-y-2">
        <Label htmlFor="file-upload">Arquivos PDF (Opcional)</Label>
        
        {/* Lista de arquivos enviados */}
        <div className="space-y-2">
            {files.map((file, index) => (
                <div key={index} className="flex h-14 items-center justify-between rounded-lg border bg-muted/50 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-8 w-8 flex-shrink-0 text-primary" />
                        <div className="flex min-w-0 flex-col">
                             <span className="truncate text-sm font-medium text-foreground" title={file.name}>{file.name}</span>
                             <span className="text-xs text-muted-foreground">{ (file.size / 1024 / 1024).toFixed(2) } MB</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            ))}
        </div>

        {/* Dropzone para novos arquivos */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-transparent text-center transition-colors hover:border-primary/80 hover:bg-muted/50',
            { 'border-primary bg-muted/50': isDragging }
          )}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChangeFromInput}
            multiple
          />
          <label
            htmlFor="file-upload"
            className='flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2'
          >
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-xs text-muted-foreground">PDFs (máx 10MB cada)</p>
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

