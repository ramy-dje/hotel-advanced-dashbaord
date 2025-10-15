import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineBan, HiOutlineRefresh } from "react-icons/hi";
import RoomInterface from "@/interfaces/room.interface";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const DeletedRooms_TableColumns: ColumnDef<RoomInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["room:recover"]) ||
      !(table.options.meta as any).has(["room:force-delete"]) ? null : (
        <Checkbox
          className="size-5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) =>
      (meta as any).has(["room:recover"]) ||
      (meta as any).has(["room:force-delete"]) ? (
        <Checkbox
          checked={row.getIsSelected()}
          className="size-5"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "PHOTO",
    accessorKey: "images_main",
    // render the image
    cell: ({ row: { original } }) => (
      <div className="w-10">
        <img
          src={original.images_main}
          alt={original.title}
          loading="lazy"
          className="size-10 rounded-full object-cover object-center bg-primary/10"
        />
      </div>
    ),
    footer: "PHOTO",
  },
  {
    header: "NAME",
    accessorKey: "title",
    footer: "NAME",
  },
  {
    header: "CATEGORY",
    accessorFn: (r) => r.category.name,
    footer: "CATEGORY",
  },
  {
    header: "CODE",
    accessorKey: "code",
    footer: "CODE",
  },
  {
    header: "CAPACITY",
    accessorFn: (r) => r.capacity.total,
    footer: "CAPACITY",
  },
  {
    header: "FLOOR",
    accessorFn: (r) =>
      r.floors
        .map((r) => r.name)
        .filter((v, idx, arr) => arr.indexOf(v) == idx),
    cell: (e) => {
      return (
        <div className="max-w-[15em] flex flex-wrap gap-2">
          {(e.getValue() as string[]).slice(0, 2).map((r) => (
            <Badge variant="secondary" className="border border-border">
              {r}
            </Badge>
          ))}
          {(e.getValue() as string[]).length > 2 ? (
            <Badge
              title={
                (e.getValue() as string[])
                  .map((e, i, { length }) => e + (length - 1 == i ? "" : " ,"))
                  .join("") || ""
              }
              variant="secondary"
              className="border border-border"
            >
              ...
            </Badge>
          ) : null}
        </div>
      );
    },
    footer: "FLOOR",
  },
  {
    header: "CREATED AT",
    accessorFn: (d) =>
      DateTime.fromISO(d.createdAt as string).toFormat("dd-MM-yy"),
    footer: "CREATED AT",
  },
  {
    header: "",
    id: "Action",
    footer: "",
    enableHiding: false,
    enableSorting: false,
    accessorKey: "id",
    cell: (c) => {
      const { handleRecover, handleForceDelete, has }: any =
        c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {has(["room:recover"]) ? (
            <Button
              variant="outline"
              size="icon"
              title="Recover room"
              onClick={() => handleRecover(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineRefresh className="size-4" />
            </Button>
          ) : null}
          {has(["room:force-delete"]) ? (
            <Button
              variant="outline"
              size="icon"
              title="Force delete room"
              onClick={() => handleForceDelete(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineBan className="size-4" />
            </Button>
          ) : null}
        </div>
      );
    },
  },
];
