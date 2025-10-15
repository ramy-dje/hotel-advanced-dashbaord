import { useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxFilteredList,
  ComboboxInput,
  ComboboxItem,
} from "../ui/combobox";

interface Props {
  control: Control<any>;
  control_name: string;
  id: string;
  list: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  name: string;
}

// The form quick combobox component is a combobox that uses the react-hook-from library to add a searchable combobox with selecting value and retuning the input text if list doesn't have the match item and it's good for quick add with suggesting
export default function FormQuickComboboxComponent({
  control,
  list,
  control_name,
  name,
  id,
  placeholder,
}: Props) {
  // search state
  const [search, setSearch] = useState("");

  // value controller
  const value_controller = useController({
    name: control_name,
    control,
  });

  return (
    <Combobox
      value={value_controller.field.value as string}
      setValue={(e) => value_controller.field.onChange(e)}
    >
      <ComboboxInput
        id={id}
        disabled={value_controller.field.disabled}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
      />
      <ComboboxContent>
        <ComboboxFilteredList
          search={search}
          no_results={
            <span className="w-full p-1.5 pr-2 text-primary/80 text-sm font-normal">
              <span className="text-foreground/80 font-semibold">{search}</span>{" "}
              (New {name})
            </span>
          }
          list={list}
        >
          {(value, label) => (
            <ComboboxItem key={value} value={value}>
              {label}
            </ComboboxItem>
          )}
        </ComboboxFilteredList>
      </ComboboxContent>
    </Combobox>
  );
}

interface PropsC {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  id: string;
  list: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  name: string;
}

// The form quick combobox component is a combobox that uses the controlled state to add a searchable combobox with selecting value and retuning the input text if list doesn't have the match item and it's good for quick add with suggesting
export function FormQuickControlledComboboxComponent({
  setValue,
  value,
  list,
  name,
  id,
  placeholder,
}: PropsC) {
  // search state
  const [search, setSearch] = useState("");

  return (
    <Combobox value={value as string} setValue={(e) => setValue(e)}>
      <ComboboxInput
        id={id}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
      />
      <ComboboxContent>
        <ComboboxFilteredList
          search={search}
          no_results={
            <span className="w-full p-1.5 pr-2 text-primary/80 text-sm font-normal">
              <span className="text-foreground/80 font-semibold">{search}</span>{" "}
              (New {name})
            </span>
          }
          list={list}
        >
          {(value, label) => (
            <ComboboxItem key={value} value={value}>
              {label}
            </ComboboxItem>
          )}
        </ComboboxFilteredList>
      </ComboboxContent>
    </Combobox>
  );
}
