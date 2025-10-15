"use client";

import { useState } from "react";
import { AppIconComponent } from "../app-icon/icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// The app icon select dialog

interface Props {
  children: React.ReactNode;
  onClick: (url: string) => void;
}

export default function AppIconSelect({ children, onClick }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[22em] p-2  overflow-y-auto">
        <div className="w-full h-full gap-2 grid grid-cols-6">
          {/* air-conditioner.svg */}
          <Button
            onClick={() => {
              onClick("air-conditioner.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="air-conditioner.svg" className="size-7" />
          </Button>
          {/* bath.svg */}
          <Button
            onClick={() => {
              onClick("bath.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="bath.svg" className="size-7" />
          </Button>
          {/* bed.svg */}
          <Button
            onClick={() => {
              onClick("bed.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="bed.svg" className="size-7" />
          </Button>
          {/* breakfast.svg */}
          <Button
            onClick={() => {
              onClick("breakfast.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="breakfast.svg" className="size-7" />
          </Button>
          {/* crib.svg */}
          <Button
            onClick={() => {
              onClick("crib.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="crib.svg" className="size-7" />
          </Button>
          {/* hair-dryer.svg */}
          <Button
            onClick={() => {
              onClick("hair-dryer.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="hair-dryer.svg" className="size-7" />
          </Button>
          {/* kettle.svg */}
          <Button
            onClick={() => {
              onClick("kettle.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="kettle.svg" className="size-7" />
          </Button>
          {/* laundry-machine.svg */}
          <Button
            onClick={() => {
              onClick("laundry-machine.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="laundry-machine.svg" className="size-7" />
          </Button>
          {/* refrigerator.svg */}
          <Button
            onClick={() => {
              onClick("refrigerator.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="refrigerator.svg" className="size-7" />
          </Button>
          {/* serving-dish.svg */}
          <Button
            onClick={() => {
              onClick("serving-dish.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="serving-dish.svg" className="size-7" />
          </Button>
          {/* shampoo.svg */}
          <Button
            onClick={() => {
              onClick("shampoo.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="shampoo.svg" className="size-7" />
          </Button>
          {/* strongbox.svg */}
          <Button
            onClick={() => {
              onClick("strongbox.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="strongbox.svg" className="size-7" />
          </Button>
          {/* television.svg */}
          <Button
            onClick={() => {
              onClick("television.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="television.svg" className="size-7" />
          </Button>
          {/* towel-01.svg */}
          <Button
            onClick={() => {
              onClick("towel-01.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="towel-01.svg" className="size-7" />
          </Button>
          {/* user.svg */}
          <Button
            onClick={() => {
              onClick("user.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="user.svg" className="size-7" />
          </Button>
          {/* weights.svg */}
          <Button
            onClick={() => {
              onClick("weights.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="weights.svg" className="size-7" />
          </Button>
          {/* wifi-signal.svg */}
          <Button
            onClick={() => {
              onClick("wifi-signal.svg");
              setOpen(false);
            }}
            variant="outline"
            size="icon"
            className="size-12"
          >
            <AppIconComponent name="wifi-signal.svg" className="size-7" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
