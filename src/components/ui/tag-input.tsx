'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function TagInput({ className, tags, onTagsChange, placeholder }: { className?: string, tags: string[], onTagsChange: (tags: string[]) => void, placeholder?: string }) {
  const [inputValue, setInputValue] = useState('');

  const addTags = (rawInput: string) => {
    const newTags = rawInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '' && !tags.includes(tag));

    if (newTags.length > 0) {
        onTagsChange([...tags, ...newTags]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTags(inputValue);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
   <div className={cn("w-full", className)}>
  {/* Input Field */}
  <input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Type and press Enter or comma..."
    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Tag List */}
  <div className={cn(
    "mt-4",
    tags.length === 0 ? "flex justify-center items-center h-20" : "flex flex-wrap gap-2"
  )}>
    {tags.length === 0 ? (
      <div className="text-gray-500 italic">No Categories added yet</div>
    ) : (
      tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(tag)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            ×
          </button>
        </div>
      ))
    )}
  </div>
</div>

  );
}
