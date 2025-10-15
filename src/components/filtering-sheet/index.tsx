// The Page filtering sheet component

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";

interface Props {
  // open state
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // isLoading (when fetching some needed data for the filter)
  isLoading?: boolean;

  // title
  title: string;
  description: string;

  // states
  isFiltered: boolean;

  // react children
  children?: React.ReactNode;

  // handles
  handelShowResults: () => void;
  handleClear: () => void;
}

function FilteringSheet({
  title,
  description,
  children,
  handleClear,
  isFiltered,
  handelShowResults,
  open,
  setOpen,
  isLoading,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="max-sm:w-full pb-[5rem]">
        <SheetHeader className="text-left">
          {isLoading ? (
            <Skeleton className="w-[10em] mb-2 h-6" />
          ) : (
            <SheetTitle>{title}</SheetTitle>
          )}
          {isLoading ? (
            <Skeleton className="w-full h-6" />
          ) : (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>

        {/* if is loading */}
        <div className="w-full pt-5 px-1 h-full max-h-full sm-scrollbar overflow-y-auto flex flex-col justify-between">
          {isLoading ? (
            <Skeleton className="w-full h-full"></Skeleton>
          ) : (
            <>
              <div className="flex-1">{children}</div>
              {/* show results & cancel filters */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handelShowResults}
                  key="filter-button"
                  className="active:translate-y-0 active:scale-[0.96] transition-transform duration-100"
                >
                  Show Results
                </Button>
                {/* clear the filters */}
                <Button
                  onClick={handleClear}
                  disabled={!isFiltered}
                  key="clear-button"
                  className="active:translate-y-0 active:scale-[0.96] transition-transform duration-100"
                  variant="outline"
                >
                  Cancel Filters
                </Button>
              </div>
            </>
          )}
        </div>
        {/* filters inputs */}
      </SheetContent>
    </Sheet>
  );
}

export default FilteringSheet;
