import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// Creation form components footer actions

export const CreationFormFooterActions: React.FC<
  React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-end gap-4 border-t bg-background px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 -mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10",
        className
      )}
      {...props}
    />
  );
};

CreationFormFooterActions.displayName = "CreationFormFooterActions";

// Creation form components content

export const CreationFormContent: React.FC<
  React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "mb-10 grid gap-7 divide-y divide-dashed divide-border xl:gap-9",
        className
      )}
      {...props}
    />
  );
};

CreationFormContent.displayName = "CreationFormContent";

// Creation form components section

export const CreationFormSection = forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "w-full grid gap-5 grid-cols-8 xl:grid-cols-12 pt-7 xl:pt-11",
        className
      )}
      {...props}
      ref={ref}
    />
  );
});
CreationFormSection.displayName = "CreationFormSection";

// Creation form components section Info

export const CreationFormSectionInfo: React.FC<
  React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
  return (
    <div className={cn("col-span-full xl:col-span-4", className)} {...props} />
  );
};

CreationFormSectionInfo.displayName = "CreationFormSectionInfo";

// Creation form components section Info Title

export const CreationFormSectionInfoTitle: React.FC<
  React.HtmlHTMLAttributes<HTMLHeadingElement>
> = ({ className, ...props }) => {
  return <h4 className={cn("text-base font-semibold", className)} {...props} />;
};

CreationFormSectionInfoTitle.displayName = "CreationFormSectionInfoTitle";

// Creation form components section Info Description

export const CreationFormSectionInfoDescription: React.FC<
  React.HtmlHTMLAttributes<HTMLHeadingElement>
> = ({ className, ...props }) => {
  return (
    <h4
      className={cn("mt-2 text-accent-foreground/90 text-sm", className)}
      {...props}
    />
  );
};

CreationFormSectionInfoDescription.displayName =
  "CreationFormSectionInfoDescription";

// Creation form components section content

export const CreationFormSectionContent: React.FC<
  React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "col-span-full grid gap-4 md:grid-cols-2 xl:col-span-8 xl:gap-5",
        className
      )}
      {...props}
    />
  );
};

CreationFormSectionContent.displayName = "CreationFormSectionContent";
