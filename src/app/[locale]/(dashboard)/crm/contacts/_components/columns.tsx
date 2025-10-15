import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiUser,
} from "react-icons/hi";
import CRMContactInterface from "@/interfaces/crm-contact.interface";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import LimitedText from "@/components/limited-text";
import { Badge } from "@/components/ui/badge";

export const CRMContacts_TableColumns: ColumnDef<CRMContactInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["crm_contacts:delete"]) ? null : (
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
      !(meta as any).has(["crm_contacts:delete"]) ? null : (
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
    header: "PICTURE",
    cell: ({ row: { original } }) =>
      original.personalInfo.pic ? (
        <img
          src={original.personalInfo.pic}
          alt={original.personalInfo.firstName}
          width={50}
          height={50}
          loading="lazy"
          className={cn(
            "size-[2.5em] object-cover rounded-full border border-input",
            original.personalInfo.gender == "male"
              ? "bg-blue-500/30"
              : "bg-pink-500/30"
          )}
        />
      ) : (
        <div
          className={cn(
            "size-[2.5em] flex justify-center items-center border-2 rounded-full",
            original.personalInfo.gender == "male"
              ? "border-blue-500 bg-blue-500/30 text-blue-500"
              : "border-pink-500 bg-pink-500/30 text-pink-500"
          )}
        >
          <HiUser className="size-4" />
        </div>
      ),
    footer: "PICTURE",
  },
  {
    header: "FULLNAME",
    accessorFn: (e) => e.personalInfo.firstName,
    cell: ({ row: { original } }) => (
      <LimitedText limit={16}>
        {original.personalInfo.firstName + " " + original.personalInfo.lastName}
      </LimitedText>
    ),
    footer: "FULLNAME",
  },
  {
    header: "GENDER",
    accessorFn: (e) => e.personalInfo.gender,
    cell: ({ getValue }) => (
      <span
        className={`font-medium ${
          getValue() == "male" ? "text-blue-500" : "text-pink-500"
        }`}
      >
        {getValue() + ""}
      </span>
    ),
    footer: "GENDER",
  },
  {
    header: "EMAIL",
    accessorFn: (e) => e.emails[0] || "/",
    cell: ({ row: { original } }) =>
      original.emails[0] ? (
        <a
          href={("mailto:" + original.emails[0]) as string}
          target="_blank"
          title={original.emails[0]}
          className="text-primary flex items-center gap-1  line-clamp-1 hover:underline"
        >
          <LimitedText limit={14}>{original.emails[0]}</LimitedText>
        </a>
      ) : (
        "/"
      ),
    footer: "EMAIL",
  },
  {
    header: "OCCUPATION",
    accessorFn: (e) => e.work.occupation || "/",
    cell: ({ row: { original } }) =>
      original.work.occupation ? (
        <LimitedText limit={14}>{original.work.occupation}</LimitedText>
      ) : (
        "/"
      ),
    footer: "OCCUPATION",
  },
  {
    header: "COMPANY",
    accessorFn: (e) => e.work.company || "/",
    cell: ({ row: { original } }) =>
      original.work.company ? (
        <LimitedText limit={14}>{original.work.company}</LimitedText>
      ) : (
        "/"
      ),
    footer: "COMPANY",
  },
  {
    header: "SOURCE",
    accessorFn: (e) => e.resource || "/",
    cell: ({ row: { original } }) =>
      original.resource ? (
        <LimitedText limit={12}>{original.resource}</LimitedText>
      ) : (
        "/"
      ),
    footer: "SOURCE",
  },
  {
    header: "FROM",
    accessorKey: "insertedBy",
    cell: ({ row: { original } }) => (
      <Badge
        variant="outline"
        className={cn(
          "w-[7em] px-2 gap-2 justify-center text-xs rounded-full bg-background",
          original.insertedBy != "dashboard"
            ? "text-green-600 bg-green-500/10 border-green-700/20"
            : "text-purple-600 bg-purple-500/10 border-purple-700/20"
        )}
      >
        {original.insertedBy == "dashboard" ? "Dashboard" : "Website"}
      </Badge>
    ),
    footer: "FROM",
  },
  {
    header: "ACCESS",
    accessorKey: "access",
    cell: ({ row: { original } }) =>
      original.access ? (
        <span
          style={{
            backgroundColor: `rgb(from ${original.access.access.role.color} r g b / 0.1)`,
            borderColor: `rgb(from ${original.access.access.role.color} r g b / 0.5)`,
            color: `rgb(from ${original.access.access.role.color} r g b / 1)`,
          }}
          className="w-max flex items-center px-3 py-0.5 gap-2 text-xs font-medium rounded-full border"
        >
          {original.access.access.role.name}
        </span>
      ) : (
        "/"
      ),
    footer: "ACCESS",
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
      const { handleDelete, handleView, handleUpdate, has }: any =
        c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={() => handleView(c.getValue())}
            variant="outline"
            size="icon"
            className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
          >
            <HiOutlineEye className="size-4" />
          </Button>
          {has(["crm_contacts:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["crm_contacts:delete"]) ? (
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
