import { useController, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, ReactNode } from "react";

interface ToggleInputProps {
  name: string;
  label: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const ToggleInput = ({
  name,
  label,
  disabled,
  children,
}: ToggleInputProps) => {
  const { control } = useFormContext();
  const [hasFeature, setHasFeature] = useState<boolean | null>(false);
  const { field, fieldState } = useController({
    control,
    name,
    defaultValue: null,
  });

  return (
    <div className="grid grid-cols-12 gap-4  col-span-2 mb-4">
      {/* <div className="col-span-4 flex items-center"> */}
      <div className="col-span-4 flex">
      <Label className="whitespace-nowrap text-sm font-medium pt-2">
          {label}
        </Label>
      </div>

      <div className="col-span-4 flex">
        <Button
          type="button"
          variant={hasFeature === true ? "yes_no" : "outline"}
          className="h-10 rounded-r-none m-0"
          onClick={() => {
            setHasFeature(true);
            field.onChange(true); // you can change this to null if needed
          }}
          disabled={disabled}
        >
          Yes
        </Button>

        <Button
          type="button"
          variant={hasFeature === false ? "yes_no" : "outline"}
          className="h-10 rounded-l-none m-0"
          onClick={() => {
            setHasFeature(false);
            field.onChange(false);
          }}
          disabled={disabled}
        >
          No
        </Button>
      </div>
      {/* </div> */}
      <div className="col-span-4">
        {hasFeature === true && (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>

      {fieldState.error && (
        <div className="col-span-12">
          <p className="text-red-500 text-sm mt-1">
            {fieldState.error.message}
          </p>
        </div>
      )}
    </div>
  );
};
