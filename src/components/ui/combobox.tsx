"use client";

import * as ComboboxPrimitive from "@ariakit/react/combobox";
import * as RadixPopoverPrimitive from "@radix-ui/react-popover";
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { HiCheck as Check } from "react-icons/hi";

// types
interface _Combobox_Context_Type {
  comboboxRef: React.Ref<any>;
  listboxRef: React.Ref<any>;
}

// *NOTE - This Component Is A Custom Made and it's not from 'shadcn-ui' it's a combination of '@ariakit combobox' and '@radix popover'
// *NOTE - This Component Has Popover Position & Align Issues Because they aren't Implemented in '@ariakit combobox' ComboboxPopover

// the combobox context
const Combobox_context = createContext<_Combobox_Context_Type>(
  {} as _Combobox_Context_Type
);

const Combobox = forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.ComboboxProvider>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.ComboboxProvider>
>((props) => {
  const [open, setOpen] = useState(false);
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  //
  return (
    <RadixPopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <Combobox_context.Provider value={{ comboboxRef, listboxRef }}>
        <ComboboxPrimitive.ComboboxProvider
          open={open}
          setOpen={setOpen}
          {...props}
        />
      </Combobox_context.Provider>
    </RadixPopoverPrimitive.Root>
  );
});

// the combobox input component
const ComboboxInput = forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Combobox>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Combobox>
>(({ className, ...props }, ref) => {
  const { comboboxRef } = useContext(Combobox_context);
  return (
    <RadixPopoverPrimitive.Anchor ref={ref} asChild>
      <ComboboxPrimitive.Combobox
        className={cn(
          "h-10 min-w-[12rem] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/40 focus:outline-1 focus:outline-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={comboboxRef}
        {...props}
      />
    </RadixPopoverPrimitive.Anchor>
  );
});

// The combobox content component
const ComboboxContent = forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.ComboboxPopover>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.ComboboxPopover> & {
    align?: "center" | "start" | "end";
    side?: "left" | "top" | "right" | "bottom";
  }
>(({ className, align = "start", side = "bottom", ...props }, ref) => {
  const { comboboxRef, listboxRef } = useContext(Combobox_context);
  return (
    <RadixPopoverPrimitive.Content
      asChild
      sideOffset={8}
      side={side}
      align={align}
      ref={ref}
      onInteractOutside={(event) => {
        const target = event.target as Element | null;
        const isCombobox = target === (comboboxRef as any).current;
        const inListbox =
          target && (listboxRef as any).current?.contains(target);
        if (isCombobox || inListbox) {
          event.preventDefault();
        }
      }}
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <ComboboxPrimitive.ComboboxPopover
        role="listbox"
        className={cn(
          "relative z-[99999] max-h-60 p-1 min-w-[12rem] overflow-y-auto sm-scrollbar rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        gutter={0.5}
        sameWidth
        ref={listboxRef}
        {...props}
      />
    </RadixPopoverPrimitive.Content>
  );
});

// filtered list props types
interface FilteredListProps {
  list: {
    value: string;
    label: string;
  }[];
  search: string;
  no_results?: React.ReactElement;
  children: (value: string, label: string) => React.ReactNode;
}

// filtered list component
const ComboboxFilteredList = ({
  children,
  search,
  list,
  no_results: NoResultsElement,
}: FilteredListProps) => {
  // check if the children is a function component
  if (typeof children !== "function")
    throw Error("Combobox Filtered List Children Should A Function");

  // list
  const m_list = useMemo(() => list, []);

  // result
  const result_list = useMemo(() => {
    if (search.trim().length >= 1) {
      return {
        searched: true,
        list: m_list.filter((item) =>
          item.label
            .toLocaleLowerCase()
            .includes(search.trim().toLocaleLowerCase())
        ),
      };
    } else {
      return { searched: false, list: [] };
    }
  }, [search]);

  return (
    <>
      {result_list.searched ? (
        // with result
        result_list.list.length != 0 ? (
          result_list.list.map((item) => children(item.value, item.label))
        ) : // without result
        NoResultsElement ? (
          NoResultsElement
        ) : (
          <span className="w-full p-1.5 pr-2 text-foreground text-sm font-medium">
            No Result
          </span>
        )
      ) : (
        // without search
        m_list.map((item) => children(item.value, item.label))
      )}
    </>
  );
};

// the combobox item component
const ComboboxItem = forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.ComboboxItem>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.ComboboxItem>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.ComboboxItem
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm p-1.5 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[active-item]:text-accent-foreground data-[active-item]:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
    <ComboboxPrimitive.ComboboxItemCheck className="absolute right-1 flex !size-4 items-center justify-center">
      <Check className="w-4 h-4" />
    </ComboboxPrimitive.ComboboxItemCheck>
  </ComboboxPrimitive.ComboboxItem>
));

// export the components
export {
  ComboboxItem,
  ComboboxFilteredList,
  ComboboxContent,
  ComboboxInput,
  Combobox,
};
