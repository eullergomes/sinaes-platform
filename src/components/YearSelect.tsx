'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type Props = {
  years: number[];
  selectedYear: number;
};

export default function YearSelect({ years, selectedYear }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (year) {
      params.set('year', year);
    } else {
      params.delete('year');
    }
    const url = `${pathname}?${params.toString()}`;
    startTransition(() => router.replace(url));
  }

  if (!years.length) return null;

  return (
    <div className="no-print flex items-center gap-2">
      <label htmlFor="report-year" className="text-sm font-medium">
        Ano:
      </label>
      {/* Select de Ano */}
      <select
        id="report-year"
        className="bg-background focus:ring-ring h-9 rounded-md border px-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
        value={selectedYear}
        onChange={onChange}
        disabled={pending || years.length <= 1}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
