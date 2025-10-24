"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { XIcon } from 'lucide-react';

type Props = {
  initialUrl: string;
  slug: string;
  onSave: (formData: FormData) => void | Promise<void>;
};

function SubmitButton({ disabledExtra }: { disabledExtra?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className='bg-green-600 hover:bg-green-700 hover:cursor-pointer' disabled={pending || !!disabledExtra}>
      {pending ? 'Salvando…' : 'Salvar'}
    </Button>
  );
}

export default function OtherDocumentsForm({ initialUrl, slug, onSave }: Props) {
  const [value, setValue] = useState(initialUrl);
  const unchanged = value.trim() === (initialUrl ?? '').trim();

  return (
    <form action={onSave} className="space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <div className="space-y-1">
        <label htmlFor="otherDocumentsUrl" className="text-sm font-medium">Link da pasta do Google Drive</label>
        <div className="relative">
          <Input
            id="otherDocumentsUrl"
            name="otherDocumentsUrl"
            placeholder="https://drive.google.com/drive/folders/…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-10"
          />
          {value && (
            <Button
              type="button"
              variant='ghost'
              onClick={() => setValue('')}
              className="absolute right-1 top-1 h-7 w-7 p-0 text-lg hover:cursor-pointer"
              aria-label="Limpar link"
              title="Limpar link"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {initialUrl && (
          <a
            href={initialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 hover:underline"
          >
            Abrir pasta atual
          </a>
        )}
      </div>
      <div>
        <SubmitButton disabledExtra={unchanged} />
      </div>
    </form>
  );
}
