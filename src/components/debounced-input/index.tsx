"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useDebouncedValue } from "@mantine/hooks";
import { SearchInput } from "../ui/search-input";

// Debounced inputs with useDebouncedValue hook

export interface DebouncedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onDebouncedValueChange?: <T>(e: T) => void;
}

export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  (
    { onDebouncedValueChange, defaultValue, value: ControlledValue, ...props },
    ref
  ) => {
    const [value, setValue] = useState<string>((defaultValue as string) || "");
    const [debounced] = useDebouncedValue<typeof value>(value, 200);

    useEffect(() => {
      if (onDebouncedValueChange)
        onDebouncedValueChange<typeof debounced>(debounced);
    }, [debounced, onDebouncedValueChange]);

    // change the original whenever the controller value get changed
    useEffect(() => {
      setValue(ControlledValue as string);
    }, [ControlledValue]);

    return (
      <Input
        {...props}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        ref={ref}
      />
    );
  }
);

DebouncedInput.displayName = "DebouncedInput";

export const DebouncedSearchInput = forwardRef<
  HTMLInputElement,
  DebouncedInputProps
>(({ onDebouncedValueChange, defaultValue = "", ...props }, ref) => {
  const [value, setValue] = useState<string>(defaultValue as string);
  const [debounced] = useDebouncedValue<typeof value>(value, 500);
  const isInitialMount = useRef(true);
  const prevDefaultValue = useRef(defaultValue);

  // Only update value from defaultValue when defaultValue actually changes
  useEffect(() => {
    if (defaultValue !== prevDefaultValue.current) {
      setValue(defaultValue as string);
      prevDefaultValue.current = defaultValue;
    }
  }, [defaultValue]);

  // Only trigger debounced callback for real input changes, not on mount
  useEffect(() => {
    // Skip the first effect execution (on mount)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (onDebouncedValueChange) {
      onDebouncedValueChange<typeof debounced>(debounced);
    }
  }, [debounced, onDebouncedValueChange]);

  return (
    <SearchInput
      {...props}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      ref={ref}
    />
  );
});

DebouncedSearchInput.displayName = "DebouncedSearchInput";
