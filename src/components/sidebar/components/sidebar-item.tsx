"use clint";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";

// The sidebar Item

interface Props {
  selected?: boolean;
  url: string;
  children: string;
  Icon: IconType;
}

export default function SidebarItem({ url, selected, children, Icon }: Props) {
  return (
    <li>
      <Button
        asChild
        variant={selected ? "empty" : "ghost"}
        size="sm"
        className={cn(
          selected
            ? "w-full relative text-primary/90 font-medium gap-2 justify-start before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary"
            : "w-full text-foreground/70 hover:text-foreground/70 gap-2 justify-start truncate"
        )}
      >
        <Link href={url}>
          <Icon
            data-selected={selected}
            className="size-5 text-foreground/80 data-[selected=true]:text-primary"
          />{" "}
          {children}
        </Link>
      </Button>
    </li>
  );
}

SidebarItem.Empty = function () {
  return <li className="h-9 px-3" />;
};
