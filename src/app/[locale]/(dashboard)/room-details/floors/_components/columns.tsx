import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import FloorInterface from "@/interfaces/floor.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const Floors_TableColumns: ColumnDef<FloorInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["floor:delete"]) ? null : (
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
      !(meta as any).has(["floor:delete"]) ? null : (
        <Checkbox
          checked={row.getIsSelected()}
          className="size-5"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "NAME",
    accessorKey: "name",
    footer: "NAME",
  },
  {
    header: "LEVEL",
    accessorKey: "level",
    footer: "LEVEL",
  },
  {
    header: "RANGE",
    accessorFn: (e) => `From ${e.range_start} To ${e.range_end}`,
    footer: "RANGE",
  },
  {
    header: "RANGE START",
    accessorKey: "range_start",
    footer: "RANGE START",
  },
  {
    header: "RANGE END",
    accessorKey: "range_end",
    footer: "RANGE END",
  },
  {
    header: "FLOOR ROOMS",
    accessorKey: "rooms_number",
    footer: "FLOOR ROOMS",
  },
  {
    header: "ROOMS IN FLOOR",
    accessorFn: (n) => n.rooms.length || 0,
    footer: "ROOMS IN FLOOR",
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
      const { handleUpdate, handleDelete, has }: any = c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {has(["floor:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                handleUpdate(c.row.original.id, {
                  name: c.row.original.name,
                  level: c.row.original.level,
                  range_start: c.row.original.range_start,
                  range_end: c.row.original.range_end,
                })
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["floor:delete"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineTrash className="size-4" />
            </Button>
          ) : null}
        </div>
      );
    },
  },
];
