import { useCallback, useEffect, useState } from "react";

//  a hook for fetching the needed data for the filters sheet (Should be used with the useFiltering hook and FilteringSheet component)

interface ReturnedType<T extends Record<string, () => Promise<any>>> {
  isFetching: boolean;
  fetched: boolean;
  error: Error | null;
  data: {
    [K in keyof T]: Awaited<ReturnType<T[K]>> | null;
  };
  refetch: () => void;
}

// the hook function logic
const useFilteringFetch = <T extends Record<string, () => Promise<any>>>(
  methods: T,
  fetchAtFirst: boolean = false
): ReturnedType<T> => {
  //  is fetching state
  const [isFetching, setIsFetching] = useState(fetchAtFirst);
  // when data fetched
  const [fetched, setFetched] = useState(false);
  // error state
  const [error, setError] = useState<Error | null>(null);
  // fetched data
  const [data, setData] = useState<Record<any, any | null>>({});

  // fetch method
  const fetch = useCallback(() => {
    (async () => {
      // start the loading
      setIsFetching(true);
      // if the data is already fetched return
      if (fetched) {
        setIsFetching(false);
        return;
      }
      // looping & fetching the data
      for (const key_method in methods) {
        if (methods.hasOwnProperty(key_method)) {
          try {
            // fetching the data
            const result = await methods[key_method]();
            // saving the data
            setData((prevData) => ({ ...prevData, [key_method]: result }));
          } catch {
            // saving the data as null
            setData((prevData) => ({ ...prevData, [key_method]: null }));
            //   save the error
            setError(new Error(`Failed Fetch : ${key_method}`));
          }
        }
      }
      // if isn't in dev mode re-fetch every mount

      // set fetched to 'true'
      setFetched(true);

      // stop the loading
      setIsFetching(false);
    })();
  }, [fetched]);

  // fetching the needed data for filtering
  useEffect(() => {
    // fetch at first if isn't in the dev mode
    if (fetchAtFirst) {
      fetch();
    }
  }, []);

  // returning the data and methods
  return {
    data: data as any,
    error,
    fetched,
    isFetching,
    refetch: fetch,
  };
};

export default useFilteringFetch;
