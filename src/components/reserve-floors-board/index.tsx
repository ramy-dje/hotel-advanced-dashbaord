import { cn, copyTextToClipboard } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa6";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { HiOutlineHashtag } from "react-icons/hi";
import { MdDoorSliding } from "react-icons/md";

// Reserve floor board

interface ReserveFloorBoardProps {
  className?: string;
  children?: React.ReactNode;
}
// Board
export function ReserveFloorBoard({
  children,
  className,
}: ReserveFloorBoardProps) {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>;
}

// floor

interface ReserveFloorBoardFloorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  floorName: string;
  floors_range_start?: string | number;
  floors_range_end?: string | number;
  rooms_range_start?: string | number;
  rooms_range_end?: string | number;
  responsive_door?: boolean;
  variant?: "static" | "modern";
  levelNumber: number | string;
}

export function ReserveFloorBoardFloor({
  children,
  className,
  floorName,
  variant = "static",
  levelNumber,
  responsive_door = false,
  floors_range_start,
  floors_range_end,
  rooms_range_start,
  rooms_range_end,
  ...props
}: ReserveFloorBoardFloorProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="mb-2">
        <div
          className={cn(
            "w-full flex text-foreground rounded-md items-center justify-between font-bold",
            variant == "modern"
              ? "px-3 md:px-6 py-3 text-sm md:text-base lg:text-lg font-semibold text-muted-foreground bg-muted shadow-sm border"
              : "bg-gray-200 dark:bg-gray-800 text-sm px-2 py-1"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase">{floorName}</span>
            {floors_range_start && floors_range_end && (
              <Badge
                variant="outline"
                className="w-max px-2 py-0.5 bg-card rounded-full text-xs font-semibold flex items-center gap-1"
              >
                {floors_range_start}-{floors_range_end}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm uppercase">
            <span className={cn(variant == "modern" && "text-foreground")}>
              Level {levelNumber}
            </span>
          </div>
        </div>
        {rooms_range_start && rooms_range_end && (
          <Badge className="w-max px-2 py-1 rounded-full text-primary bg-primary/20 hover:bg-primary/20 text-xs font-semibold flex items-center gap-1 mt-4">
            <MdDoorSliding className="size-4" />
            {rooms_range_start}-{rooms_range_end}
          </Badge>
        )}
      </div>
      <div
        className={cn(
          "w-full grid mt-4 gap-4",
          responsive_door
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8"
            : "grid-cols-6"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// door

interface ReserveFloorBoardFloorDoorProps {
  selected?: boolean;
  number: string | number;
  reserved?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ReserveFloorBoardFloorDoor({
  number,
  className,
  onClick,
  selected = false,
  selectable = true,
  reserved,
}: ReserveFloorBoardFloorDoorProps) {
  return (
    <button
      data-reserved={reserved}
      data-selectable={selected && !selectable ? true : selectable}
      role="button"
      onClick={onClick}
      disabled={selected && !selectable ? false : !selectable || reserved}
      data-selected={selected}
      className={cn(
        "relative select-none transition-all data-[selectable=false]:opacity-20 data-[selectable=false]:cursor-default data-[reserved=true]:bg-gray-200 data-[reserved=true]:opacity-50 data-[reserved=true]:dark:bg-gray-800 data-[selected=true]:bg-primary/20 data-[selected=true]:border-primary/80 data-[selected=true]:rounded-md  data-[selected=false]:data-[selectable=true]:active:scale-95 data-[reserved=false]:data-[selectable=true]:hover:bg-muted data-[reserved=false]:cursor-pointer h-[5em] col-span-1 flex flex-col justify-center items-center gap-2 bg-background border border-border p-3",
        className
      )}
    >
      <span
        data-selected={selected}
        className="text-base text-center font-semibold text-foreground data-[selected=true]:text-primary"
      >
        {number}
      </span>
    </button>
  );
}

interface ReserveFloorBoardFloorDoorStaticProps {
  number: string | number;
  reserved?: boolean;
  onClick?: () => void;
  start_date?: Date | string;
  end_date?: Date | string;
  className?: string;
  reservation_id?: string;
}

export function ReserveFloorBoardFloorDoorStatic({
  number,
  className,
  onClick,
  reserved,
  end_date,
  reservation_id,
  start_date,
}: ReserveFloorBoardFloorDoorStaticProps) {
  return (
    <button
      data-reserved={reserved}
      role="button"
      onClick={onClick}
      className={cn(
        "group relative h-[14em] select-none transition-all hover:bg-muted/20 transform hover:scale-[1.06] overflow-hidden rounded-xl cursor-pointer flex flex-col justify-center items-center gap-2 bg-background border border-border p-3",
        reserved && "shadow-sm",
        className
      )}
    >
      <div
        className={cn(
          "w-full h-full flex flex-col justify-center items-center gap-3 border-2 border-dashed rounded-lg transition-colors",
          reserved
            ? "border-red-500/30 hover:border-red-500/60"
            : "border-green-500/30 hover:border-green-500/60"
        )}
      >
        <div className="flex items-center gap-2 text-foreground">
          {reserved ? (
            <FaDoorClosed className="size-5 text-red-500/80 group-hover:text-red-500 transition-colors" />
          ) : (
            <FaDoorOpen className="size-5 text-green-500/80 group-hover:text-green-500 transition-colors" />
          )}
          <span
            className="text-4xl font-bold font-mono  transition-all"
            title={`Room ${number}`}
            aria-label={`Room number ${number}`}
          >
            {number}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 bg-card border shadow-sm",
              reserved
                ? "border-red-500 text-red-500 bg-red-500/10"
                : "border-green-500 text-green-500 bg-green-500/10"
            )}
          >
            {reserved ? "Reserved" : "Available"}
          </div>
          {reserved && end_date && start_date ? (
            <div className="px-3 py-0.5 rounded-full text-[11px] text-xs font-medium bg-muted text-muted-foreground">
              {format(start_date, "LLL dd")} - {format(end_date, "LLL dd")}
            </div>
          ) : null}
        </div>
      </div>
      {/* reservation id */}
      {reserved ? (
        <Button
          size="icon"
          title={reservation_id || ""}
          onClick={() => copyTextToClipboard(reservation_id || "")}
          variant="outline"
          className="absolute right-1 bottom-1 size-6 rounded-full hidden group-hover:flex"
        >
          <HiOutlineHashtag className="size-[14px]" />
        </Button>
      ) : null}
    </button>
  );
}
