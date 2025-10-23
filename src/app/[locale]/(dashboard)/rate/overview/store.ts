import { RatePlanInterface } from "@/interfaces/rate.interface";
import { create } from "zustand";

// The Rate Categories Page store (with zustand)

interface StoreType {
  rates_list: RatePlanInterface[];
  rates_number: number;

  // actions
  set_many: (rates: RatePlanInterface[]) => void;
  add_rate: (rate: RatePlanInterface) => void;
  remove_rate: (id: string) => void;
  remove_many_rates: (ids: string[]) => void;
  update_rate: (id: string, rate: RatePlanInterface) => void;

  set_total: (num: number) => void;
}

const useRatePlanStore = create<StoreType>((set) => ({
  rates_list: [],
  rates_number: 0,

  // set many
  set_many: (rates) =>
    set(() => ({
      rates_list: rates,
    })),

  // actions
  add_rate: (rate) =>
    set((old) => ({
      rates_list: [...old.rates_list, rate],
      rates_number: old.rates_number + 1,
    })),

  // remove rate
  remove_rate: (id) =>
    set((old) => ({
      rates_list: old.rates_list.filter((e) => e.id !== id),
      rates_number: old.rates_number - 1,
    })),

  // update rate
  update_rate: (id, rate) =>
    set((old) => ({
      rates_list: old.rates_list.map((e) => (e.id == id ? rate : e)),
    })),

  // remove many rates
  remove_many_rates: (ids) =>
    set((old) => ({
      rates_list: old.rates_list.filter((e) => !ids.includes(e.id)),
      rates_number: old.rates_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      rates_number: num,
    })),
}));

export default useRatePlanStore;
