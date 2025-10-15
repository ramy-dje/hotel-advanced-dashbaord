import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// The sidebar sub Item

interface Props {
  selected?: boolean;
  url: string;
  children?: string;
}

export default function SidebarSubItem({ url, selected, children }: Props) {
  return (
    <li>
      <Button
        asChild
        variant={selected ? "empty" : "ghost"}
        size="sm"
        className={cn(
          selected
            ? "w-full relative text-primary/90 gap-2 justify-start"
            : "w-full text-foreground/70 hover:text-foreground/70 gap-2 justify-start truncate"
        )}
      >
        <Link href={url}>
          <div className="size-4 flex justify-center items-center">
            <span
              data-selected={selected}
              className="size-[4px] data-[selected=true]:size-[6px] block rounded-full bg-foreground/20 data-[selected=true]:bg-primary"
            />
          </div>
          {children}
        </Link>
      </Button>
    </li>
  );
}
