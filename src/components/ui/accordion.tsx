"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { HiOutlineChevronDown as ChevronDown } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-2 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionSidebarTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  { selected?: boolean; Icon: IconType } & React.ComponentPropsWithoutRef<
    typeof AccordionPrimitive.Trigger
  >
>(({ className, selected, Icon, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-selected={selected}
      className={cn(
        "group w-full flex items-center justify-between px-3 mb-1 h-9 rounded-md text-sm font-medium whitespace-nowrap transition-all",
        "text-foreground/70 hover:bg-accent data-[selected]:hover:bg-transparent data-[!selected]:truncate [&[data-state=open]>svg]:rotate-180",
        "data-[selected=true]:relative data-[selected=true]:text-primary/90 data-[selected=true]:before:absolute data-[selected=true]:before:-start-3 data-[selected=true]:before:block data-[selected=true]:before:h-4/5 data-[selected=true]:before:w-1 data-[selected=true]:before:rounded-ee-md data-[selected=true]:before:rounded-se-md data-[selected=true]:before:bg-primary",
        className
      )}
      {...props}
    >
      {" "}
      <div className="flex gap-2 items-center justify-start">
        <Icon className="size-5 text-foreground/80 group-data-[selected=true]:text-primary" />{" "}
        {children}
      </div>
      <ChevronDown className="h-4 w-4 text-foreground/70 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionSidebarTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

const AccordionSidebarContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("my-2", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionSidebarContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionSidebarTrigger,
  AccordionSidebarContent,
};
