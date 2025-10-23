import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Client_OfferInterface } from "@/interfaces/offers.interface";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { crud_update_offer } from "@/lib/curd/offers";
import toast from "react-hot-toast";
import { useState } from "react";

export function typeConverter(type: string) {
  switch (type) {
    case "amountOfProducts":
      return "Amount of products";
    case "package":
      return "Package";
    case "amountOfOrder":
      return "Amount of order";
    case "buyXGetY":
      return "Buy X Get Y";
    default:
      return "N/A";
  }
}
async function updateOfferStatus(id: string, status: boolean) {
  try {
    const res = await crud_update_offer(id, { isActive: status });
    toast.success("Offer Status Updated Successfully");
  } catch (error) {
    toast.error("Failed to update offer status");
  }
}
export const OfferTableColumns: ColumnDef<Client_OfferInterface>[] = [
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
    cell: ({ row }) => {
      const code: string = row.original.code || "";
      return <div>{code || <p className="text-gray-500">/</p>}</div>;
    },
    footer: "CODE",
  },
  {
    header: "TYPE",
    accessorKey: "type",
    cell: ({ row }) => {
      const type: string = row.original.type || "";
      return <div>{typeConverter(type)}</div>;
    },
    footer: "TYPE",
  },
  {
    header: "METHOD",
    accessorKey: "method",
    footer: "METHOD",
  },
  {
    header: "REFUNDABLE",
    accessorKey: "isRefundable",
    cell: ({ row }) => {
      const hasRequirements: string = row.original.requirements.type || "";
      return (
        <div>
          {hasRequirements == "no_requirements" ? (
            <Check
              className="size-5"
              style={{ color: "green" }}
            />
          ) : (
            <X
              className="size-5"
              style={{ color: "gray" }}
            />
          )}
        </div>
      );
    },
    footer: "REFUNDABLE",
  },
  {
    header: "Start Date",
    accessorKey: "timeValidity?.startDate",
    cell: ({ row }) => {
      const startDate: string =
        format(row.original.timeValidity?.startDate || "", "yyyy-MM-dd") || "";
      return <div>{startDate || <p className="text-gray-500">/</p>}</div>;
    },
    footer: "Start Date",
  },
  {
    header: "End Date",
    accessorKey: "timeValidity?.endDate",
    cell: ({ row }) => {
      const endDate: string = row.original.timeValidity?.endDate
        ? format(row.original.timeValidity?.endDate, "yyyy-MM-dd")
        : "";
      return <div>{endDate || <p className="text-gray-500">/</p>}</div>;
    },
    footer: "End Date",
  },

  {
    header: "ACTIVE",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const isActive = row.original.isActive as boolean;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [switchData, setSwitchData] = useState(isActive);
      return (
        <div>
          <Switch
            checked={switchData}
            onCheckedChange={(value) => {
              setSwitchData(value);
              updateOfferStatus(row.original.id, value);
            }}
            size="sm"
          />
        </div>
      );
    },
    footer: "ACTIVE",
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
              <Link href={`/fr/rate/offers/update/${c.row.original.id}`}>
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
