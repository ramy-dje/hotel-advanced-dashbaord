import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiUserGroup,
} from "react-icons/hi";
import CRMCompanyInterface from "@/interfaces/crm-company.interface";
import { Checkbox } from "@/components/ui/checkbox";
import LimitedText from "@/components/limited-text";
import { FaBuilding } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

export const CRMCompanies_TableColumns: ColumnDef<CRMCompanyInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["crm_company:delete"]) ? null : (
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
      !(meta as any).has(["crm_company:delete"]) ? null : (
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
    header: "LOGO",
    cell: ({ row: { original } }) =>
      original.info.logo ? (
        <img
          src={original.info.logo}
          alt={original.info.logo}
          width={50}
          height={50}
          loading="lazy"
          className="size-[2.5em] object-cover rounded-full border bg-gray-100 border-gray-500/30"
        />
      ) : (
        <div className="size-[2.5em] flex justify-center items-center border rounded-full bg-gray-100 border-gray-500/30 text-gray-700">
          <FaBuilding className="size-4" />
        </div>
      ),
    footer: "LOGO",
  },
  {
    header: "NAME",
    accessorFn: (e) => e.info.name,
    cell: ({ row: { original } }) => (
      <LimitedText limit={16}>{original.info.name}</LimitedText>
    ),
    footer: "NAME",
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
    header: "SIZE",
    accessorFn: (e) => e.info.size,
    cell: ({ row: { original } }) => (
      <Badge
        className="min-w-max  px-2 py-1 gap-2 items-center text-xs rounded-full border border-input"
        variant="secondary"
      >
        <span className="leading-2">{original.info.size}</span>
        <HiUserGroup className="size-3.5" />
      </Badge>
    ),
    footer: "SIZE",
  },
  {
    header: "CATEGORY",
    accessorFn: (e) => e.category || "/",
    cell: ({ row: { original } }) =>
      original.category ? (
        <LimitedText limit={14}>{original.category}</LimitedText>
      ) : (
        "/"
      ),
    footer: "CATEGORY",
  },
  {
    header: "INDUSTRY",
    accessorFn: (e) => e.industry || "/",
    cell: ({ row: { original } }) =>
      original.industry ? (
        <LimitedText limit={14}>{original.industry}</LimitedText>
      ) : (
        "/"
      ),
    footer: "INDUSTRY",
  },
  {
    header: "LOCATION",
    accessorFn: (e) =>
      e.info.location?.country || e.info.location?.region || "/",
    cell: ({ row: { original } }) =>
      original.info.location?.country || original.info.location?.region ? (
        <LimitedText limit={20}>
          {original.info.location?.country +
            ", " +
            original.info.location?.region}
        </LimitedText>
      ) : (
        "/"
      ),
    footer: "LOCATION",
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
            onClick={() => handleView(c.row.original.id)}
            variant="outline"
            size="icon"
            className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
          >
            <HiOutlineEye className="size-4" />
          </Button>
          {has(["crm_company:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["crm_company:delete"]) ? (
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
