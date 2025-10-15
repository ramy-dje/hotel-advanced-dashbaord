"use client";

import useServerTable from "@/hooks/use-server-table";
import { useMemo, useState } from "react";
import { RoomBeds_TableColumns } from "./columns";
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
import RoomBedInterface from "@/interfaces/room-bed.interface";
import useRoomBedsStore from "../store";
import useAccess from "@/hooks/use-access";
import DeleteAllSelectedRoomBedsPopup from "./delete-all-selected-popup";

// The room beds table and filters section

interface Props {
  meta?: Record<any, any>;
}

export default function RoomBedsTable({ meta }: Props) {
  // access
  const { has } = useAccess();
  // room beds store hook
  const {
    beds_list: data,
    beds_number: total,
    set_many,
    set_total,
  } = useRoomBedsStore();

  const [searchState, setSearchState] = useState("");

  const { isFetching, totalPages, pagination, setPageRows, pageRows, table } =
    useServerTable<RoomBedInterface>({
      api: {
        url: "room-details/room-beds",
      },
      column: RoomBeds_TableColumns,
      data: data,
      setData: (d) => set_many(d),
      setTotalData: (n) => set_total(n),
      totalData: total,
      sorting: {},
      initialTable: { meta },
      search: { state: searchState, query: "name" },
      defaultRowsPerPage: "10",
    });

  // get all selected items
  const selectedItems: string[] = useMemo(() => {
    const items = table.getSelectedRowModel().rows.map((e) => e.original.id);
    return items;
  }, [table.getSelectedRowModel().rows]);

  return (
    <>
      {/* Filtering place */}
      <PageLayoutFilteringHeader>
        {/* searching */}
        <DebouncedSearchInput
          className="w-[22em] max-sm:w-full"
          onDebouncedValueChange={(e) => setSearchState(e as string)}
          placeholder="Search by bed name..."
        />
        {/* filtering and toggling */}
        <div className="flex items-center gap-2">
          {/* the permission to delete many room beds */}
          {has(["room_bed:delete"]) ? (
            <DeleteAllSelectedRoomBedsPopup
              unSelectedAll={() => table.setRowSelection({})}
              selectedIds={selectedItems}
            />
          ) : null}

          {/* The visible */}
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
