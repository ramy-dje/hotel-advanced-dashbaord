import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import BlogInterface from "@/interfaces/blog.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const Blogs_TableColumns: ColumnDef<BlogInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["blog:delete"]) ? null : (
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
      !(meta as any).has(["blog:delete"]) ? null : (
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
    header: "WRITER",
    accessorKey: "author",
    footer: "WRITER",
  },
  {
    header: "READ TIME",
    accessorKey: "readTime",
    cell: ({ getValue }) => <>{getValue() as string}m</>,
    footer: "READ TIME",
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
          {has(["blog:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["blog:delete"]) ? (
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
