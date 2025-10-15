import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import FoodMenuInterface from "@/interfaces/food-menu.interface";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const FoodMenus_TableColumns: ColumnDef<FoodMenuInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["food_menu:delete"]) ? null : (
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
      !(meta as any).has(["food_menu:delete"]) ? null : (
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
    header: "SECTIONS",
    accessorFn: (d) => d.sections.map((n) => n.title),
    cell: (e) => {
      return (
        <>
          <div className="max-w-[37em] flex flex-wrap gap-2">
            {(e.getValue() as string[]).slice(0, 2).map((r) => (
              <Badge variant="secondary" className="border border-border">
                {r}
              </Badge>
            ))}
            {(e.getValue() as string[]).length > 2 ? (
              <Badge
                variant="secondary"
                className="border border-border"
                title={
                  (e.getValue() as string[])
                    .map(
                      (e, i, { length }) => e + (length - 1 == i ? "" : " ,")
                    )
                    .join("") || ""
                }
              >
                ...
              </Badge>
            ) : (
              ""
            )}
          </div>
        </>
      );
    },
    footer: "SECTIONS",
  },
  {
    header: "DISHES",
    accessorFn: (d) =>
      d.sections
        .map((e) => e.dishes)
        .reduce((a, b) => [...a, ...b], [])
        .map((n) => n.name)
        .filter((v, idx, arr) => arr.indexOf(v) == idx),
    cell: (e) => {
      return (
        <>
          <div className="max-w-[37em] flex flex-wrap gap-2">
            {(e.getValue() as string[]).slice(0, 2).map((r) => (
              <Badge variant="secondary" className="border border-border">
                {r}
              </Badge>
            ))}
            {(e.getValue() as string[]).length > 2 ? (
              <Badge
                variant="secondary"
                className="border border-border"
                title={
                  (e.getValue() as string[])
                    .map(
                      (e, i, { length }) => e + (length - 1 == i ? "" : " ,")
                    )
                    .join("") || ""
                }
              >
                ...
              </Badge>
            ) : (
              ""
            )}
          </div>
        </>
      );
    },
    footer: "DISHES",
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
      const { handleUpdate, handleView, handleDelete, has }: any =
        c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={() => handleView(c.row.original)}
            variant="outline"
            size="icon"
            className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
          >
            <HiOutlineEye className="size-4" />
          </Button>
          {has(["food_menu:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["food_menu:delete"]) ? (
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
