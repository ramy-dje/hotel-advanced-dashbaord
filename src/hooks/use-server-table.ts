// useServerTable is hook that handles all the server pagination sorting and filtering using the react table

import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import axiosAPI from "@/lib/axios";
import { usePagination } from "@mantine/hooks";
import {
  ColumnDef,
  getCoreRowModel,
  Table,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";

interface Props<T> {
  data: T[];
  setData: (data: T[]) => void;
  totalData: number;
  setTotalData: (total: number) => void;
  defaultRowsPerPage?: "2" | "5" | "10" | "15" | "20" | "25";
  initialPage?: number;
  onError?: (err: Error | any) => void;
  column: ColumnDef<any, any>[];
  search: {
    query: string;
    state: string;
  };
  api: {
    url: string;
  };
  initialTable: { meta?: Record<any, any> } | TableOptions<any>;
  defaultFilters?: Record<string, string>;
  sorting: Record<string, string>;
}

interface ReturnedType<T> {
  table: Table<any>;
  pageRows: string;
  setPageRows: React.Dispatch<React.SetStateAction<string>>;
  isFetching: boolean;
  totalPages: number;
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  pagination: {
    range: (number | "dots")[];
    active: number;
    setPage: (pageNumber: number) => void;
    next: () => void;
    previous: () => void;
    first: () => void;
    last: () => void;
  };
}

function useServerTable<T>({
  data,
  setData,
  column,
  initialPage = 1,
  setTotalData,
  totalData,
  onError,
  defaultRowsPerPage = "10",
  search,
  initialTable,
  defaultFilters,
  sorting,
  api,
}: Props<T>): ReturnedType<T> {
  // columns
  const columns = useMemo(() => column, []);
  // row per page
  const [rowsPerPage, setRowsPerPage] = useState<string>(defaultRowsPerPage);
  // is fetching
  const [isFetching, setIsFetching] = useState(false);

  // filters
  const [currentFilters, setCurrentFilters] = useState<Record<string, string>>({
    ...defaultFilters,
  });

  // total pages
  const totalPages = useMemo(
    () =>
      Math.trunc(totalData / Number(rowsPerPage) || 0) +
        ((totalData / Number(rowsPerPage)) % 1 == 0 ? 0 : 1) || 1,
    [totalData, rowsPerPage]
  );
  // pagination
  const pagination = usePagination({
    total: totalPages,
    initialPage: initialPage,
  });

  // data fetching
  useEffect(() => {
    // creating the abort
    const newAbort = new AbortController();

    // fetching the data
    (async () => {
      // setting the fetching state to true
      setIsFetching(true);
      try {
        const res = await axiosAPI.get<ResponseAPIPaginationInterface<T>>(
          api.url,
          {
            signal: newAbort.signal,
            params: {
              size: Number(rowsPerPage) || 10,
              page: pagination.active - 1,
              // the search filed
              [search.query]: search.state.trim()
                ? search.state.trim()
                : undefined,
              // the filters
              ...currentFilters,
              // default filters
              ...defaultFilters,
              //   sorting
              ...sorting,
              // sorting_by_date_date:''
            },
          }
        );
        if ((res.status === 200, res.data)) {
          // setting the total
          setTotalData(res.data.total || 0);
          // setting the data
          setData(res.data.data);
        }
      } catch (err) {
        if ((err as AxiosError).code == "ERR_CANCELED") return;
        onError
          ? onError(err)
          : console.error("Error when fetching the paginated data", err);
      }
      // setting the fetching state to false
      setIsFetching(false);
    })();

    // canceling the old fetch
    return () => newAbort.abort();
  }, [search.state, pagination.active, rowsPerPage, currentFilters]);

  //  react table
  const table = useReactTable<any>({
    ...initialTable,
    getCoreRowModel: getCoreRowModel(),
    columns: columns,
    meta: initialTable.meta,
    manualPagination: true,
    data: data,
  });

  return {
    table,
    totalPages,
    isFetching,
    pagination,
    filters: currentFilters,
    setFilters: setCurrentFilters,
    pageRows: rowsPerPage,
    setPageRows: setRowsPerPage,
  };
}

export default useServerTable;
