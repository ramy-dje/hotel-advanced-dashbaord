import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { RatePlanInterface } from "@/interfaces/rate.interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { calculateTotal, getMealsFromCode, lightenHexColor } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { crud_update_rate } from "@/lib/curd/rate";
import toast from "react-hot-toast";

async function updateRateStatus(id: string, status: boolean) {
  try {
    const res = await crud_update_rate(id, { isActive: status });
    toast.success("Rate Status Updated Successfully");
  } catch (error) {
    toast.error("Failed to update rate status");
  }
}

export const RatePlanTableColumns: ColumnDef<RatePlanInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["blog_category:delete"]) ? null : (
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
      !(meta as any).has(["blog_category:delete"]) ? null : (
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
    accessorKey: "rateName",
    footer: "NAME",
  },
  {
    header: "CODE",
    accessorKey: "rateCode",
    footer: "CODE",
  },
  {
    header: "CATEGORY",
    accessorKey: "rateCategory.name",
    footer: "CATEGORY",
  },
  {
    header: "TYPE",
    accessorKey: "rateType",
    footer: "TYPE",
  },
  {
    header:'Price',
    accessorKey:'tiersTable',
    cell: ({ row }) => {
      const tiersTable = row.original.TiersTable;
      return (
        <div>
          {calculateTotal(tiersTable,row.original.factorRateCalculator,row.original.maxStay)}
        </div>
      );
    },
    footer:'Price'  
  },
  {
    header: "SEASON NAME",
    accessorKey: "predefinedSeason.name",
    footer: "SEASON NAME",
  },
  {
    header: "MEAL PLAN",
    accessorKey: "mealPlanCode",
    cell: ({ row }) => {
      const mealPlanCode: string = row.original.mealPlanCode || "";
      return (
        <Badge
          variant="outline"
          className="px-2 gap-2 rounded-full text-accent-foreground bg-background"
        >
          <div className="size-2.5 block rounded-full" style={{backgroundColor:getMealsFromCode(mealPlanCode).bgColor}} />
          {getMealsFromCode(mealPlanCode).label}
        </Badge>
      );
    },
    footer: "MEAL PLAN",
  },
  {
    header: "IS ACTIVE",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const isActive: boolean = row.original.isActive || false;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [switchData, setSwitchData] = useState(isActive);
      return (
        <Switch
          checked={switchData}
          onCheckedChange={(value) => {
            setSwitchData(value);
            updateRateStatus(row.original.id, value);
          }}
          size="sm"
        />
      );
    },
    footer: "IS ACTIVE",
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
          {has(["blog_category:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <Link href={`/fr/rate/update/${c.row.original.id}`}>
                <HiOutlinePencil className="size-4" />
              </Link>
            </Button>
          ) : null}
          {has(["blog_category:delete"]) ? (
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
