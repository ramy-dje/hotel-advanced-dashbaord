"use client";

import useServerTable from "@/hooks/use-server-table";
import { useMemo, useState } from "react";
import { ApprovedReservations_TableColumns } from "./columns";
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
import CompleteAllSelectedApprovedReservationsPopup from "./complete-all-selected-popup";
import DeleteAllCompletedSelectedReservationsPopup from "./delete-all-selected-popup";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../../store";

// The approved reservations table and filters section

interface Props {
  meta?: Record<any, any>;
}

export default function ApprovedReservationsTable({ meta }: Props) {
  // access info
  const { has } = useAccess();
  // reservation store hook
  const {
    reservations_list: data,
    reservations_number: total,
    set_many,
    set_total,
  } = useReservationsStore();
  // the currentSelectStatus
  const [currentSelectStatus, setCurrentSelectStatus] = useState<
    "approved" | "completed" | null
  >(null);

  const [searchState, setSearchState] = useState("");

  const { isFetching, totalPages, pagination, setPageRows, table, pageRows } =
    useServerTable<ReservationsInterface>({
      api: {
        url: "reservations",
      },
      column: ApprovedReservations_TableColumns,
      data: data,
      totalData: total,
      setData: (d) => set_many(d),
      setTotalData: (n) => set_total(n),
      defaultFilters: {
        multiple_statuses: "approved,completed",
      },
      sorting: {},
      initialTable: { meta: { ...meta, disabled: currentSelectStatus } },
      search: { state: searchState, query: "name" },
      defaultRowsPerPage: "10",
    });

  // get all selected items
  const selectedItems = useMemo(() => {
    const items = table.getSelectedRowModel().rows.map((e) => ({
      id: e.original.id,
      status: e.original.process.status,
    }));

    if (items.length == 0) {
      setCurrentSelectStatus(null);
    } else {
      if (items[0] && items[0].status == "completed") {
        setCurrentSelectStatus("approved");
      } else if (items[0] && items[0].status == "approved") {
        setCurrentSelectStatus("completed");
      } else {
        setCurrentSelectStatus(null);
      }
    }

    return items.map((e) => e.id as string);
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
          {/* Render the multiple actions with permissions  */}
          {has(["reservation-status:update"]) ? (
            <>
              {/* mark all as completed  (for approved) */}
              {currentSelectStatus !== "approved" ? (
                <CompleteAllSelectedApprovedReservationsPopup
                  unSelectedAll={() => table.setRowSelection({})}
                  selectedIds={selectedItems}
                />
              ) : null}

              {/* delete selected reservations (for completed) */}
              {currentSelectStatus !== "completed" ? (
                <DeleteAllCompletedSelectedReservationsPopup
                  unSelectedAll={() => table.setRowSelection({})}
                  selectedIds={selectedItems}
                />
              ) : null}
            </>
          ) : null}
          {/* filtering */}
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
            setRowsPerPage={setPageRows}
            totalPages={totalPages}
            pageRows={pageRows}
            pagination={pagination}
          />
        </div>
      </PageLayoutTable>
    </>
  );
}
