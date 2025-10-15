"use client";

import useServerTable from "@/hooks/use-server-table";
import { useMemo, useState } from "react";
import { TrashedReservations_TableColumns } from "./columns";
import {
  PageLayoutFilteringHeader,
  PageLayoutTable,
} from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { PiTextColumnsLight } from "react-icons/pi";
import BasicTable from "@/components/basic-table";
import { DebouncedSearchInput } from "@/components/debounced-input";
import TablePagination from "@/components/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReservationsInterface from "@/interfaces/reservations.interface";
import DeleteAllDeletedSelectedReservationsPopup from "./delete-all-selected-popup";
import DeleteAllDeletedReservationsPopup from "./delete-all-deleted-popup";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../../store";

// The trashed reservations table and filters section

interface Props {
  meta?: Record<any, any>;
}

export default function TrashedReservationsTable({ meta }: Props) {
  // access info
  const { has } = useAccess();

  // reservation store hook
  const {
    reservations_list: data,
    reservations_number: total,
    set_many,
    set_total,
  } = useReservationsStore();

  const [searchState, setSearchState] = useState("");

  const { isFetching, totalPages, pagination, setPageRows, table, pageRows } =
    useServerTable<ReservationsInterface>({
      api: {
        url: "reservations",
      },
      column: TrashedReservations_TableColumns,
      data: data,
      totalData: total,
      setData: (d) => set_many(d),
      setTotalData: (n) => set_total(n),
      defaultFilters: {
        status: "deleted",
      },
      sorting: {},
      initialTable: {
        meta,
      },
      search: { state: searchState, query: "name" },
      defaultRowsPerPage: "10",
    });

  // get all selected items
  const selectedItems = useMemo(() => {
    return table.getSelectedRowModel().rows.map((e) => e.original.id);
  }, [table.getSelectedRowModel().rows]);

  return (
    <>
      {/* Filtering place */}
      <PageLayoutFilteringHeader>
        {/* searching */}
        <DebouncedSearchInput
          className="w-[22em] max-sm:w-full"
          onDebouncedValueChange={(e) => setSearchState(e as string)}
          placeholder="Search by full name..."
        />
        {/* filtering and toggling */}
        <div className="flex items-center gap-2">
          {/* Render the multiple actions buttons with permissions  */}
          {has(["reservation:delete"]) ? (
            <>
              {/* delete selected reservations */}
              <DeleteAllDeletedSelectedReservationsPopup
                unSelectedAll={() => table.setRowSelection({})}
                selectedIds={selectedItems}
              />
              {/* delete all reservations */}
              <DeleteAllDeletedReservationsPopup disabled={data.length == 0} />
            </>
          ) : null}
          {/* filter */}
          {/* <Button
            size="sm"
            disabled
            variant="outline"
            className="gap-2 font-normal text-accent-foreground/80"
          >
            <BiFilterAlt className="size-4" /> Filters
          </Button> */}
          {/* The visibalt */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                title="Toggle columns"
                size="icon"
                variant="outline"
                className="size-9"
              >
                <PiTextColumnsLight className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="left-0">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <PageLayoutTable className="">
        <BasicTable
          length={10}
          isLoading={isFetching}
          className="w-full"
          table={table}
        />
        <div className="mt-4">
          <TablePagination
            isLoading={isFetching}
            pageRows={pageRows}
            setRowsPerPage={setPageRows}
            totalPages={totalPages}
            pagination={pagination}
          />
        </div>
      </PageLayoutTable>
    </>
  );
}
