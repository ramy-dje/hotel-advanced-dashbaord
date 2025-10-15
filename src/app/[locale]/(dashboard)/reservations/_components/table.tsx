"use client";

import useServerTable from "@/hooks/use-server-table";
import { useMemo, useState } from "react";

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
import useReservationsStore from "../store";
import { AllReservations_TableColumns } from "./columns";
import ReservationsPageFiltering from "./filtering";
import useAccess from "@/hooks/use-access";
import CompleteAllSelectedApprovedReservationsPopup from "../approved/_components/complete-all-selected-popup";
import DeleteAllCompletedSelectedReservationsPopup from "../approved/_components/delete-all-selected-popup";
import CancelAllPendingSelectedReservationsPopup from "../pending/_components/cancel-all-selected-popup";
import RecoverAllSelectedReservationsPopup from "../canceled/_components/recover-all-selected-popup";
import DeleteAllSelectedReservationsPopup from "../canceled/_components/delete-all-selected-popup";
import DeleteAllDeletedSelectedReservationsPopup from "../archived/_components/delete-all-selected-popup";

// The (all) reservations table and filters section

interface Props {
  meta?: Record<any, any>;
}

export default function AllReservationsTable({ meta }: Props) {
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
    "approved" | "completed" | "canceled" | "pending" | "deleted" | null
  >(null);

  const [searchState, setSearchState] = useState("");

  const {
    filters,
    setFilters,
    isFetching,
    totalPages,
    pagination,
    setPageRows,
    table,
    pageRows,
  } = useServerTable<ReservationsInterface>({
    api: {
      url: "reservations",
    },
    column: AllReservations_TableColumns,
    data: data,
    totalData: total,
    setData: (d) => set_many(d),
    setTotalData: (n) => set_total(n),
    sorting: {},
    initialTable: {
      meta: {
        ...meta,
        disabled: currentSelectStatus,
      },
    },
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
        setCurrentSelectStatus("completed");
      } else if (items[0] && items[0].status == "approved") {
        setCurrentSelectStatus("approved");
      } else if (items[0] && items[0].status == "pending") {
        setCurrentSelectStatus("pending");
      } else if (items[0] && items[0].status == "deleted") {
        setCurrentSelectStatus("deleted");
      } else if (items[0] && items[0].status == "canceled") {
        setCurrentSelectStatus("canceled");
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
          className="max-sm:w-full w-[22em]"
          onDebouncedValueChange={(e) => setSearchState(e as string)}
          placeholder="Search by full name..."
        />
        {/* filtering and toggling */}
        <div className="flex items-center max-sm:flex-wrap gap-2">
          {/* Render the multiple actions buttons with permissions  */}

          {has(["reservation-status:update"]) ? (
            <>
              {/* mark all as completed  (for approved) */}
              {currentSelectStatus == "approved" ? (
                <CompleteAllSelectedApprovedReservationsPopup
                  unSelectedAll={() => table.setRowSelection({})}
                  selectedIds={selectedItems}
                />
              ) : null}

              {/* cancel all reservations (for pending) */}
              {currentSelectStatus == "pending" ? (
                <CancelAllPendingSelectedReservationsPopup
                  changeStatus
                  unSelectedAll={() => table.setRowSelection({})}
                  selectedIds={selectedItems}
                />
              ) : null}

              {/* delete selected reservations (for completed) */}
              {currentSelectStatus == "completed" ? (
                <DeleteAllCompletedSelectedReservationsPopup
                  changeStatus
                  unSelectedAll={() => table.setRowSelection({})}
                  selectedIds={selectedItems}
                />
              ) : null}

              {/* actions for canceled reservations (for canceled) */}
              {currentSelectStatus == "canceled" ? (
                <>
                  {/* recover selected reservations */}
                  <RecoverAllSelectedReservationsPopup
                    changeStatus
                    unSelectedAll={() => table.setRowSelection({})}
                    selectedIds={selectedItems}
                  />
                  {/* delete selected reservations */}
                  <DeleteAllSelectedReservationsPopup
                    unSelectedAll={() => table.setRowSelection({})}
                    changeStatus
                    selectedIds={selectedItems}
                  />
                </>
              ) : null}
            </>
          ) : null}

          {/* delete selected reservations (for deleted (archived)) */}
          {has(["reservation:delete"]) && currentSelectStatus == "deleted" ? (
            <DeleteAllDeletedSelectedReservationsPopup
              unSelectedAll={() => table.setRowSelection({})}
              selectedIds={selectedItems}
            />
          ) : null}

          {/* filter */}
          <ReservationsPageFiltering
            filters={filters}
            setFilters={setFilters}
          />
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
