import { useCallback, useEffect, useMemo, useState } from "react";
import { create } from "zustand";

// use analytics fetch hook for fetching & chasing the analytics data for each type (e.g rooms ,reservations)

// zustand store hook for saving and cashing the data

interface StoreMethodsType {
  // set key data method to set a property with data
  setKeyData: (key: string, data: any | null) => void;
  // get key data method to get data from a property if it doesn't exist it returns 'null'
  getKeyData: <T extends any>(key: string) => T | null;
}

// store methods with properties
type StoreType = StoreMethodsType & Record<string, any>;

// the analytics store hook implementation
const useAnalyticsStore = create<StoreType>((set, get) => ({
  // set data
  setKeyData: (key, data) =>
    set({
      [key]: data,
    }),
  // get data
  getKeyData: (key) => get()[key] || null,
}));

// Types

interface ReturnedType<T extends any> {
  isFetching: boolean;
  error: Error | null;
  data: T | null;
  refresh: () => void;
}

// the hook analytics fetch logic
const useAnalyticsFetch = <T extends any>(
  key: string,
  fetcher: () => Promise<T | any>,
  options?: {
    fetchAtFirst?: boolean;
    cache?: boolean;
  }
): ReturnedType<T> => {
  // options
  // fetchAtFirst
  const fetchAtFirst = useMemo(
    () => (options?.fetchAtFirst == undefined ? true : options.fetchAtFirst),
    []
  );
  // cache
  const cache = useMemo(
    () => (options?.cache == undefined ? true : options.cache),
    []
  );

  // is fetching state
  const [isFetching, setIsFetching] = useState(false);

  // error state
  const [error, setError] = useState<Error | null>(null);

  // store hook methods
  const { getKeyData: getter, setKeyData: setter } = useAnalyticsStore();

  // data
  const [data, setData] = useState<T | null>(() => {
    return getter(key);
  });

  // data
  // const data = (store[key] || null) as T | null;

  // fetch method
  const fetch = useCallback(() => {
    // check if the fetch function exist
    if (!fetcher) return;
    // fetching logic
    (async () => {
      // start the loading
      setIsFetching(true);

      try {
        // fetching the data
        const result = await fetcher();
        // saving the data
        setData(result);
        setter(key, result);
      } catch {
        //   save the error
        setError(new Error(`Failed Fetch : ${key} Analytics`));
      }

      // stop the loading
      setIsFetching(false);
    })();
  }, []);

  // fetching at first logic and caching
  useEffect(() => {
    // check if the cache if isn't enabled & data exists to clear it
    if (!cache && data !== null) setter(key, null);

    // check if the fetch at first is enabled
    // with cache and data dons't exist
    if ((fetchAtFirst && cache && data == null) || (fetchAtFirst && !cache)) {
      fetch();
    }
  }, []);

  // returning the data and methods
  return {
    data,
    error,
    isFetching,
    refresh: fetch,
  };
};

export default useAnalyticsFetch;
