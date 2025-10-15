"use client";
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { HiOutlineCalendar } from "react-icons/hi";
import { useIsMobile } from "@/hooks/use-mobile";

// Props for form-controlled version
type FormControlledProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  className?: string;
  rangeIsRequired?: boolean;
  placeholder?: string;
};

// Props for controlled version
type ControlledProps = {
  value: DateRange;
  onChange: (value: DateRange | undefined) => void;
  className?: string;
  rangeIsRequired?: boolean;
  placeholder?: string;
};

// Split the component into two versions to handle both cases without conditional hooks
function FormControlledDatePicker<TFieldValues extends FieldValues>({
  control,
  name,
  className,
  rangeIsRequired = false,
  placeholder = "Pick a date",
}: FormControlledProps<TFieldValues>) {
  const { field } = useController({ name, control });
  const [date, setDate] = React.useState<DateRange | undefined>(field.value);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Handle date change
  const handleChange = (selectedRange: DateRange | undefined) => {
    field.onChange(selectedRange);
  };

  // Update local state when external value changes
  React.useEffect(() => {
    setDate(field.value);
  }, [field.value]);

  return (
    <DatePickerUI
      date={date}
      setDate={setDate}
      isCalendarOpen={isCalendarOpen}
      setIsCalendarOpen={setIsCalendarOpen}
      handleChange={handleChange}
      rangeIsRequired={rangeIsRequired}
      placeholder={placeholder}
      className={className}
    />
  );
}

function ControlledDatePicker({
  value,
  onChange,
  className,
  rangeIsRequired = false,
  placeholder = "Pick a date",
}: ControlledProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Handle date change
  const handleChange = (selectedRange: DateRange | undefined) => {
    onChange(selectedRange);
  };

  // Update local state when external value changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <DatePickerUI
      date={date}
      setDate={setDate}
      isCalendarOpen={isCalendarOpen}
      setIsCalendarOpen={setIsCalendarOpen}
      handleChange={handleChange}
      rangeIsRequired={rangeIsRequired}
      placeholder={placeholder}
      className={className}
    />
  );
}

// UI component shared by both versions
function DatePickerUI({
  date,
  setDate,
  isCalendarOpen,
  setIsCalendarOpen,
  handleChange,
  rangeIsRequired,
  placeholder,
  className,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  handleChange: (date: DateRange | undefined) => void;
  rangeIsRequired: boolean;
  placeholder: string;
  className?: string;
}) {
  const isMobile = useIsMobile();
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isCalendarOpen}
        onOpenChange={(open) => {
          setIsCalendarOpen(open);
          if (!rangeIsRequired) {
            handleChange(date);
            return;
          }
          if (date?.from && date?.to) {
            handleChange(date);
            return;
          }
          // If closing and we have a from date but no to date, clear the selection
          setDate(undefined);
          handleChange(undefined);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"filter"}
            className={cn(
              "w-full justify-start gap-2 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <HiOutlineCalendar className="size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto z-[99999] p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Union type for the component props
type DatePickerWithRangeProps<TFieldValues extends FieldValues> =
  | FormControlledProps<TFieldValues>
  | ControlledProps;

// Type guard functions
function isFormControlled<TFieldValues extends FieldValues>(
  props: DatePickerWithRangeProps<TFieldValues>
): props is FormControlledProps<TFieldValues> {
  return (
    "control" in props && !!props.control && "name" in props && !!props.name
  );
}

function isControlled<TFieldValues extends FieldValues>(
  props: DatePickerWithRangeProps<TFieldValues>
): props is ControlledProps {
  return "value" in props && "onChange" in props;
}

// Main component that decides which implementation to use
export function DatePickerWithRange<TFieldValues extends FieldValues>(
  props: DatePickerWithRangeProps<TFieldValues>
) {
  // Use type guards to determine which version to render
  if (isFormControlled(props)) {
    return <FormControlledDatePicker {...props} />;
  } else if (isControlled(props)) {
    return <ControlledDatePicker {...props} />;
  }

  throw new Error(
    "DatePickerWithRange requires either (control + name) or (value + onChange) props"
  );
}
