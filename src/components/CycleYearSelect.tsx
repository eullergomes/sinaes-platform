'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type CycleYearSelectProps = {
  years: number[];
  value: number | null;
  onChange?: (year: number) => void;
  label?: string;
  placeholder?: string;
  hideInPrint?: boolean;
  updateQueryParam?: boolean;
  disabled?: boolean;
  widthClassName?: string;
};

export default function CycleYearSelect({
  years,
  value,
  onChange,
  label,
  placeholder = 'Ano',
  hideInPrint = false,
  updateQueryParam = true,
  disabled = false,
  widthClassName = 'w-28'
}: CycleYearSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  if (!years || years.length === 0) return null;

  function handleValueChange(v: string) {
    const year = Number(v);
    if (Number.isNaN(year)) return;
    if (onChange) onChange(year);
    if (updateQueryParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('year', String(year));
      const url = `${pathname}?${params.toString()}`;
      startTransition(() => router.replace(url));
    }
  }

  return (
    <div className={`${hideInPrint ? 'no-print' : ''} flex items-center gap-2`}>
      {label && (
        <label htmlFor="cycle-year-select" className="text-sm font-medium">
          {label}:
        </label>
      )}
      <Select
        value={value !== null ? String(value) : undefined}
        onValueChange={handleValueChange}
        disabled={disabled || pending || years.length <= 1}
      >
        <SelectTrigger id="cycle-year-select" className={widthClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
