import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import {
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlineTrash,
  HiUser,
} from "react-icons/hi";
import { UserInterface } from "@/interfaces/user.interfaces";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const Users_TableColumns: ColumnDef<UserInterface>[] = [
  {
    id: "select",
    header: () => "",
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) =>
      !(meta as any).has(["user:delete"]) ? null : (
        <Checkbox
          checked={row.getIsSelected()}
          className="size-5"
          disabled={row.original.access.isAdmin}
          onCheckedChange={(value) =>
            !row.original.access.isAdmin && row.toggleSelected(!!value)
          }
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "PICTURE",
    cell: ({ row: { original } }) =>
      original.profileInfo.pic ? (
        <img
          src={original.profileInfo.pic}
          alt={original.profileInfo.fullName}
          className={cn(
            "size-[3em] object-cover rounded-full",
            original.profileInfo.gender == "male"
              ? "bg-blue-500/30"
              : "bg-pink-500/30"
          )}
        />
      ) : (
        <div
          className={cn(
            "size-[3em] flex justify-center items-center border-2 rounded-full",
            original.profileInfo.gender == "male"
              ? "border-blue-500 bg-blue-500/30 text-blue-500"
              : "border-pink-500 bg-pink-500/30 text-pink-500"
          )}
        >
          <HiUser className="size-6" />
        </div>
      ),
    footer: "PICTURE",
  },
  {
    header: "USERNAME",
    accessorFn: (e) => e.profileInfo.username,
    footer: "USERNAME",
  },
  {
    header: "FULLNAME",
    accessorFn: (e) => e.profileInfo.fullName,
    footer: "FULLNAME",
  },
  {
    header: "Gender",
    accessorFn: (e) => e.profileInfo.gender,
    cell: ({ getValue }) => (
      <span
        className={`font-medium ${
          getValue() == "male" ? "text-blue-500" : "text-pink-500"
        }`}
      >
        {getValue() + ""}
      </span>
    ),
    footer: "Gender",
  },
  {
    header: "EMAIL",
    accessorFn: (e) => e.profileInfo.email,
    cell: ({ getValue }) =>
      getValue() ? (
        <a
          href={("mailto:" + getValue()) as string}
          target="_blank"
          title={getValue() + ""}
          className="text-primary flex items-center gap-1  line-clamp-1 hover:underline"
        >
          {(getValue() as string).slice(0, 18)}
          {(getValue() as string).length >= 20 ? "..." : ""}
        </a>
      ) : (
        "/"
      ),
    footer: "EMAIL",
  },
  {
    header: "PHONE",
    accessorFn: (e) =>
      e?.profileInfo?.phoneNumber ? e?.profileInfo?.phoneNumber[0] : null,
    cell: ({ getValue }) =>
      getValue() ? (
        <a
          href={("tel:" + getValue()) as string}
          target="_blank"
          className="text-primary flex items-center gap-1  line-clamp-1 hover:underline"
        >
          {getValue() as string}
          <HiOutlinePhone className="size-4" />
        </a>
      ) : (
        "/"
      ),
    footer: "PHONE",
  },
  {
    header: "ROLE",
    accessorFn: (e) => e.access.role,
    cell: ({ row: { original } }) => (
      <span
        style={{
          backgroundColor: `rgb(from ${original.access.role.color} r g b / 0.1)`,
          borderColor: `rgb(from ${original.access.role.color} r g b / 0.5)`,
          color: `rgb(from ${original.access.role.color} r g b / 1)`,
        }}
        className="w-max flex items-center px-3 py-0.5 gap-2 text-xs rounded-full border font-medium"
      >
        {original.access.role.name}
      </span>
    ),
    footer: "ROLE",
  },
  {
    header: "STATUS",
    accessorFn: (e) => e.access.active,
    cell: ({ row: { original } }) =>
      !original.access.active ? (
        <Badge
          variant="outline"
          className="px-2 gap-2 text-xs rounded-full text-accent-foreground bg-background"
        >
          <div className="size-2.5 block bg-red-500 rounded-full" />
          Inactive
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="px-2 gap-2 text-xs rounded-full text-accent-foreground bg-background"
        >
          <div className="size-2.5 block bg-green-500 rounded-full" />
          Active
        </Badge>
      ),
    footer: "STATUS",
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
      const { handleDelete, handleUpdate, handleActive, has }: any =
        c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {!c.row.original.access.isAdmin && has(["user:activation"]) ? (
            <Button
              variant="outline"
              size="icon"
              title="activate/deactivate"
              onClick={() =>
                handleActive({
                  name: c.row.original.profileInfo.username,
                  id: c.row.original.id,
                  active: c.row.original.access.active,
                })
              }
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineLockClosed className="size-4" />
            </Button>
          ) : null}
          {!c.row.original.access.isAdmin && has(["user:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {!c.row.original.access.isAdmin && has(["user:delete"]) ? (
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
