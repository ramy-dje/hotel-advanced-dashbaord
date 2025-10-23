"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const RadioGroup = RadioGroupPrimitive.Root
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex items-center justify-center rounded-full border border-gray-400 my-1",
      "h-6 w-6 transition-all duration-200 ease-in-out",
      "hover:ring-2 ring-gray-300 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-white focus:ring-offset-2",
      "data-[state=checked]:border-8 data-[state=checked]:border-primary data-[state=checked]:bg-transparent",
      className
    )}
    {...props}
  >
    {/* donut center - transparent hole */}
    <span className="absolute h-2.5 w-2.5 rounded-full bg-white"></span>
  </RadioGroupPrimitive.Item>
));


export { RadioGroup, RadioGroupItem }