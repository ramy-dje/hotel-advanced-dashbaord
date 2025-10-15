import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

export const RoomCategories_TableColumns: ColumnDef<RoomCategoryInterface>[] = [
  {
    header: "NAME",
    accessorKey: "name",
    footer: "NAME",
  },
  {
    header: "SLUG",
    accessorKey: "slug",
    footer: "SLUG",
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
          {has(["room_category:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                handleUpdate(c.row.original.id, c.row.original.name)
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["room_category:delete"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(c.getValue())}
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
