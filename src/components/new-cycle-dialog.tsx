import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Input } from './ui/input';
import { MAX_YEAR, MIN_YEAR } from '@/constants/year';

type NewCycleProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (year: number, copyFromPrevious: boolean) => Promise<void>;
  minYear?: number;
  maxYear?: number;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
};

const NewCycle: React.FC<NewCycleProps> = ({
  open,
  onOpenChange,
  onCreate,
  trigger,
  title = 'Criar Novo Ciclo',
  description = 'Informe o ano para o novo ciclo de avaliação.'
}) => {
  const [newYear, setNewYear] = useState('');
  const [copyFromPrevious, setCopyFromPrevious] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const yearNum = useMemo(() => parseInt(newYear, 10), [newYear]);
  const yearValid = useMemo(
    () => Number.isInteger(yearNum) && yearNum >= MIN_YEAR && yearNum <= MAX_YEAR,
    [yearNum]
  );

  const handleCreate = async () => {
    if (!yearValid || isCreating) return;
    setIsCreating(true);
    try {
      await onCreate(yearNum, copyFromPrevious);
      // Close only on success
      onOpenChange(false);
      setNewYear('');
      setCopyFromPrevious(true);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (isCreating) return;
        onOpenChange(o);
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-green-600 hover:cursor-pointer hover:bg-green-700">
            Criar ciclo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="text-sm font-medium" htmlFor="cycle-year">
            Ano do ciclo
          </label>
          <Input
            id="cycle-year"
            inputMode="numeric"
            pattern="\\d+"
            placeholder={`Ex.: ${new Date().getFullYear()}`}
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
          />
          <div className="text-muted-foreground text-xs">
            Mínimo {MIN_YEAR}, máximo {MAX_YEAR}.
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              id="copyPrev"
              type="checkbox"
              className="size-4 hover:cursor-pointer"
              checked={copyFromPrevious}
              onChange={(e) => setCopyFromPrevious(e.target.checked)}
            />
            <label htmlFor="copyPrev" className="text-sm">
              Copiar dados do ciclo anterior (se existir)
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!yearValid || isCreating}
            className="bg-green-600 hover:cursor-pointer hover:bg-green-700 disabled:opacity-60"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? 'Criando ciclo...' : 'Criar ciclo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCycle;
