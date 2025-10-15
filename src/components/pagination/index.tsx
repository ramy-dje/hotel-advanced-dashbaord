"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

interface Props {
  // use-pagination returned pagination
  pagination: {
    range: (number | "dots")[];
    active: number;
    setPage: (pageNumber: number) => void;
    next: () => void;
    previous: () => void;
    first: () => void;
    last: () => void;
  };
  isLoading?: boolean;
  // total pages
  totalPages: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<string>>;
  pageRows: string;
}

const TablePagination: React.FC<Props> = ({
  totalPages,
  setRowsPerPage,
  pageRows,
  isLoading,
  pagination,
}) => {
  return isLoading ? (
    <Skeleton className="w-full h-[3em]" />
  ) : (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex gap-2 items-center">
        <p className="w-[6.7em] max-sm:hidden text-nowrap text-sm block text-foreground/80">
          Row per page
        </p>

        <Select value={pageRows} onValueChange={(r) => setRowsPerPage(r)}>
          <SelectTrigger className="w-[5em]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent className="min-w-[5em]">
            <SelectItem key="2" value="2">
              2
            </SelectItem>
            <SelectItem key="5" value="5">
              5
            </SelectItem>
            <SelectItem key="10" value="10">
              10
            </SelectItem>
            <SelectItem key="15" value="15">
              15
            </SelectItem>
            <SelectItem key="20" value="20">
              20
            </SelectItem>
            <SelectItem key="25" value="25">
              25
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination className="flex justify-end mx-0 lg:mx-auto">
        <PaginationContent>
          <PaginationItem key={"Previousbutton"}>
            <PaginationPrevious
              disabled={pagination.active == 1}
              size="sm"
              onClick={() => pagination.previous()}
            />
          </PaginationItem>
          <div className="flex flex-row items-center gap-1 max-sm:hidden">
            {pagination.range.map((e, i, arr) => (
              <>
                {e == "dots" ? (
                  <PaginationItem key={e}>
                    <PaginationEllipsis className="size-9" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={e}>
                    <PaginationLink
                      disabled={arr.length == 1 && e == 1}
                      className="size-9"
                      isActive={pagination.active == e}
                      onClick={() => pagination.setPage(e)}
                    >
                      {e}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </>
            ))}
          </div>
          <PaginationItem key={"Nextbutton"}>
            <PaginationNext
              size="sm"
              disabled={pagination.active == totalPages}
              onClick={() => pagination.next()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
