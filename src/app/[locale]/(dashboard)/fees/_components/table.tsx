"use client";

import useServerTable from "@/hooks/use-server-table";
import { useMemo, useState } from "react";
import { Fees_TableColumns } from "./columns";
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
import useFeesStore from "../store";
import useAccess from "@/hooks/use-access";
import DeleteAllSelectedTaxesPopup from "./delete-all-selected-popup";
import { FeeInterface } from "@/interfaces/fees.interface";

// The taxes categories table and filters section

interface Props {
  meta?: Record<any, any>;
}

export default function FeesTable({ meta }: Props) {
  // access
  const { has } = useAccess();
  // taxes store hook
  const {
    fees_list: data,
    fees_number: total,
    set_many,
    set_total,
  } = useFeesStore();

  const [searchState, setSearchState] = useState("");

  const { isFetching, totalPages, pageRows, pagination, setPageRows, table } =
    useServerTable<FeeInterface>({
      api: {
        url: "fees",
      },
      column: Fees_TableColumns,
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
          placeholder="Search by fee name.."
        />
        {/* filtering and toggling */}
        <div className="flex items-center gap-2">
          {/* the permission to delete many categories */}
          {has(["blog_category:delete"]) ? (
            <DeleteAllSelectedTaxesPopup
              unSelectedAll={() => table.setRowSelection({})}
              selectedIds={selectedItems}
            />
          ) : null}

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
            pageRows={pageRows}
            totalPages={totalPages}
            pagination={pagination}
          />
        </div>
      </PageLayoutTable>
    </>
  );
}
