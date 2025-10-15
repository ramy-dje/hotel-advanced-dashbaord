import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineEye, HiOutlinePhone, HiOutlineTrash } from "react-icons/hi";
import JobSubmissionInterface from "@/interfaces/job-submission.interface";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const JobSubmissions_TableColumns: ColumnDef<JobSubmissionInterface>[] =
  [
    {
      id: "select",
      header: ({ table }) =>
        !(table.options.meta as any).has(["job_submission:delete"]) ? null : (
          <Checkbox
            className="size-5"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
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
        !(meta as any).has(["job_submission:delete"]) ? null : (
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
      accessorKey: "fullName",
      footer: "FULLNAME",
    },
    {
      header: "POSITION",
      accessorFn: (e) => e.job?.title || "/",
      footer: "POSITION",
    },
    {
      header: "TYPE",
      accessorKey: "job",
      cell: (e) =>
        e.getValue() ? (
          <Badge
            variant="outline"
            className="px-2 gap-2 text-xs rounded-full text-accent-foreground bg-background"
          >
            <div className="size-2.5 block bg-sky-600 rounded-full" />
            Submission
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="px-2 gap-2 text-xs rounded-full text-accent-foreground bg-background"
          >
            <div className="size-2.5 block bg-purple-500 rounded-full" />
            Spontaneous
          </Badge>
        ),
      footer: "TYPE",
    },
    {
      header: "PHONE",
      accessorKey: "phoneNumber",
      cell: ({ getValue }) => (
        <a
          href={("tel:" + getValue()) as string}
          target="_blank"
          className="text-primary flex items-center gap-1  line-clamp-1 hover:underline"
        >
          {getValue() as string}
          <HiOutlinePhone className="size-4" />
        </a>
      ),
      footer: "PHONE",
    },
    {
      header: "CV",
      accessorFn: (e) => e.cv_url,
      cell: ({ getValue }) => (
        <a
          href={getValue() as string}
          target="_blank"
          className="text-primary line-clamp-1 hover:underline"
        >
          {((getValue() as string) || "").slice(0, 28)}...
        </a>
      ),
      footer: "CV",
    },
    {
      header: "SUBMITTED ON",
      accessorFn: (d) =>
        DateTime.fromISO(d.createdAt as string).toFormat("dd-MM-yy"),
      footer: "SUBMITTED ON",
    },
    {
      header: "",
      id: "Action",
      footer: "",
      enableHiding: false,
      enableSorting: false,
      accessorKey: "id",
      cell: (c) => {
        const { handleReview, handleDelete, has }: any = c.table?.options?.meta;
        return (
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={() => handleReview(c.row.original)}
              variant="outline"
              size="icon"
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineEye className="size-4" />
            </Button>
            {has(["job_submission:delete"]) ? (
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
