import { cn } from "@/lib/utils";

// The page layout components

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

// Page
export function PageLayout({ children, className, ...props }: Props) {
  return (
    <section className={cn("w-full flex flex-col gap-6", className)} {...props}>
      {children}
    </section>
  );
}

// Page Table
export function PageLayoutTable({ children, className, ...props }: Props) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

// Header
export function PageLayoutHeader({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row gap-4 items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Header Name and Breadcrumbs
export function PageLayoutHeaderNameAndBreadcrumbs({
  children,
  className,
  ...props
}: Props) {
  return (
    <div className={cn("w-full flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
}

// Header Name and Breadcrumbs
export function PageLayoutHeaderNameAndBreadcrumbsTitle({
  children,
  className,
  ...props
}: Props) {
  return (
    <h2 className={cn("text-2xl font-semibold", className)} {...props}>
      {children}
    </h2>
  );
}

// Header Actions
export function PageLayoutHeaderActions({
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn("w-full md:w-auto flex gap-3 items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Filtering Header
export function PageLayoutFilteringHeader({
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
