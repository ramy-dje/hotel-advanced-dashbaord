import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineEye } from "react-icons/hi";
import ReservationsInterface from "@/interfaces/reservations.interface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import LimitedText from "@/components/limited-text";

export const TrashedReservations_TableColumns: ColumnDef<ReservationsInterface>[] =
  [
    {
      id: "select",
      header: ({ table }) =>
        !(table?.options?.meta as any).has([
          "reservation-status:update",
        ]) ? null : (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            className="size-5"
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
      cell: ({
        row,
        table: {
          options: { meta },
        },
      }) =>
        !(meta as any).has(["reservation-status:update"]) ? null : (
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
      header: "FULLNAME",
      accessorFn: (e) => e.person.fullName,
      cell: (c) => (
        <LimitedText limit={20}>{c.row.original.person.fullName}</LimitedText>
      ),
      footer: "FULLNAME",
    },
    {
      header: "CHECK IN",
      accessorFn: (e) => format(e.reserve.check_in, "LLL dd, y"),
      footer: "CHECK IN",
    },
    {
      header: "CHECK OUT",
      accessorFn: (e) => format(e.reserve.check_out, "LLL dd, y"),
      footer: "CHECK OUT",
    },
    {
      header: "ROOM",
      accessorFn: (e) => e.reserve.room.title,
      footer: "ROOM",
    },
    {
      header: "STATUS",
      accessorFn: (e) => e.process.status,
      cell: () => (
        <Badge
          variant="outline"
          className="px-2 gap-2 rounded-full text-accent-foreground bg-background"
        >
          <div className="size-2.5 block bg-red-500 rounded-full" />
          Archived
        </Badge>
      ),
      footer: "STATUS",
    },
    {
      header: "RESERVED AT",
      accessorFn: (d) => format(d.createdAt, "LLL dd, y"),
      footer: "RESERVED AT",
    },
    {
      header: "",
      id: "Action",
      footer: "",
      enableHiding: false,
      enableSorting: false,
      accessorKey: "id",
      cell: (c) => {
        const { handleViewReservation }: any = c.table?.options?.meta;
        return (
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleViewReservation(c.getValue())}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineEye className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];
