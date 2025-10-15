import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { AppIconComponent } from "@/components/app-icon/icons";
import RoomBedInterface from "@/interfaces/room-bed.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const RoomBeds_TableColumns: ColumnDef<RoomBedInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["room_bed:delete"]) ? null : (
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
      !(meta as any).has(["room_bed:delete"]) ? null : (
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
    header: "ICON",
    accessorKey: "icon",
    cell: (e) => (
      <AppIconComponent name={e.getValue() as string} className="w-7" />
    ),
    footer: "ICON",
  },
  {
    header: "NAME",
    accessorKey: "name",
    footer: "NAME",
  },
  {
    header: "WIDTH",
    accessorKey: "width",
    footer: "WIDTH",
  },
  {
    header: "HEIGHT",
    accessorKey: "height",
    footer: "HEIGHT",
  },
  {
    header: "UNITE",
    accessorKey: "unite",
    footer: "UNITE",
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
          {has(["room_bed:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                handleUpdate(c.row.original.id, {
                  name: c.row.original.name,
                  icon: c.row.original.icon,
                  width: c.row.original.width,
                  height: c.row.original.height,
                  unite: c.row.original.unite,
                })
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["room_bed:delete"]) ? (
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
