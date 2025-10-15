import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineEye, HiOutlinePencil } from "react-icons/hi";
import ReservationsInterface from "@/interfaces/reservations.interface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import LimitedText from "@/components/limited-text";

export const AllReservations_TableColumns: ColumnDef<ReservationsInterface>[] =
  [
    {
      id: "select",
      header: () => "",
      cell: ({
        row,
        table: {
          options: { meta },
        },
      }) =>
        !(meta as any).has(["reservation-status:update"]) ? null : (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={
              (meta as any).disabled !== null &&
              (meta as any).disabled !== row.original.process.status
            }
            className={cn(
              "size-5",
              (meta as any).disabled !== row.original.process.status &&
                "disabled:opacity-20"
            )}
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
      cell: ({ row: { original } }) =>
        `${original.reserve.room.title} x${original.reserve.rooms_number}`,
      footer: "ROOM",
    },
    {
      header: "STATUS",
      accessorFn: (e) => e.process.status,
      cell: ({ row: { original } }) =>
        original.process.status == "approved" ? (
          <Badge
            variant="outline"
            key={original.process.status}
            className="px-2 gap-2 rounded-full text-accent-foreground bg-background"
          >
            <div className="size-2.5 block bg-green-500 rounded-full" />
            Approved
          </Badge>
        ) : original.process.status == "deleted" ? (
          <Badge
            key={original.process.status}
            variant="outline"
            className="px-2 gap-2 rounded-full text-accent-foreground bg-background"
          >
            <div className="size-2.5 block bg-red-500 rounded-full" />
            Archived
          </Badge>
        ) : original.process.status == "canceled" ? (
          <Badge
            key={original.process.status}
            variant="outline"
            className="px-2 gap-2 rounded-full text-accent-foreground bg-background"
          >
            <div className="size-2.5 block bg-gray-500 rounded-full" />
            Canceled
          </Badge>
        ) : original.process.status == "completed" ? (
          <Badge
            key={original.process.status}
            variant="outline"
            className="px-2 gap-2 rounded-full text-accent-foreground bg-background"
          >
            <div className="size-2.5 block bg-blue-500 rounded-full" />
            Completed
          </Badge>
        ) : (
          <Badge
            key={original.process.status}
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
        const {
          handleApprovedReservation,
          handleViewArchivedReservation,
          handleViewCompletedReservation,
          handleViewCanceledReservation,
          handleUpdatePendingReservation,
          has,
        }: any = c.table?.options?.meta;
        return c.row.original.process.status == "approved" ||
          (c.row.original.process.status == "pending" &&
            has(["reservation:update"])) ? (
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                c.row.original.process.status == "approved"
                  ? handleApprovedReservation(c.row.original.id)
                  : handleUpdatePendingReservation(c.row.original.id)
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                c.row.original.process.status == "completed"
                  ? handleViewCompletedReservation(c.row.original.id)
                  : c.row.original.process.status == "deleted"
                  ? handleViewArchivedReservation(c.row.original.id)
                  : handleViewCanceledReservation(c.row.original.id)
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineEye className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];
