"use client";
import { Table as TableType, flexRender } from "@tanstack/react-table";
import { IoFileTrayFullOutline } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import EmptyIcon from "./empty-icon";

interface Props {
  // useReactTable returned table
  table: TableType<any>;
  className?: string;
  length: number;
  isLoading?: boolean;
  footer?: boolean;
}

export default function BasicTable({
  className,
  length,
  table,
  isLoading,
  footer,
}: Props) {
  return isLoading ? (
    <div className="w-full flex flex-col gap-4">
      <Skeleton className="w-full h-[4em] duration-500" />
      <Skeleton className="w-full h-[4em] duration-500" />
      <Skeleton className="w-full h-[4em] duration-500" />
      <Skeleton className="w-full h-[4em] duration-500" />
      <Skeleton className="w-full h-[4em] duration-500" />
      <Skeleton className="w-full h-[4em] duration-500" />
    </div>
  ) : (
    <Table key={"table"} className={cn("w-full", className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <>
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <>
                  <TableHead
                    className="text-left text-nowrap min-w-max"
                    key={header.id}
                    onClick={() =>
                      header.column.getCanSort() &&
                      header.column.toggleSorting()
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                </>
              ))}
            </TableRow>
          </>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}

        {table.getRowModel().rows.length == 0 ? (
          <TableRow className="hover:bg-background">
            <TableCell colSpan={length}>
              <div className="flex flex-col items-center justify-center py-6">
                <EmptyIcon />
                No data
              </div>
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
      {/* {footer ? (
        <TableFooter className="bg-muted">
          {table.getFooterGroups().map((footerGroup) => (
            <>
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <>
                    <TableHead
                      key={footer.id}
                      onClick={() =>
                        footer.column.getCanSort() &&
                        footer.column.toggleSorting()
                      }
                    >
                      <span className="flex items-center justify-center gap-1">
                        {footer.isPlaceholder
                          ? null
                          : flexRender(
                              footer.column.columnDef.header,
                              footer.getContext()
                            )}
                        {footer.column.getCanSort() &&
                        footer.column.getIsSorted() ? (
                          footer.column.getIsSorted() == "asc" ? (
                            <ChevronUpIcon
                              strokeWidth={3}
                              className="text-primary w-4"
                            />
                          ) : footer.column.getIsSorted() == "desc" ? (
                            <ChevronDownIcon
                              strokeWidth={3}
                              className="text-primary w-4"
                            />
                          ) : null
                        ) : null}
                      </span>
                    </TableHead>
                  </>
                ))}
              </TableRow>
            </>
          ))}
        </TableFooter>
      ) : null} */}
    </Table>
  );
}
