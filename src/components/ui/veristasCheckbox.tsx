'use client';

import { HiCheck } from 'react-icons/hi';

export default function VeritasCheckbox({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="hidden"
        id={id}
      />

      {/* Custom checkbox */}
      <div
        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-200 ${
          checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'
        }`}
      >
        {checked && <HiCheck className="text-white w-4 h-4" />}
      </div>
    </label>
  );
}
