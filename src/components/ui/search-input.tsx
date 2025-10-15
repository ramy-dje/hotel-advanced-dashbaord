import * as React from "react";
import { cn } from "@/lib/utils";
import { HiOutlineSearch } from "react-icons/hi";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "search", ...props }, ref) => {
    return (
      <div className="w-auto h-auto relative">
        <HiOutlineSearch className="size-5 absolute left-3 top-2.5 text-foreground/70" />
        <input
          type={type}
          spellCheck={false}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 pl-11 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[0.6px] focus-visible:ring-ring focus-visible:border-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
