import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import { Checkbox } from "@/components/ui/checkbox";

export const FoodDishes_TableColumns: ColumnDef<FoodDishInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["food_dish:delete"]) ? null : (
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
      !(meta as any).has(["food_dish:delete"]) ? null : (
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
          alt={original.name}
          loading="lazy"
          className="size-10 rounded-full object-cover object-center bg-primary/10"
        />
      </div>
    ),
    footer: "PHOTO",
  },
  {
    header: "NAME",
    accessorKey: "name",
    footer: "NAME",
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ getValue }) => <span>{getValue() as string}DA</span>,
    footer: "PRICE",
  },
  {
    header: "TYPE",
    accessorKey: "type",
    cell: ({ getValue }) => (
      <>{getValue() ? (getValue() as FoodDishInterface["type"])!.name : "/"}</>
    ),
    footer: "TYPE",
  },
  {
    header: "INGREDIENTS",
    accessorKey: "ingredients",
    cell: ({ getValue }) => (
      <span
        title={
          (getValue() as FoodDishInterface["ingredients"])
            .map((e, i, { length }) => e.name + (length - 1 == i ? "" : " ,"))
            .join("") || ""
        }
      >
        {(getValue() as FoodDishInterface["ingredients"])
          .slice(0, 3)
          .map((e, i, { length }) => e.name + (length - 1 == i ? "" : " ,"))}
        {(getValue() as any[]).length > 3 ? "..." : ""}
      </span>
    ),
    footer: "INGREDIENTS",
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
          {has(["food_dish:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["food_dish:delete"]) ? (
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
