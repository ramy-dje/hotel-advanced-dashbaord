import { cn } from "@/lib/utils";
import { useViewportSize } from "@mantine/hooks";
import { forwardRef, useEffect } from "react";

// The Creation tabs component

interface CreationTabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function CreationTabsContent({
  className,
  ...props
}: CreationTabsContentProps) {
  return (
    <div
      className="w-full sticky top-[70px] md:top-[80px] z-[99] bg-background flex items-center gap-5 md:gap-7 lg:gap-10 overflow-x-auto sm-scrollbar border-b"
      {...props}
    />
  );
}

interface CreationTabsTabProps extends React.HTMLAttributes<HTMLAnchorElement> {
  hash?: string;
  selected?: boolean;
}

// CreationTabsTab

export const CreationTabsTab = forwardRef<HTMLElement, CreationTabsTabProps>(
  ({ hash, selected, className, children, ...props }, ref: any) => {
    // resize
    const viewSize = useViewportSize();

    // section logic

    useEffect(() => {
      if (ref?.current as HTMLElement) {
        let io: any = null;

        //
        if (viewSize.width >= 1536) {
          io = new IntersectionObserver(
            ({ 0: entry }) => {
              if (entry.isIntersecting && hash) {
                // set the hash
                location.hash = hash;
              }
            },
            { threshold: 0.4, rootMargin: "-200px" }
          );
        } else if (viewSize.width >= 1280) {
          io = new IntersectionObserver(
            ({ 0: entry }) => {
              if (entry.isIntersecting && hash) {
                // set the hash
                location.hash = hash;
              }
            },
            { threshold: 0.2, rootMargin: "-220px" }
          );
        } else if (viewSize.width > 768) {
          io = new IntersectionObserver(
            ({ 0: entry }) => {
              if (entry.isIntersecting && hash) {
                // set the hash
                location.hash = hash;
              }
            },
            { threshold: 0.2, rootMargin: "-220px" }
          );
        } else if (viewSize.width <= 768) {
          io = new IntersectionObserver(
            ({ 0: entry }) => {
              if (entry.isIntersecting && hash) {
                // set the hash
                location.hash = hash;
              }
            },
            { threshold: 0, rootMargin: "-220px" }
          );
          console.log("SIZE: 680");
        }

        // to create new instance every time
        if (io instanceof IntersectionObserver) {
          io.unobserve(ref?.current as HTMLElement);
          io.observe(ref?.current as HTMLElement);
        } else if (io) {
          // use the io
          io.observe(ref?.current as HTMLElement);
        }
      }
    }, [viewSize]);

    return (
      <a
        href={hash}
        onClick={(e) => {
          if (ref?.current) {
            (ref?.current as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            e.preventDefault();
          }
        }}
        role="tab"
        className={cn(
          "text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap py-4 hover:text-foreground text-foreground/60",
          selected &&
            "relative cursor-auto text-foreground before:bg-foreground before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:w-full"
        )}
        children={children}
        {...props}
      />
    );
  }
);
