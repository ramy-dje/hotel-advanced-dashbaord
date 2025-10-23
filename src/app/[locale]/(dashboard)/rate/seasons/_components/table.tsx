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
import useRateSeasonStore from "../store";
import useAccess from "@/hooks/use-access";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { RateSeasonsTableColumns } from "./columns";
import SeasonFiltering from "./filtering";
import DeleteAllSelectedRatePlanPopup from "@/app/[locale]/(dashboard)/rate/overview/_components/delete-all-selected-popup";
// The rate seasons table and filters section

interface Props {
  meta?: Record<any, any>;
}

export default function RateSeasonsTable({ meta }: Props) {
  // access
  const { has } = useAccess();
  // rate seasons store hook
  const {
    seasons_list: data,
    seasons_number: total,
    set_many,
    set_total,
  } = useRateSeasonStore();

  const [searchState, setSearchState] = useState("");

  const { 
    isFetching, 
    filters, 
    setFilters, 
    totalPages, 
    pageRows, 
    pagination, 
    setPageRows, 
    table 
  } = useServerTable<RatePlanSeasonInterface>({
      api: {
        url: "rate-season",
      },
      column: RateSeasonsTableColumns,
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
          placeholder="Search by season name.."
        />
        {/* filtering and toggling */}
        <div className="flex items-center gap-2">
          {/* the permission to delete many seasons */}
         
            <DeleteAllSelectedRatePlanPopup
              unSelectedAll={() => table.setRowSelection({})}
              selectedIds={selectedItems}
            />
         

          {/* Filtering */}
          <SeasonFiltering filters={filters} setFilters={setFilters} />

          {/* The visibility */}
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
            pageRows={pageRows}
            totalPages={totalPages}
            pagination={pagination}
          />
        </div>
      </PageLayoutTable>
    </>
  );
}
