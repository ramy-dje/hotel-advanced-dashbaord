import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { createPortal } from "react-dom";

// The PDF element container (The Component Renders the element that will be converted to pdf ot the body with the correct size)

const PDFContainer = forwardRef<
  HTMLDivElement,
  { horizontal?: boolean } & React.HtmlHTMLAttributes<HTMLDivElement>
>(({ className, horizontal = false, ...props }, ref) => {
  // render the div inside the body using the createPortal
  return createPortal(
    <div
      className={cn(
        "print:fixed print:m-0 print:p-0 overflow-visible",
        horizontal
          ? "min-w-[297mm] w-[297mm] max-w-[297mm]"
          : "min-w-[calc(210mm+10mm)] w-[calc(210mm+10mm)] max-w-[calc(210mm+10mm)]",
        className
      )}
      {...props}
      ref={ref}
    />,
    document.body
  );
});

export default PDFContainer;

// PDFContainer Page Component (This component has the correct sizes and styles to generate a pdf page)

const PDFContainerPage = forwardRef<
  HTMLDivElement,
  {
    lastPage: boolean;
    horizontal?: boolean;
  } & React.HtmlHTMLAttributes<HTMLDivElement>
>(({ className, horizontal = false, lastPage = false, ...props }, ref) => {
  // render the div inside the body using the createPortal
  return (
    <div
      className={cn(
        "page w-full min-w-full max-w-full break-inside-avoid print:m-0 print:p-0",
        !lastPage && "break-after-avoid",
        horizontal
          ? "h-[calc(210mm+2mm)] min-h-[calc(210mm+2mm)]"
          : "min-h-[calc(297mm+14mm)] h-[calc(297mm+14mm)] max-h-[calc(297mm+14mm)]",
        className
      )}
      {...props}
      ref={ref}
    />
  );
});

export { PDFContainerPage };
