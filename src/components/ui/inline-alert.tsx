import { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type?: "info" | "error" | "warning";
}

const InlineAlert = forwardRef<HTMLDivElement, Props>(
  ({ type = "info", className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "px-1 text-sm font-normal  rounded-md",
          type == "info"
            ? "bg-primary/40 border-primary text-foreground"
            : type == "error"
            ? " text-red-600"
            : " text-yellow-600",
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

InlineAlert.displayName = "InlineAlert";

export default InlineAlert;
