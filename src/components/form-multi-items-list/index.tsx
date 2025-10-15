import { generateSimpleId } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { HiOutlineX } from "react-icons/hi";

interface Props {
  control: Control<any>;
  control_name: string;
  id: string;
  icon?: React.ReactElement | React.ReactNode | any;
  defaultValuesMount?: boolean;
  defaultValues?: string[];
  placeholder: string;
  name: string;
}

// The form multi item list component for adding mny items by inputting and click on the button and it works using the controller of the react-hook-form
export default function FormMultiItemsList({
  control,
  control_name,
  id,
  name,
  placeholder,
  defaultValues,
  icon: Icon,
  defaultValuesMount = false,
}: Props) {
  // controller
  const list_controller = useController({ control, name: control_name });

  const [list, setList] = useState<{ id: string; key: string }[]>([]);

  // input ref
  const input_ref = useRef<HTMLInputElement>(null);

  // update controller value with the items
  useEffect(() => {
    if (list !== undefined) {
      list_controller.field.onChange(list.map((e) => e.key));
    }
  }, [list]);

  // add key
  const handleAddItem = () => {
    if (
      input_ref.current?.value &&
      input_ref.current?.value.trim() &&
      input_ref.current?.value.trim().length >= 2
    ) {
      const tit = input_ref.current.value.trim();
      setList((keys) => [
        ...keys,
        {
          id: generateSimpleId(),
          key: tit as string,
        },
      ]);
      input_ref.current.value = "";
    }
  };

  // remove key
  const handelRemoveItem = (id: string) => {
    setList((keys) => keys.filter((key) => key.id !== id));
  };

  // setting the default values
  useEffect(() => {
    if (defaultValues && Array.isArray(defaultValues)) {
      setList(
        defaultValues.map((val: string) => ({
          id: generateSimpleId(),
          key: val,
        }))
      );
    }
  }, [defaultValues]);

  // set data from the controller
  useEffect(() => {
    if (!defaultValuesMount) return;
    if (list_controller.field.value?.length !== 0) {
      setList(
        list_controller.field.value.map((e: string) => ({
          id: generateSimpleId(),
          key: e,
        }))
      );
    }
  }, []);

  return (
    <div className="flex flex-col gap-3 col-span-2">
      <div className="w-full flex items-center gap-5">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          disabled={list_controller.field.disabled}
          className="max-w-full xl:w-[24em]"
          ref={input_ref}
        />
        <Button
          disabled={list_controller.field.disabled}
          type="button"
          onClick={handleAddItem}
        >
          Add {name}
        </Button>
      </div>
      {/* items */}
      <div className="w-full flex items-center flex-wrap gap-3">
        {list.map((item) => (
          <Badge
            key={item.id}
            variant="outline"
            className="rounded-full gap-2 text-sm font-normal"
          >
            {Icon ? <i className="size-4 -ml-1">{Icon}</i> : null}
            {item.key}
            <button
              onClick={() => handelRemoveItem(item.id)}
              type="button"
              disabled={list_controller.field.disabled}
              className="text-foreground/60 hover:text-foreground/100 -mr-1"
            >
              <HiOutlineX className="size-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
