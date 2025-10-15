import { useCallback, useMemo, useReducer } from "react";

// The useFiltering hook is used to handle the filtering logic and save values with clearing and applying filters (Should be used with the FilteringSheet component)

interface Props<T> {
  filters: T | Record<string, string>;
  setFilters: React.Dispatch<
    React.SetStateAction<T | Record<string, string> | any>
  >;

  defaultValues: Partial<T>;
}

interface ReturnedType<T> {
  isFiltered: boolean;
  filterValues: T;
  setFilterValue: (key: keyof T, value: string) => void;
  // handlers
  handleClear: () => void;
  handleApplyFilters: () => void;
}

// Reducer function logic
function reducer<T>(
  state: T,
  action: { type: keyof T | string; value: string; defaultValues?: T | unknown }
) {
  // clear all data
  if (action.type == "_clear_") {
    return { ...(action.defaultValues as any) };
  } else {
    // edit the state using the action type
    return { ...state, [action.type]: action.value };
  }
}

interface FilteringType extends Record<string, string | any> {}

// the hook function logic
const useFiltering = <T extends FilteringType>({
  filters,
  setFilters,
  defaultValues,
}: Props<T>): ReturnedType<T> => {
  // reducer to save the filters
  const [state, dispatch] = useReducer(reducer, defaultValues as T);

  // returns if the filters are applied
  const isFiltered = useMemo(() => {
    return Object.keys(filters).length !== 0;
  }, [filters]);

  // handle apply filters
  const handleApplyFilters = () => {
    const _filters: Record<string, string> = {};

    // checking the valid values and add them to the filters object
    for (const key in state) {
      if (
        state[key] &&
        (state[key] as string | number).toString().trim() !== ""
      ) {
        _filters[key] = state[key].toString();
      }
    }

    // setting the filters
    setFilters(_filters as T);
  };

  // handle clear filters
  const handleClear = useCallback(() => {
    // dispatch to clear the states
    dispatch({
      type: "_clear_",
      defaultValues: defaultValues,
      value: "",
    });
    // clear the filters
    setFilters({} as T);
  }, []);

  return {
    isFiltered,
    filterValues: state as T,
    setFilterValue: (key, value) => dispatch({ type: key as never, value }),
    handleClear: handleClear,
    handleApplyFilters: handleApplyFilters,
  };
};

export default useFiltering;
