'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export default function FilterSelect({ name, label, options }: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentValue = searchParams.get(name) || '';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <select
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
      >
        <option value="">Tous</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
