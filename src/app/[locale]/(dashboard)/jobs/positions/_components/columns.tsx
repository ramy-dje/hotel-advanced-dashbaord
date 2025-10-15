import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Badge } from "@/components/ui/badge";
import JobInterface from "@/interfaces/job.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const Jobs_TableColumns: ColumnDef<JobInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["job_position:delete"]) ? null : (
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
      !(meta as any).has(["job_position:delete"]) ? null : (
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
    accessorKey: "title",
    cell: ({ getValue }) => (
      <span className="lg:max-w-[10em] line-clamp-2">
        {getValue() as string}
      </span>
    ),
    footer: "NAME",
  },
  {
    header: "TYPE",
    accessorKey: "type",
    footer: "TYPE",
  },
  {
    header: "DEPARTMENT",
    accessorFn: (r) => r.department?.name || "/",
    footer: "DEPARTMENT",
  },
  {
    header: "LEVEL",
    accessorKey: "level",
    footer: "LEVEL",
  },
  {
    header: "POSITIONS",
    accessorKey: "positions",
    footer: "POSITIONS",
  },
  {
    header: "LOCATION",
    accessorKey: "locations",
    cell: ({ getValue }) => (
      <p className="max-w-[6em] line-clamp-1">
        <span title={(getValue() as any).state}>
          {(getValue() as any).state}
        </span>
        ,{" "}
        <span title={(getValue() as any).city}>{(getValue() as any).city}</span>
        ,{" "}
        <span title={(getValue() as any).address}>
          {(getValue() as any).address}
        </span>
      </p>
    ),
    footer: "LOCATION",
  },
  {
    header: "STATUS",
    accessorFn: (e) => e.id + e.expire,
    cell: ({
      row: {
        original: { expire },
      },
    }) =>
      new Date(expire as Date) < new Date(Date.now()) ? (
        <Badge
          variant="outline"
          className="px-2 gap-2 text-xs rounded-full text-accent-foreground bg-background"
        >
          <div className="size-2.5 block bg-red-500 rounded-full" />
          Expired
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="px-2 gap-2 text-xs rounded-full text-accent-foreground bg-background"
        >
          <div className="size-2.5 block bg-green-500 rounded-full" />
          Active
        </Badge>
      ),
    footer: "STATUS",
  },
  {
    header: "EXPIRE ON",
    accessorFn: (e) => e.id + e.expire,
    cell: ({
      row: {
        original: { expire },
      },
    }) => DateTime.fromISO(expire as string).toFormat("dd-MM-yy"),
    footer: "EXPIRE ON",
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
          {has(["job_position:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["job_position:delete"]) ? (
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
