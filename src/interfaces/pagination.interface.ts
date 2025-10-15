// the type of the response that returns data
export interface ResponseAPIPaginationInterface<T extends any> {
  page: number;
  size: number;
  total: number;
  data: T[];
}

// the type of the pagination request
export interface RequestAPIPaginationInterface {
  page: number;
  size: number;
}
