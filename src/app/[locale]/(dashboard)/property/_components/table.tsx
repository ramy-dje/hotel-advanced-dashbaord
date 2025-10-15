"use client";

import useServerTable from "@/hooks/use-server-table";
import { useMemo, useState } from "react";
import { Properties_TableColumns } from "./columns";            // ← your property columns
import {
  PageLayoutFilteringHeader,
  PageLayoutTable,
} from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { PiTextColumnsLight } from "react-icons/pi";
import BasicTable from "@/components/basic-table";
import { DebouncedSearchInput } from "@/components/debounced-input";
import TablePagination from "@/components/pagination";
import PropertyInterface from "@/interfaces/property.interface"; // ← your property interface
import PropertiesPageFiltering from "./filtering";              // ← your property filters
import useAccess from "@/hooks/use-access";
import DeleteAllSelectedPropertiesPopup from "./delete-all-selected-popup";
import usePropertiesStore from "../store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// The properties table and filters section
interface Props {
  meta?: Record<any, any>;
}

export default function PropertiesTable({ meta }: Props) {
  // access
  const { has } = useAccess();

  // properties store hook
  const {
    properties_list: data,
    properties_number: total,
    set_many,
    set_total,
  } = usePropertiesStore();


console.log("🧮 Properties in store:", data); // ← Log current state

  const [searchState, setSearchState] = useState("");

  // ← note the generic change here to PropertyInterface
  const {
    isFetching,
    totalPages,
    filters,
    setFilters,
    pagination,
    setPageRows,
    table,
    pageRows,
  } = useServerTable<PropertyInterface>({
    api: {
      url: "property",     // ← hit the properties endpoint
    },
    column: Properties_TableColumns,
    data: data,
    setData: (d) => set_many(d),
    setTotalData: (n) => set_total(n),
    totalData: total,
    sorting: {},
    initialTable: { meta },
    search: { state: searchState, query: "propertyName" }, // ← or whatever your search field is
    defaultRowsPerPage: "10",
  });

  // get all selected items
  const selectedItems: string[] = useMemo(
    () => table.getSelectedRowModel().rows.map((e) => e.original.id),
    [table.getSelectedRowModel().rows]
  );

  return (
    <>
      {has(["property:delete"]) && (
        <DeleteAllSelectedPropertiesPopup
          unSelectedAll={() => table.setRowSelection({})}
          selectedIds={selectedItems}
        />
      )}

      <PageLayoutFilteringHeader>
        <DebouncedSearchInput
          className="w-[22em] max-sm:w-full"
          onDebouncedValueChange={(e) => setSearchState(e as string)}
          placeholder="Search by property name..."
        />

        <div className="flex items-center max-sm:flex-row gap-2">
          {has(["property:delete"]) && (
            <DeleteAllSelectedPropertiesPopup
              unSelectedAll={() => table.setRowSelection({})}
              selectedIds={selectedItems}
            />
          )}

          <PropertiesPageFiltering filters={filters} setFilters={setFilters} />

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
                .map((column) => (
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
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageLayoutFilteringHeader>

      <PageLayoutTable>
        <BasicTable
          length={10}
          isLoading={isFetching}
          className="w-full"
          table={table}
        />
        <div className="mt-4">
          <TablePagination
            pageRows={pageRows}
            isLoading={isFetching}
            setRowsPerPage={setPageRows}
            totalPages={totalPages}
            pagination={pagination}
          />
        </div>
      </PageLayoutTable>
    </>
  );
}
