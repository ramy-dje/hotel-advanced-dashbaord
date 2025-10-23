import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { crud_update_rate_season } from "@/lib/curd/rate-season";
import toast from "react-hot-toast";

async function updateRateSeasonStatus(id: string, status: boolean) {
  try {
    
    const res = await crud_update_rate_season(id, { isActive: status });
    toast.success("Rate Season Status Updated Successfully");
  } catch (error) {
    toast.error("Failed to update rate season status");
  }
}
export const RateSeasonsTableColumns: ColumnDef<RatePlanSeasonInterface>[] = [
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
    accessorKey: "name",
    footer: "NAME",
  },
  {
    header: "CODE",
    accessorKey: "code",
    footer: "CODE",
  },
  {
    header:'REPEAT TYPE',
    accessorKey:'repeatType',
    footer:'REPEAT TYPE'
  },
  {
    header:'PERIODS COUNT',
    accessorKey: 'periods', // this is the key in your data
    cell: ({ row }) => row.original.periods.length,
  },
  {
    header: "CREATED AT",
    accessorFn: (d) =>
      DateTime.fromISO(d.createdAt as string).toFormat("dd-MM-yy"),
    footer: "CREATED AT",
  },
  {
    header:'IS ACTIVE',
    accessorKey:'isActive',
    cell: ({row}) =>{
      const isActive = row.original.isActive as boolean;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [switchData, setSwitchData] = useState(isActive);
      return (
      <Switch
        checked={switchData}
        onCheckedChange={(value) => {
          setSwitchData(value);
          updateRateSeasonStatus(row.original.id, value);
        }}
        size="sm"
      />
    )}
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
              onClick={() =>
                handleUpdate(c.row.original.id, c.row.original.name,c.row.original.code,c.row.original.periods,c.row.original.propertyId,c.row.original.repeatType,c.row.original.isActive)
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
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
