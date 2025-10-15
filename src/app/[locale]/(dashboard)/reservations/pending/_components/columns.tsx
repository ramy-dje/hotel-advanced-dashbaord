import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ReservationsInterface from "@/interfaces/reservations.interface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import LimitedText from "@/components/limited-text";

export const PendingReservations_TableColumns: ColumnDef<ReservationsInterface>[] =
  [
    {
      id: "select",
      header: ({ table }) =>
        !(table.options.meta as any).has([
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
          <div className="size-2.5 block bg-yellow-500 rounded-full" />
          Pending
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
        const { handleUpdateReservation, has }: any = c.table?.options?.meta;
        return (
          <div className="flex items-center justify-end gap-3">
            {has(["reservation:update"]) ? (
              <Button
                variant="default"
                size="icon"
                onClick={() => handleUpdateReservation(c.row.original.id)}
                className="h-7 w-auto px-2 gap-1"
              >
                Review
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];
