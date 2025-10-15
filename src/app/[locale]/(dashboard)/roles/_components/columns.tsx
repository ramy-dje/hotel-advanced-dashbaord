import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import RoleInterface from "@/interfaces/role.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const Roles_TableColumns: ColumnDef<RoleInterface>[] = [
  {
    id: "select",
    header: () => "",
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) =>
      !(meta as any).has(["role:delete"]) ? null : (
        <Checkbox
          checked={row.getIsSelected()}
          className="size-5"
          disabled={!row.original.deletable}
          onCheckedChange={(value) =>
            row.original.deletable && row.toggleSelected(!!value)
          }
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "NAME",
    accessorKey: "name",
    cell: ({ row: { original } }) => (
      <span
        style={{
          backgroundColor: `rgb(from ${original.color} r g b / 0.1)`,
          borderColor: `rgb(from ${original.color} r g b / 0.5)`,
          color: `rgb(from ${original.color} r g b / 1)`,
        }}
        className="w-max flex items-center px-3 py-0.5 gap-2 text-xs rounded-full border font-medium"
      >
        {original.name}
      </span>
    ),
    footer: "NAME",
  },
  {
    header: "PERMISSION",
    accessorFn: (e) => e.permissions.length,
    cell: ({ getValue }) => getValue() + " permission",
    footer: "PERMISSION",
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
      const { handleDelete, handleUpdate, has }: any = c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {c.row.original.deletable && has(["role:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {c.row.original.deletable && has(["role:delete"]) ? (
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
