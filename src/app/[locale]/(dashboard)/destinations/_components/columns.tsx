import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import DestinationInterface from "@/interfaces/destination.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const Destinations_TableColumns: ColumnDef<DestinationInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["destination:delete"]) ? null : (
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
      !(meta as any).has(["destination:delete"]) ? null : (
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
    header: "PHOTO",
    accessorKey: "image",
    // render the image
    cell: ({ row: { original } }) => (
      <div className="w-10">
        <img
          src={original.image}
          alt={original.title}
          loading="lazy"
          className="size-10 rounded-full object-cover object-center bg-primary/10"
        />
      </div>
    ),
    footer: "PHOTO",
  },
  {
    header: "TITLE",
    accessorKey: "title",
    cell: ({ getValue }) => (
      <span title={getValue() as string}>
        {(getValue() as string).slice(0, 30)}
        {(getValue() as string).length >= 20 ? "..." : ""}
      </span>
    ),
    footer: "TITLE",
  },
  {
    header: "DISTANCE",
    accessorKey: "distance",
    cell: ({ getValue }) => <>{getValue() as string}Km</>,
    footer: "DISTANCE",
  },
  {
    header: "UPDATED AT",
    accessorFn: (d) =>
      DateTime.fromISO(d.updateAt as string).toFormat("dd-MM-yy"),
    footer: "UPDATED AT",
  },
  {
    header: "PUBLISHED ON",
    accessorFn: (d) =>
      DateTime.fromISO(d.createdAt as string).toFormat("dd-MM-yy"),
    footer: "PUBLISHED ON",
  },
  {
    header: "",
    id: "Action",
    footer: "",
    enableHiding: false,
    enableSorting: false,
    accessorKey: "id",
    cell: (c) => {
      const { handleDelete, handleUpdate, has }: any = c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {has(["destination:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["destination:delete"]) ? (
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
