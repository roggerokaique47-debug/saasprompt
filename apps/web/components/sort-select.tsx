'use client';

import { useCallback } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SortSelectProps {
  defaultValue: string;
  options: Option[];
}

export function SortSelect({ defaultValue, options }: SortSelectProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', e.target.value);
    window.location.href = url.toString();
  }, []);

  return (
    <select
      className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none"
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
